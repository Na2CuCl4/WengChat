import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const TOOL_NAME = "inspect_environment";
const server = new Server(
  { name: "wengchat-mcp-regression", version: "1.0.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: TOOL_NAME,
      description: "Reports whether the MCP child received test variables",
      inputSchema: { type: "object", additionalProperties: false },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== TOOL_NAME) throw new Error("Unknown test tool");

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          openaiApiKeyPresent: Object.hasOwn(process.env, "OPENAI_API_KEY"),
          codePresent: Object.hasOwn(process.env, "CODE"),
          configuredEnv: process.env.MCP_TEST_ALLOWED ?? null,
        }),
      },
    ],
  };
});

await server.connect(new StdioServerTransport());
process.stdin.once("end", () => process.exit(0));
