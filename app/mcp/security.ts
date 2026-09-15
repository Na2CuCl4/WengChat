import { getServerSideConfig } from "@/app/config/server";
import { ACCESS_CODE_PREFIX } from "@/app/constant";
import md5 from "spark-md5";

export type McpAccessFailure = {
  ok: false;
  status: 401 | 403 | 503;
  error: string;
};

export function isMcpFeatureEnabled() {
  return process.env.ENABLE_MCP === "true";
}

export function requireMcpFeatureEnabled() {
  if (!isMcpFeatureEnabled()) throw new Error("MCP is disabled");
}

export function checkMcpAccess(
  request: Pick<Request, "headers">,
): { ok: true } | McpAccessFailure {
  if (!isMcpFeatureEnabled()) {
    return { ok: false, status: 403, error: "MCP is disabled" };
  }

  try {
    const config = getServerSideConfig();
    if (!config.needCode || config.codes.size === 0) {
      return { ok: false, status: 503, error: "MCP is unavailable" };
    }

    const prefix = `Bearer ${ACCESS_CODE_PREFIX}`;
    const authorization = request.headers.get("Authorization");
    if (!authorization?.startsWith(prefix)) {
      return { ok: false, status: 401, error: "Unauthorized" };
    }

    const accessCode = authorization.slice(prefix.length);
    if (
      !accessCode ||
      accessCode !== accessCode.trim() ||
      !config.codes.has(md5.hash(accessCode))
    ) {
      return { ok: false, status: 401, error: "Unauthorized" };
    }

    return { ok: true };
  } catch {
    return { ok: false, status: 503, error: "MCP is unavailable" };
  }
}
