import { useRef } from "react";
import Editor from "@monaco-editor/react";
import { Copy, FileText } from "lucide-react";
import { FileNode } from "./FileTreeViewer";

interface CodePreviewProps {
  selectedFile: FileNode | null;
}

export const CodePreview = ({ selectedFile }: CodePreviewProps) => {
  const editorRef = useRef(null);

  const getLanguageFromExtension = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'html':
        return 'html';
      case 'css':
      case 'scss':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      case 'py':
        return 'python';
      case 'java':
        return 'java';
      case 'php':
        return 'php';
      default:
        return 'plaintext';
    }
  };

  const copyToClipboard = () => {
    if (selectedFile?.content) {
      navigator.clipboard.writeText(selectedFile.content);
    }
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  if (!selectedFile) {
    return (
      <div className="h-full border rounded-lg bg-zinc-900 border-zinc-700 shadow-md p-4">
        <h2 className="text-lg font-semibold text-white mb-4">Code Preview</h2>
        <div className="flex items-center justify-center h-96 text-gray-400">
          <div className="text-center space-y-2">
            <FileText className="w-12 h-12 mx-auto opacity-50" />
            <p>Select a file to preview its content</p>
          </div>
        </div>
      </div>
    );
  }

  const iconMap: Record<string, string> = {
    js: "📄",
    ts: "📄",
    tsx: "📄",
    jsx: "📄",
    json: "⚙️",
    css: "🎨",
    html: "🌐",
    md: "📝",
  };

  const fileExt = selectedFile.name.split(".").pop()?.toLowerCase() || "";
  const fileIcon = iconMap[fileExt] || "📄";

  return (
    <div className="h-full border rounded-lg bg-zinc-900 border-zinc-700 shadow-md">
      <div className="flex items-center justify-between p-4 border-b border-zinc-700">
        <div className="flex items-center gap-2 text-white text-lg font-semibold">
          <span className="text-base">{fileIcon}</span>
          <span className="font-mono">{selectedFile.name}</span>
        </div>
        <button
          onClick={copyToClipboard}
          className="text-gray-300 hover:text-white p-2 rounded-md transition"
          title="Copy code"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
      <div className="p-2">
        <Editor
          height="500px"
          language={selectedFile.language || getLanguageFromExtension(selectedFile.name)}
          value={selectedFile.content || "// No content available"}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace",
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: "on",
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>
    </div>
  );
};
