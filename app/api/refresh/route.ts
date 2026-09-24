import { revalidatePath } from "next/cache";
import { fetchMainStamp, runCatalogRefresh, statusWithoutDispatch } from "@/lib/refresh-dispatch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const main = await fetchMainStamp();
  return Response.json(statusWithoutDispatch(main));
}

export async function POST() {
  const status = await runCatalogRefresh();
  // Revalidate the Home RSC payload. Catalog JSON is still this deploy —
  // a new last-checked stamp only appears after the Action commits and Vercel rebuilds.
  revalidatePath("/");
  return Response.json(status);
}
