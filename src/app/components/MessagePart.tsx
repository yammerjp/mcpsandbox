import { TextUIPart, ReasoningUIPart, ToolInvocationUIPart, SourceUIPart, FileUIPart, StepStartUIPart } from "@ai-sdk/ui-utils";

interface MessagePartProps {
  part: TextUIPart | ReasoningUIPart | ToolInvocationUIPart | SourceUIPart | FileUIPart | StepStartUIPart;
}

export default function MessagePart({ part }: MessagePartProps) {
  switch (part.type) {
    case 'text':
      return <div className="leading-relaxed">{part.text}</div>;
      
    case 'reasoning':
      return (
        <div className="bg-amber-50 p-3 my-2 rounded-md border border-amber-200">
          <div className="text-amber-800 font-medium mb-1 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Reasoning
          </div>
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{part.reasoning}</div>
        </div>
      );
      
    case 'tool-invocation':
      // Let's examine the structure of the toolInvocation object
      const toolCall = part.toolInvocation;
      
      // Extract tool name and arguments from the tool call
      let toolName = '';
      let toolArgs = {};
      
      if ('tool' in toolCall) {
        toolName = toolCall.tool as string;
      }
      
      if ('args' in toolCall) {
        toolArgs = toolCall.args;
      }
      
      // Determine state styling
      const getStateStyle = (state: string) => {
        switch (state) {
          case 'partial-call':
            return 'bg-yellow-100 text-yellow-800';
          case 'call':
            return 'bg-blue-100 text-blue-800';
          case 'result':
            return 'bg-green-100 text-green-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      };
      
      // Get state icon
      const getStateIcon = (state: string) => {
        switch (state) {
          case 'partial-call':
            return (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            );
          case 'call':
            return (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            );
          case 'result':
            return (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            );
          default:
            return (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            );
        }
      };
      
      // Check if there's a result
      const hasResult = 'result' in toolCall;
      
      return (
        <div className="bg-blue-50 p-3 my-2 rounded-md border border-blue-200">
          <div className="text-blue-800 font-medium mb-2 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Tool Invocation
          </div>
          
          <div className="mb-2 flex items-center">
            <span className="text-gray-600 font-medium min-w-20">Tool:</span> 
            <span className="ml-2 text-blue-700 font-mono px-2 py-1 bg-blue-50 rounded border border-blue-100">{toolName}</span>
          </div>
          
          {Object.keys(toolArgs).length > 0 && (
            <div className="mb-2">
              <div className="text-gray-600 font-medium mb-1">Arguments:</div>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-40 font-mono border border-gray-200">
                {JSON.stringify(toolArgs, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="mb-2 flex items-center">
            <span className="text-gray-600 font-medium min-w-20">State:</span>
            <span className={`ml-2 px-2 py-0.5 rounded text-sm flex items-center ${getStateStyle(toolCall.state)}`}>
              <span className="mr-1">{getStateIcon(toolCall.state)}</span>
              {toolCall.state}
            </span>
          </div>
          
          {hasResult && (
            <div className="mt-2">
              <div className="text-gray-600 font-medium mb-1">Result:</div>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-40 font-mono border border-gray-200">
                {typeof toolCall.result === 'string' 
                  ? toolCall.result 
                  : JSON.stringify(toolCall.result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      );
      
    case 'source':
      return (
        <div className="bg-purple-50 p-3 my-2 rounded-md border border-purple-200">
          <div className="text-purple-800 font-medium mb-2 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Source
          </div>
          <div className="mb-2 flex items-center">
            <span className="text-gray-600 font-medium min-w-20">Title:</span> 
            <span className="ml-2 font-medium">{part.source.title}</span>
          </div>
          {part.source.url && (
            <div className="mb-1 flex items-start">
              <span className="text-gray-600 font-medium min-w-20">URL:</span> 
              <a href={part.source.url} target="_blank" rel="noopener noreferrer" 
                 className="ml-2 text-blue-600 hover:underline break-all flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {part.source.url}
              </a>
            </div>
          )}
        </div>
      );
      
    case 'file':
      // For file parts, let's display what we can safely access
      return (
        <div className="bg-green-50 p-3 my-2 rounded-md border border-green-200">
          <div className="text-green-800 font-medium mb-2 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            File
          </div>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-40 font-mono border border-gray-200">
            {JSON.stringify(part, null, 2)}
          </pre>
        </div>
      );
      
    case 'step-start':
      return null; // Skip rendering step-start parts
      
    default:
      // Fallback for any unhandled part types
      return (
        <div className="bg-gray-100 p-3 my-2 rounded-md border border-gray-300">
          <div className="text-gray-800 font-medium mb-2 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Unknown Part Type
          </div>
          <pre className="text-xs overflow-auto max-h-40 font-mono bg-gray-50 p-2 rounded border border-gray-200">
            {JSON.stringify(part, null, 2)}
          </pre>
        </div>
      );
  }
}

