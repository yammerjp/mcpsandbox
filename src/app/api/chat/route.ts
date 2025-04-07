import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

import { experimental_createMCPClient as createMCPClient } from "ai";
 

// 30 秒間のストリーミングを許可する
export const maxDuration = 30;
 
// POST メソッドを使用してリクエストを処理する
export async function POST(req: Request) {
  const { messages } = await req.json();

  const mcpClient = await createMCPClient({
    transport: {
      type: "sse",
      url: "http://localhost:8931/sse"
    },
  });
  // Schema Discovery を使用して MCP サーバーからツール定義を取得
  const tools = await mcpClient.tools();
 
 
  const result = streamText({
    model: anthropic('claude-3-7-sonnet-20250219'),
    messages,
    tools,
    onFinish: () => {
      // ストリーミング応答が完了したら、必ず MCP クライアントの接続を閉じる
      mcpClient.close();
    }
  });
 
  // HTTP ストリームレスポンスを作成する
  return result.toDataStreamResponse({
    getErrorMessage: errorHandler,
  });
}

function errorHandler(error: unknown) {
  if (error == null) {
    return 'unknown error';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return JSON.stringify(error);
}
