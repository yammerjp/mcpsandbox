"use client";
 
import { useChat } from "@ai-sdk/react";
import { TextUIPart, ReasoningUIPart, ToolInvocationUIPart, SourceUIPart, FileUIPart, StepStartUIPart } from "@ai-sdk/ui-utils";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, reload, isLoading } =
    useChat({
      maxSteps: 10,
    });
 
  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="space-y-4 mb-6">
        {messages.map((message, idx) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              message.role === "user"
                ? "bg-blue-100 ml-8 border-blue-200 border"
                : "bg-gray-100 mr-8 border-gray-200 border"
            }`}
          >
            <div className="font-semibold mb-1 text-sm text-gray-600">
              {message.role === "user" ? "You" : "Claude"}
            </div>
            <div className="text-gray-800 whitespace-pre-wrap">{message.parts.map((part: TextUIPart | ReasoningUIPart | ToolInvocationUIPart | SourceUIPart | FileUIPart | StepStartUIPart) => {
              if (part.type === 'text') {
                return part.text
              } else if (part.type === 'step-start') {
                // skip
                return undefined
              } else if (part.type === 'reasoning') {
                return "reasoning...."
              } else if (part.type === 'tool-invocation') {
                return <p><div className="text-gray-500 whitespace-pre-wrap">ツールを呼び出します...</div>
                {part.toolInvocation.state}
                {JSON.stringify(part.toolInvocation)}
                </p>
              } else {
                return JSON.stringify(part)
              }
            })}</div>
            <div className="text-gray-800 whitespace-pre-wrap">{message.role !== 'user' && idx === messages.length - 1 && isLoading && '...'}</div>
            {message.role === "assistant" && (
              <button
                className="mt-2 text-sm text-blue-600 hover:underline"
                onClick={() => reload()}
              >
                Regenerate response
              </button>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          {isLoading ? "送信中..." : "送信"}
        </button>
      </form>
    </div>
  );
}
