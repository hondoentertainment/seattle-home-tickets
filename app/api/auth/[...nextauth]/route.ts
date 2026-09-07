import type { NextRequest } from "next/server";
import { handlers } from "@/auth";

async function handle(
  method: (request: NextRequest) => Promise<Response>,
  request: NextRequest,
): Promise<Response> {
  try {
    return await method(request);
  } catch (error) {
    console.error("Auth.js route error", error);
    return Response.json(
      {
        error: "auth-unavailable",
        message: "Google sign-in is not configured on this deploy.",
      },
      { status: 503 },
    );
  }
}

export function GET(request: NextRequest) {
  return handle(handlers.GET, request);
}

export function POST(request: NextRequest) {
  return handle(handlers.POST, request);
}
