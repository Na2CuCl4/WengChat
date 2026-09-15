import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import {
  getDefaultEnvironment,
  StdioClientTransport,
} from "@modelcontextprotocol/sdk/client/stdio.js";
import { MCPClientLogger } from "./logger";
import {
  ListToolsResponse,
  McpClientIdSchema,
  McpRequestMessageSchema,
  ServerConfig,
  ServerConfigSchema,
} from "./types";
import { requireMcpFeatureEnabled } from "./security";

const logger = new MCPClientLogger();

export function buildMcpChildEnvironment(env?: Record<string, string>) {
  return { ...getDefaultEnvironment(), ...env };
}

export async function createClient(
  id: unknown,
  config: ServerConfig,
): Promise<Client> {
  requireMcpFeatureEnabled();
  const clientId = McpClientIdSchema.parse(id);
  const serverConfig = ServerConfigSchema.parse(config);
  logger.info(`Creating client for ${clientId}...`);

  const transport = new StdioClientTransport({
    command: serverConfig.command,
    args: serverConfig.args,
    env: buildMcpChildEnvironment(serverConfig.env),
  });

  const client = new Client(
    {
      name: `wengchat-mcp-client-${clientId}`,
      version: "1.0.0",
    },
    {
      capabilities: {},
    },
  );
  await client.connect(transport);
  return client;
}

export async function removeClient(client: Client) {
  logger.info(`Removing client...`);
  await client.close();
}

export async function listTools(client: Client): Promise<ListToolsResponse> {
  return client.listTools();
}

export async function executeRequest(client: Client, request: unknown) {
  return client.callTool(McpRequestMessageSchema.parse(request).params);
}
