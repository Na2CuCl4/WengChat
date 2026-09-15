// ref: https://spec.modelcontextprotocol.io/specification/basic/messages/

import { z } from "zod";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";

const MAX_REQUEST_BYTES = 64 * 1024;

function isBoundedJson(value: unknown) {
  try {
    const json = JSON.stringify(value);
    return json !== undefined && new Blob([json]).size <= MAX_REQUEST_BYTES;
  } catch {
    return false;
  }
}

export const McpRequestMessageSchema = z
  .object({
    method: z.literal("tools/call"),
    params: z
      .object({
        name: z.string().min(1).max(256),
        arguments: z.record(z.unknown()).optional(),
      })
      .strict(),
  })
  .strict()
  .refine(isBoundedJson, { message: "MCP request exceeds 64 KiB" });

export type McpRequestMessage = z.infer<typeof McpRequestMessageSchema>;

////////////
// WengChat
////////////
export interface ListToolsResponse {
  tools: {
    name?: string;
    description?: string;
    inputSchema?: object;
    [key: string]: any;
  };
}

export type McpClientData =
  | McpActiveClient
  | McpErrorClient
  | McpInitializingClient;

interface McpInitializingClient {
  client: null;
  tools: null;
  errorMsg: null;
}

interface McpActiveClient {
  client: Client;
  tools: ListToolsResponse;
  errorMsg: null;
}

interface McpErrorClient {
  client: null;
  tools: null;
  errorMsg: string;
}

// 服务器状态类型
export type ServerStatus =
  | "undefined"
  | "active"
  | "paused"
  | "error"
  | "initializing";

export interface ServerStatusResponse {
  status: ServerStatus;
  errorMsg: string | null;
}

// MCP 服务器配置相关类型
export const McpClientIdSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/)
  .refine(
    (value) =>
      value !== "__proto__" && value !== "constructor" && value !== "prototype",
  );

const McpEnvironmentSchema = z
  .record(
    z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/),
    z.string().max(32 * 1024),
  )
  .refine((value) => Object.keys(value).length <= 128);

export const ServerConfigSchema = z
  .object({
    command: z
      .string()
      .min(1)
      .max(1024)
      .refine((value) => !value.includes("\0")),
    args: z
      .array(
        z
          .string()
          .max(8192)
          .refine((value) => !value.includes("\0")),
      )
      .max(128),
    env: McpEnvironmentSchema.optional(),
    status: z.enum(["active", "paused", "error"]).optional(),
  })
  .strict();

export const McpConfigDataSchema = z
  .object({
    mcpServers: z.record(McpClientIdSchema, ServerConfigSchema),
  })
  .strict();

export type ServerConfig = z.infer<typeof ServerConfigSchema>;
export type McpConfigData = z.infer<typeof McpConfigDataSchema>;

export const DEFAULT_MCP_CONFIG: McpConfigData = {
  mcpServers: {},
};
