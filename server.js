import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({
    name: "My MCP Server",
    title: "My MCP Server Title",
    version: "1.0.0",
});
server.registerTool(
    "sum",
    {
        title: "Sum two numbers",
        description: "Returns the sum of two numbers",
        inputSchema: {
            a: z.number().describe("First number"),
            b: z.number().describe("Second number"),
        },
    },
    ({ a, b }) => {
        return {
            content: [
                {
                    type: "text",
                    text: `The sum of ${a} and ${b} is ${a + b}`,
                },
            ],
        };
    }
);
const transport = new StdioClientTransport();
server.connect(transport);
