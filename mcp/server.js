import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({
    name: "我的mcp服务器",
    title: "第一个mcp服务器",
    version: "1.0.0",
});

server.registerTool(
    "求和",
    {
        title: "两数之和",
        description: "返回两个数字的和",
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
const transport = new StdioServerTransport();
server.connect(transport);
