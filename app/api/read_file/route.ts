import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "@/app/config/server";
import md5 from "spark-md5";
import { ACCESS_CODE_PREFIX } from "@/app/constant";
import { parseMinerU } from "@/app/api/mineru";

export async function POST(req: NextRequest) {
  const serverConfig = getServerSideConfig();

  // ── Access code validation ────────────────────────────────────
  if (serverConfig.needCode) {
    const authToken = (req.headers.get("Authorization") ?? "").trim();
    const token = authToken.replace(/^Bearer\s+/i, "").trim();
    const accessCode = token.startsWith(ACCESS_CODE_PREFIX)
      ? token.slice(ACCESS_CODE_PREFIX.length)
      : "";
    const hashedCode = md5.hash(accessCode).trim();
    if (!serverConfig.codes.has(hashedCode)) {
      return NextResponse.json(
        { error: !accessCode ? "empty access code" : "wrong access code" },
        { status: 403 },
      );
    }
  }

  try {
    const inForm = await req.formData();
    const file = inForm.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const engine = (inForm.get("engine") as string | null) ?? "markitdown";

    // ── MinerU path ──────────────────────────────────────────────
    if (engine === "mineru") {
      if (!serverConfig.minerUServer) {
        return NextResponse.json(
          { error: "MinerU server not configured" },
          { status: 503 },
        );
      }

      try {
        const result = await parseMinerU(
          serverConfig.minerUServer,
          file,
          inForm,
          req.signal,
        );
        if ("markdown" in result) {
          return NextResponse.json({ data: result.markdown });
        }
        return new NextResponse(result.zip, {
          headers: {
            "Content-Type": "application/zip",
            "Content-Disposition": 'attachment; filename="result.zip"',
          },
        });
      } catch (err) {
        return NextResponse.json(
          { error: (err as Error).message },
          { status: 502 },
        );
      }
    }

    // ── MarkItDown path (default) ─────────────────────────────────
    const outForm = new FormData();
    outForm.append("file", file);

    const enableDocIntel = inForm.get("enableDocIntelligence");
    if (enableDocIntel === "true") {
      outForm.append("docintel", "true");
    }

    const res = await fetch(`${serverConfig.fileReadingServer}/read_file`, {
      method: "POST",
      body: outForm,
    });

    const json = await res.json().catch(() => null);
    if (res.ok && json && (json.code === 0 || json.code === "0")) {
      return NextResponse.json({ data: json.data });
    }
    return NextResponse.json(
      { error: json?.msg ?? "Unknown response" },
      { status: 502 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}

export const runtime = "edge";
