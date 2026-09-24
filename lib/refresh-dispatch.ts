import {
  formatLastChecked,
  isRefreshStamp,
  refreshStamp,
  stampIsNewer,
  type RefreshStamp,
  type RefreshStatus,
} from "@/lib/refresh";

const WORKFLOW_FILE = "daily-refresh.yml";
const RECENT_MS = 15 * 60 * 1000;

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function refreshRepo(): string {
  const owner = readEnv("VERCEL_GIT_REPO_OWNER") || "hondoentertainment";
  const slug = readEnv("VERCEL_GIT_REPO_SLUG") || "seattle-home-tickets";
  return `${owner}/${slug}`;
}

export function refreshDispatchToken(): string | undefined {
  return readEnv("GH_REFRESH_TOKEN") || readEnv("GITHUB_REFRESH_TOKEN");
}

function githubHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "seattle-home-tickets-refresh",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function fetchMainStamp(): Promise<RefreshStamp | null> {
  const repo = refreshRepo();
  const token = refreshDispatchToken();
  const urls = [
    `https://raw.githubusercontent.com/${repo}/main/data/refresh.json`,
    `https://api.github.com/repos/${repo}/contents/data/refresh.json?ref=main`,
  ];

  for (const url of urls) {
    try {
      const headers = githubHeaders(token);
      const response = await fetch(url, { cache: "no-store", headers });
      if (!response.ok) continue;
      if (url.includes("api.github.com")) {
        const payload = (await response.json()) as { content?: string; encoding?: string };
        if (!payload.content) continue;
        const decoded = Buffer.from(payload.content, "base64").toString("utf8");
        const parsed: unknown = JSON.parse(decoded);
        if (isRefreshStamp(parsed)) return parsed;
        continue;
      }
      const parsed: unknown = await response.json();
      if (isRefreshStamp(parsed)) return parsed;
    } catch {
      // Public raw and the Contents API are best-effort. Deploy stamp still stands.
    }
  }
  return null;
}

type WorkflowRun = {
  status?: string;
  created_at?: string;
};

async function recentWorkflowState(
  token: string,
): Promise<"in-flight" | "recent" | "idle"> {
  const url = `https://api.github.com/repos/${refreshRepo()}/actions/workflows/${WORKFLOW_FILE}/runs?per_page=5`;
  const response = await fetch(url, { cache: "no-store", headers: githubHeaders(token) });
  if (!response.ok) return "idle";
  const payload = (await response.json()) as { workflow_runs?: WorkflowRun[] };
  const runs = payload.workflow_runs ?? [];
  if (runs.some((run) => run.status === "queued" || run.status === "in_progress" || run.status === "waiting")) {
    return "in-flight";
  }
  const newest = runs[0]?.created_at ? Date.parse(runs[0].created_at) : NaN;
  if (!Number.isNaN(newest) && Date.now() - newest < RECENT_MS) return "recent";
  return "idle";
}

async function dispatchWorkflow(token: string): Promise<boolean> {
  const url = `https://api.github.com/repos/${refreshRepo()}/actions/workflows/${WORKFLOW_FILE}/dispatches`;
  const response = await fetch(url, {
    method: "POST",
    cache: "no-store",
    headers: {
      ...githubHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ref: "main",
      inputs: { reason: "home-refresh-button" },
    }),
  });
  return response.status === 204;
}

function baseStatus(main: RefreshStamp | null, dispatchConfigured: boolean): Omit<RefreshStatus, "dispatch" | "message"> {
  return {
    deploy: refreshStamp,
    main,
    newerOnMain: main ? stampIsNewer(main, refreshStamp) : false,
    dispatchConfigured,
  };
}

export function statusWithoutDispatch(main: RefreshStamp | null): RefreshStatus {
  const token = refreshDispatchToken();
  const base = baseStatus(main, Boolean(token));
  const last = formatLastChecked(refreshStamp.lastChecked);
  return {
    ...base,
    dispatch: token ? null : "not-configured",
    message: token
      ? `This deploy last checked ${last}. Catalog dates stay on the published seed.`
      : `Reloaded this page. Catalog last checked ${last}. Production updates when the daily GitHub Action commits — it does not scrape live scores or prices.`,
  };
}

export async function runCatalogRefresh(): Promise<RefreshStatus> {
  const main = await fetchMainStamp();
  const token = refreshDispatchToken();
  const base = baseStatus(main, Boolean(token));

  const last = formatLastChecked(refreshStamp.lastChecked);

  if (!token) {
    return {
      ...base,
      dispatch: "not-configured",
      message:
        `Reloaded this page. Catalog last checked ${last}. Production updates around 7:00 AM PT when the GitHub Action stamps last-checked and Vercel redeploys. No live scores or prices.`,
    };
  }

  const recent = await recentWorkflowState(token);
  if (recent === "in-flight") {
    return {
      ...base,
      dispatch: "already-running",
      message: `A catalog check is already running on GitHub. This page still shows the current deploy. Last checked ${last}.`,
    };
  }
  if (recent === "recent") {
    return {
      ...base,
      dispatch: "recent",
      message: `A catalog check ran in the last 15 minutes. Reloaded this page. Last checked ${last}. No live scores or prices.`,
    };
  }

  const queued = await dispatchWorkflow(token);
  if (!queued) {
    return {
      ...base,
      dispatch: "failed",
      message: `Could not queue the GitHub catalog check (token or permissions). Reloaded this page. Last checked ${last}.`,
    };
  }

  return {
    ...base,
    dispatch: "queued",
    message:
      "Catalog check queued. Last-checked updates after that job commits and Vercel redeploys. This page still shows the current deploy — not live scores or prices.",
  };
}
