"use client";
 
import { useChat } from "@ai-sdk/react";
import { TextUIPart, ReasoningUIPart, ToolInvocationUIPart, SourceUIPart, FileUIPart, StepStartUIPart } from "@ai-sdk/ui-utils";
import MessagePart from "../components/MessagePart";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, reload, isLoading, stop } =
    useChat({
      maxSteps: 10,
    });
  
  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <header className="mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Chat with Claude
        </h1>
        <p className="text-gray-600 mt-1">Ask questions, get answers, and see tool usage in action</p>
      </header>
      
      <div className="space-y-4 mb-6">
        {messages.map((message, idx) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              message.role === "user"
                ? "bg-gray-100 ml-32"
                : ""
            }`}
          >
            <div className="text-gray-800 whitespace-pre-wrap">
              {message.parts.map((part: TextUIPart | ReasoningUIPart | ToolInvocationUIPart | SourceUIPart | FileUIPart | StepStartUIPart, index: number) => (
                <MessagePart key={index} part={part} />
              ))}
            </div>
            <div className="text-gray-800 whitespace-pre-wrap">
              {message.role !== 'user' && idx === messages.length - 1 && isLoading && (
                <div className="flex items-center text-gray-500 mt-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Claude is thinking...
                </div>
              )}
            </div>
            {message.role === "assistant" && idx === messages.length - 1 && (
              <div className="mt-2 flex space-x-2 justify-end">
                {!isLoading && (
                  <button
                    onClick={() => reload()}
                  >
                    再生成
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 pt-4">
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
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <button onClick={() => stop()}>
                  停止
                </button>
              </>
            ) : (
              <>
                送信
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
