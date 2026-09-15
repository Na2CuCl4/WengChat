import { NextResponse } from "next/server";
import { z } from "zod";

import { checkMcpAccess, isMcpFeatureEnabled } from "@/app/mcp/security";
import { McpClientIdSchema, McpRequestMessageSchema } from "@/app/mcp/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const postSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("initialize") }).strict(),
  z
    .object({ action: z.literal("pause"), clientId: McpClientIdSchema })
    .strict(),
  z
    .object({ action: z.literal("resume"), clientId: McpClientIdSchema })
    .strict(),
  z.object({ action: z.literal("restart") }).strict(),
  z
    .object({
      action: z.literal("execute"),
      clientId: McpClientIdSchema,
      request: McpRequestMessageSchema,
    })
    .strict(),
]);

const noStore = { "Cache-Control": "no-store" };

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: noStore });
}

function authorize(request: Request) {
  const access = checkMcpAccess(request);
  return access.ok ? null : json({ error: access.error }, access.status);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  if (action === "enabled") {
    return json({ enabled: isMcpFeatureEnabled() });
  }

  if (action !== "status" && action !== "count" && action !== "tools") {
    return json({ error: "Invalid request" }, 400);
  }

  const denied = authorize(request);
  if (denied) return denied;

  const clientId = url.searchParams.get("clientId");
  if (clientId !== null && !McpClientIdSchema.safeParse(clientId).success) {
    return json({ error: "Invalid request" }, 400);
  }

  try {
    const actions = await import("@/app/mcp/actions");
    switch (action) {
      case "status": {
        if (clientId !== null) return json({ error: "Invalid request" }, 400);
        const statuses = await actions.getClientsStatus();
        return json({
          status: Object.fromEntries(
            Object.entries(statuses).map(([id, value]) => [
              id,
              { status: value.status },
            ]),
          ),
        });
      }
      case "count":
        if (clientId !== null) return json({ error: "Invalid request" }, 400);
        return json({ count: await actions.getAvailableClientsCount() });
      case "tools":
        return json({
          tools:
            clientId === null
              ? await actions.getAllTools()
              : await actions.getClientTools(clientId),
        });
    }
  } catch {
    return json({ error: "MCP request failed" }, 500);
  }
}

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  const action =
    typeof input === "object" && input !== null && "action" in input
      ? (input as { action?: unknown }).action
      : undefined;
  if (
    action !== "initialize" &&
    action !== "pause" &&
    action !== "resume" &&
    action !== "restart" &&
    action !== "execute"
  ) {
    return json({ error: "Invalid request" }, 400);
  }

  const denied = authorize(request);
  if (denied) return denied;

  const parsed = postSchema.safeParse(input);
  if (!parsed.success) {
    return json({ error: "Invalid request" }, 400);
  }

  try {
    const actions = await import("@/app/mcp/actions");
    switch (parsed.data.action) {
      case "initialize":
        await actions.initializeMcpSystem();
        return json({ ok: true });
      case "pause":
        await actions.pauseMcpServer(parsed.data.clientId);
        return json({ ok: true });
      case "resume":
        await actions.resumeMcpServer(parsed.data.clientId);
        return json({ ok: true });
      case "restart":
        await actions.restartAllClients();
        return json({ ok: true });
      case "execute":
        return json({
          result: await actions.executeMcpAction(
            parsed.data.clientId,
            parsed.data.request,
          ),
        });
    }
  } catch {
    return json({ error: "MCP request failed" }, 500);
  }
}
