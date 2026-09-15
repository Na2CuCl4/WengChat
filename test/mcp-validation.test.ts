import { jest } from "@jest/globals";

import { buildMcpChildEnvironment, createClient } from "../app/mcp/client";
import {
  McpClientIdSchema,
  McpConfigDataSchema,
  McpRequestMessageSchema,
} from "../app/mcp/types";

const originalEnvironment = process.env;

afterEach(() => {
  process.env = originalEnvironment;
});

describe("MCP trust-boundary validation", () => {
  test("accepts only bounded tools/call requests", () => {
    expect(
      McpRequestMessageSchema.safeParse({
        method: "tools/call",
        params: { name: "read_file", arguments: { path: "/tmp/example" } },
      }).success,
    ).toBe(true);
    expect(
      McpRequestMessageSchema.safeParse({
        method: "resources/read",
        params: { name: "read_file" },
      }).success,
    ).toBe(false);
    expect(
      McpRequestMessageSchema.safeParse({
        method: "tools/call",
        params: { name: "read_file", arguments: { data: "x".repeat(65536) } },
      }).success,
    ).toBe(false);
  });

  test("rejects deeply nested arguments without overflowing validation", () => {
    const deeplyNested: Record<string, unknown> = {};
    let cursor = deeplyNested;
    for (let depth = 0; depth < 10_000; depth++) {
      const next: Record<string, unknown> = {};
      cursor.next = next;
      cursor = next;
    }

    expect(
      McpRequestMessageSchema.safeParse({
        method: "tools/call",
        params: { name: "read_file", arguments: deeplyNested },
      }).success,
    ).toBe(false);
  });

  test("passes only SDK-safe and locally configured environment variables", () => {
    process.env = {
      ...originalEnvironment,
      PATH: "/safe/bin",
      OPENAI_API_KEY: "server-secret",
      CODE: "access-secret",
    };

    const childEnvironment = buildMcpChildEnvironment({
      MCP_LOCAL_TOKEN: "trusted-local-value",
    });

    expect(childEnvironment.PATH).toBe("/safe/bin");
    expect(childEnvironment.MCP_LOCAL_TOKEN).toBe("trusted-local-value");
    expect(childEnvironment.OPENAI_API_KEY).toBeUndefined();
    expect(childEnvironment.CODE).toBeUndefined();
  });

  test("rejects before client creation when MCP is disabled", async () => {
    process.env = { ...originalEnvironment };
    delete process.env.ENABLE_MCP;

    await expect(
      createClient("local-server", { command: "node", args: [] }),
    ).rejects.toThrow("MCP is disabled");
  });

  test("rejects invalid client IDs", () => {
    expect(McpClientIdSchema.safeParse("filesystem-1").success).toBe(true);
    expect(McpClientIdSchema.safeParse("../../bin/sh").success).toBe(false);
    expect(McpClientIdSchema.safeParse("__proto__").success).toBe(false);
  });

  test("rejects the entire config when any server is malformed", () => {
    expect(
      McpConfigDataSchema.safeParse({
        mcpServers: {
          valid: { command: "node", args: ["server.js"] },
          invalid: { command: "node", args: "server.js" },
        },
      }).success,
    ).toBe(false);
  });
});

describe("MCP process fail-closed behavior", () => {
  const readFile = jest.fn<() => Promise<string>>();
  const createClient = jest.fn();
  let initializeMcpSystem: () => Promise<unknown>;

  beforeAll(async () => {
    jest.resetModules();
    jest.unstable_mockModule("fs/promises", () => ({
      default: { readFile, mkdir: jest.fn(), writeFile: jest.fn() },
    }));
    jest.unstable_mockModule("@/app/mcp/client", () => ({
      createClient,
      executeRequest: jest.fn(),
      listTools: jest.fn(),
      removeClient: jest.fn(),
    }));
    ({ initializeMcpSystem } = await import("@/app/mcp/actions"));
  });

  beforeEach(() => {
    readFile.mockReset();
    createClient.mockReset();
  });

  test("does not read config or create a client when disabled", async () => {
    process.env = { ...originalEnvironment };
    delete process.env.ENABLE_MCP;

    await expect(initializeMcpSystem()).rejects.toThrow("MCP is disabled");
    expect(readFile).not.toHaveBeenCalled();
    expect(createClient).not.toHaveBeenCalled();
  });

  test("does not create any client from a partially malformed config", async () => {
    process.env = { ...originalEnvironment, ENABLE_MCP: "true" };
    readFile.mockResolvedValue(
      JSON.stringify({
        mcpServers: {
          valid: { command: "node", args: ["server.js"] },
          invalid: { command: "node", args: "server.js" },
        },
      }),
    );

    await expect(initializeMcpSystem()).rejects.toThrow(
      "Invalid MCP configuration",
    );
    expect(createClient).not.toHaveBeenCalled();
  });
});
