import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "@/app/config/server";
import { getMinerUHealth, getMinerUTiers } from "@/app/api/mineru";

async function handle(req: NextRequest) {
  const serverConfig = getServerSideConfig();
  const engine = req.nextUrl.searchParams.get("engine") ?? "markitdown";

  try {
    if (engine === "mineru") {
      if (!serverConfig.minerUServer) {
        return NextResponse.json(
          { error: "MinerU server not configured" },
          { status: 503 },
        );
      }
      try {
        const health = await getMinerUHealth(
          serverConfig.minerUServer,
          req.signal,
        );
        const tiers =
          health.api_version === "v1"
            ? await getMinerUTiers(serverConfig.minerUServer, req.signal)
            : undefined;
        return NextResponse.json({ ...health, tiers });
      } catch (err) {
        return NextResponse.json(
          { error: (err as Error).message },
          { status: 502 },
        );
      }
    }

    // ── MarkItDown path (default) ─────────────────────────────────
    if (!serverConfig.fileReadingServer) {
      return NextResponse.json(
        { error: "File reading server not configured" },
        { status: 503 },
      );
    }
    const res = await fetch(serverConfig.fileReadingServer, {
      headers: { accept: "application/json" },
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json || json.code !== 0) {
      return NextResponse.json(
        { error: "Health check failed" },
        { status: 502 },
      );
    }
    return NextResponse.json({
      status: json.msg ?? "healthy",
      version: json.data?.version,
      processing_tasks: json.data?.processing_tasks,
      completed_tasks: json.data?.completed_tasks,
      failed_tasks: json.data?.failed_tasks,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}

export const GET = handle;

export const runtime = "edge";
