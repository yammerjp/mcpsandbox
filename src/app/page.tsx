'use client';

import { MessageList } from './components/MessageList';
import { useToolCall } from './contexts/ToolCallContext';
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const { addMessage, setProcessing } = useToolCall();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // ユーザーメッセージを追加
    addMessage({
      content: input,
      type: 'user',
    });

    setInput('');
    setProcessing(true);

    try {
      // アシスタントの応答を追加
      addMessage({
        content: '処理を開始します...',
        type: 'assistant',
      });

      // ツール呼び出しの例
      addMessage({
        content: '検索を実行中...',
        type: 'tool',
        toolName: 'search',
      });

      // 実際のAPIコールやツール呼び出しをここに実装
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   body: JSON.stringify({ message: input }),
      // });
      // const data = await response.json();

      // ツールの結果を表示
      addMessage({
        content: '検索が完了しました。',
        type: 'tool',
        toolName: 'search',
      });

      // アシスタントの最終応答
      addMessage({
        content: '処理が完了しました。',
        type: 'assistant',
      });
    } catch (error) {
      // エラー時のメッセージ
      addMessage({
        content: 'エラーが発生しました。',
        type: 'assistant',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 overflow-y-auto">
        <MessageList />
      </main>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded-lg"
            placeholder="メッセージを入力..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            送信
          </button>
        </div>
      </form>
    </div>
  );
}
