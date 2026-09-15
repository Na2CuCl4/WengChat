"use client";

import { ACCESS_CODE_PREFIX } from "../constant";
import { getClientConfig } from "../config/client";
import { useAccessStore } from "../store/access";
import type { ListToolsResponse, McpRequestMessage } from "./types";

type McpTools = {
  clientId: string;
  tools: ListToolsResponse | null;
}[];

async function readResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.error ?? `MCP request failed (${response.status})`);
  }
  return body as T;
}

function authorizedHeaders() {
  const accessCode = useAccessStore.getState().accessCode.trim();
  if (!accessCode) throw new Error("MCP requires an access code");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${ACCESS_CODE_PREFIX}${accessCode}`,
  };
}

export async function isMcpEnabled() {
  if (getClientConfig()?.buildMode === "export") return false;
  const response = await fetch("/api/mcp?action=enabled");
  return (await readResponse<{ enabled: boolean }>(response)).enabled;
}

export async function initializeMcpSystem() {
  const response = await fetch("/api/mcp", {
    method: "POST",
    headers: authorizedHeaders(),
    body: JSON.stringify({ action: "initialize" }),
  });
  return readResponse<{ ok: true }>(response);
}

export async function getAllTools() {
  const response = await fetch("/api/mcp?action=tools", {
    headers: authorizedHeaders(),
  });
  return (await readResponse<{ tools: McpTools }>(response)).tools;
}

export async function executeMcpAction(
  clientId: string,
  request: McpRequestMessage,
) {
  const response = await fetch("/api/mcp", {
    method: "POST",
    headers: authorizedHeaders(),
    body: JSON.stringify({ action: "execute", clientId, request }),
  });
  return (await readResponse<{ result: unknown }>(response)).result;
}
