import fs from "fs/promises";
import path from "path";

import {
  createClient,
  executeRequest,
  listTools,
  removeClient,
} from "./client";
import { MCPClientLogger } from "./logger";
import {
  DEFAULT_MCP_CONFIG,
  McpClientData,
  McpClientIdSchema,
  McpConfigData,
  McpConfigDataSchema,
  ServerConfig,
  ServerConfigSchema,
  ServerStatusResponse,
} from "./types";
import { isMcpFeatureEnabled, requireMcpFeatureEnabled } from "./security";

const logger = new MCPClientLogger("MCP Actions");
const CONFIG_PATH = path.join(process.cwd(), "app/mcp/mcp_config.json");
const clientsMap = new Map<string, McpClientData>();

async function getMcpConfigFromFile(): Promise<McpConfigData> {
  requireMcpFeatureEnabled();

  let config: string;
  try {
    config = await fs.readFile(CONFIG_PATH, "utf-8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return DEFAULT_MCP_CONFIG;
    }
    throw new Error("Failed to load MCP configuration");
  }

  try {
    return McpConfigDataSchema.parse(JSON.parse(config));
  } catch {
    throw new Error("Invalid MCP configuration");
  }
}

async function updateMcpConfig(config: McpConfigData): Promise<void> {
  requireMcpFeatureEnabled();
  const validatedConfig = McpConfigDataSchema.parse(config);
  await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true });
  await fs.writeFile(CONFIG_PATH, JSON.stringify(validatedConfig, null, 2), {
    mode: 0o600,
  });
}

async function initializeSingleClient(
  clientId: string,
  serverConfig: ServerConfig,
) {
  requireMcpFeatureEnabled();
  const validatedClientId = McpClientIdSchema.parse(clientId);
  const validatedConfig = ServerConfigSchema.parse(serverConfig);

  if (validatedConfig.status === "paused") {
    logger.info(
      `Skipping initialization for paused client [${validatedClientId}]`,
    );
    return;
  }

  logger.info(`Initializing client [${validatedClientId}]...`);
  clientsMap.set(validatedClientId, {
    client: null,
    tools: null,
    errorMsg: null,
  });

  try {
    const client = await createClient(validatedClientId, validatedConfig);
    try {
      const tools = await listTools(client);
      clientsMap.set(validatedClientId, { client, tools, errorMsg: null });
      logger.success(`Client [${validatedClientId}] initialized successfully`);
    } catch (error) {
      await removeClient(client).catch(() => undefined);
      throw error;
    }
  } catch {
    clientsMap.set(validatedClientId, {
      client: null,
      tools: null,
      errorMsg: "Initialization failed",
    });
    logger.error(`Failed to initialize client [${validatedClientId}]`);
  }
}

export async function getClientsStatus(): Promise<
  Record<string, ServerStatusResponse>
> {
  requireMcpFeatureEnabled();
  const config = await getMcpConfigFromFile();
  const result: Record<string, ServerStatusResponse> = {};

  for (const clientId of Object.keys(config.mcpServers)) {
    const status = clientsMap.get(clientId);
    const serverConfig = config.mcpServers[clientId];

    if (!serverConfig) {
      result[clientId] = { status: "undefined", errorMsg: null };
    } else if (serverConfig.status === "paused") {
      result[clientId] = { status: "paused", errorMsg: null };
    } else if (!status) {
      result[clientId] = { status: "undefined", errorMsg: null };
    } else if (
      status.client === null &&
      status.tools === null &&
      status.errorMsg === null
    ) {
      result[clientId] = { status: "initializing", errorMsg: null };
    } else if (status.errorMsg) {
      result[clientId] = { status: "error", errorMsg: status.errorMsg };
    } else if (status.client) {
      result[clientId] = { status: "active", errorMsg: null };
    } else {
      result[clientId] = { status: "error", errorMsg: "Client not found" };
    }
  }

  return result;
}

export async function getClientTools(clientId: unknown) {
  requireMcpFeatureEnabled();
  return clientsMap.get(McpClientIdSchema.parse(clientId))?.tools ?? null;
}

export async function getAvailableClientsCount() {
  requireMcpFeatureEnabled();
  let count = 0;
  clientsMap.forEach((client) => !client.errorMsg && count++);
  return count;
}

export async function getAllTools() {
  requireMcpFeatureEnabled();
  return Array.from(clientsMap, ([clientId, client]) => ({
    clientId,
    tools: client.tools,
  }));
}

export async function initializeMcpSystem() {
  requireMcpFeatureEnabled();
  const config = await getMcpConfigFromFile();
  if (clientsMap.size > 0) return config;

  for (const [clientId, serverConfig] of Object.entries(config.mcpServers)) {
    await initializeSingleClient(clientId, serverConfig);
  }
  return config;
}

export async function pauseMcpServer(clientId: unknown) {
  requireMcpFeatureEnabled();
  const validatedClientId = McpClientIdSchema.parse(clientId);
  const currentConfig = await getMcpConfigFromFile();
  const serverConfig = currentConfig.mcpServers[validatedClientId];
  if (!serverConfig) throw new Error("MCP server not found");

  const newConfig: McpConfigData = {
    ...currentConfig,
    mcpServers: {
      ...currentConfig.mcpServers,
      [validatedClientId]: { ...serverConfig, status: "paused" },
    },
  };
  await updateMcpConfig(newConfig);

  const client = clientsMap.get(validatedClientId);
  if (client?.client) await removeClient(client.client);
  clientsMap.delete(validatedClientId);
  return newConfig;
}

export async function resumeMcpServer(clientId: unknown): Promise<void> {
  requireMcpFeatureEnabled();
  const validatedClientId = McpClientIdSchema.parse(clientId);
  const currentConfig = await getMcpConfigFromFile();
  const serverConfig = currentConfig.mcpServers[validatedClientId];
  if (!serverConfig) throw new Error("MCP server not found");

  let client;
  try {
    client = await createClient(validatedClientId, serverConfig);
    const tools = await listTools(client);
    await updateMcpConfig({
      ...currentConfig,
      mcpServers: {
        ...currentConfig.mcpServers,
        [validatedClientId]: { ...serverConfig, status: "active" },
      },
    });
    clientsMap.set(validatedClientId, { client, tools, errorMsg: null });
  } catch {
    if (client) await removeClient(client).catch(() => undefined);
    clientsMap.set(validatedClientId, {
      client: null,
      tools: null,
      errorMsg: "Initialization failed",
    });
    await updateMcpConfig({
      ...currentConfig,
      mcpServers: {
        ...currentConfig.mcpServers,
        [validatedClientId]: { ...serverConfig, status: "error" },
      },
    }).catch(() => undefined);
    throw new Error("MCP client initialization failed");
  }
}

export async function restartAllClients() {
  requireMcpFeatureEnabled();
  for (const client of clientsMap.values()) {
    if (client.client) await removeClient(client.client);
  }
  clientsMap.clear();

  const config = await getMcpConfigFromFile();
  for (const [clientId, serverConfig] of Object.entries(config.mcpServers)) {
    await initializeSingleClient(clientId, serverConfig);
  }
  return config;
}

export async function executeMcpAction(clientId: unknown, request: unknown) {
  requireMcpFeatureEnabled();
  const validatedClientId = McpClientIdSchema.parse(clientId);
  const client = clientsMap.get(validatedClientId);
  if (!client?.client) throw new Error("MCP client not found");
  return executeRequest(client.client, request);
}

export async function isMcpEnabled() {
  return isMcpFeatureEnabled();
}
