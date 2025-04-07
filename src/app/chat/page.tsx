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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Claude is thinking...
                </div>
              )}
            </div>
          </div>
        ))}
            {messages.at(messages.length - 1)?.role === "assistant" && (
              <div className="mt-2 flex justify-end">
                {!isLoading && (
                  <button
                    onClick={() => reload()}
                    className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 w-10 h-10 flex items-center justify-center"
                    title="再生成"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
            )}

      </div>
      {/* Add padding at the bottom to prevent content from being hidden behind the fixed input */}
      <div className="pb-16"></div>
      <div className="fixed bottom-0 left-0 right-0 p-4">
        <form onSubmit={(e) => {
          handleSubmit(e);
          // Reset textarea height after submission
          const textarea = e.currentTarget.querySelector('textarea');
          if (textarea) {
            textarea.style.height = 'auto';
          }
        }} className="max-w-4xl mx-auto">
          <div className="relative">
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="質問してみましょう"
              className="w-full px-6 py-5 pr-20 border border-gray-300 rounded-4xl focus:outline-none bg-white focus:border-gray-500 dark:bg-gray-900 shadow-sm resize-none min-h-[50px] max-h-[70vh] overflow-y-auto"
              style={{ height: 'auto' }}
              rows={1}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) {
                  return;
                }
                
                if (e.key === 'Enter') {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    if (!isLoading) {
                      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                      // Reset textarea height after submission via Enter key
                      const textarea = e.target as HTMLTextAreaElement;
                      textarea.style.height = 'auto';
                    }
                  }
                  // Shift + Enterの場合はデフォルトの動作（改行挿入）を許可
                }
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                // Reset height to auto to get the correct scrollHeight
                target.style.height = 'auto';
                
                if (target.scrollHeight > window.innerHeight * 0.7) {
                  // If content exceeds max height, set to max height and enable scrolling
                  target.style.height = `${window.innerHeight * 0.7}px`;
                  target.style.overflowY = 'auto';
                } else {
                  // Otherwise, set height to match content and disable scrolling
                  target.style.height = `${target.scrollHeight}px`;
                  target.style.overflowY = 'hidden';
                }
              }}
            />
            {/* Position the button to align with the bottom of the text area */}
            <div className="absolute right-1 bottom-0 h-auto flex items-center pb-4">
              <div className="relative right-[10px]">
                {isLoading ? (
                  <button
                    type="button"
                    onClick={() => stop()}
                    className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center w-10 h-10"
                    title="停止"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="6" y="6" width="12" height="12" strokeWidth={2} />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="p-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center w-10 h-10"
                    disabled={isLoading}
                    title="送信"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
