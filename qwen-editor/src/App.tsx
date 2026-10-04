import { useState } from 'react';
import Editor from '@monaco-editor/react';

// Типизация для вызова команд Tauri
declare global {
  interface Window {
    __TAURI__: {
      invoke: (cmd: string, args?: any) => Promise<any>;
    };
  }
}

function App() {
  const [code, setCode] = useState<string>("// Добро пожаловать в Qwen Editor\nconsole.log('Привет, Rust!');");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      const path = "example.ts"; 
      await window.__TAURI__.invoke('save_file', { path, content: code });
      alert('Файл сохранен!');
    } catch (error) {
      console.error(error);
      alert('Ошибка сохранения: ' + error);
    }
  };

  const handleAskQwen = async () => {
    setIsLoading(true);
    try {
      const response = await window.__TAURI__.invoke('ask_qwen', {
        request: {
          prompt: "Оптимизируй этот код",
          code_context: code
        }
      });
      setAiResponse(response.reply);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="toolbar">
        <h1>Qwen Code Editor</h1>
        <div className="actions">
          <button onClick={handleSave}>💾 Сохранить</button>
          <button onClick={handleAskQwen} disabled={isLoading}>
            {isLoading ? 'Думаю...' : '🤖 Спросить Qwen'}
          </button>
        </div>
      </header>

      <div className="editor-area">
        <Editor
          height="80vh"
          defaultLanguage="typescript"
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: 'on',
            automaticLayout: true,
          }}
        />
      </div>

      {aiResponse && (
        <div className="ai-panel">
          <h3>Ответ Qwen Ассистента</h3>
          <pre>{aiResponse}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
