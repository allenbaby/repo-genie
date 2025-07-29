import { useState } from "react";
import {
  FolderOpen,
  Folder,
  Copy,
  Download,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
  language?: string;
}

interface FileTreeViewerProps {
  structure: FileNode[];
  onFileSelect: (file: FileNode) => void;
  selectedFile: FileNode | null;
}

export const FileTreeViewer = ({
  structure,
  onFileSelect,
  selectedFile,
}: FileTreeViewerProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["root"]));

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    newExpanded.has(path) ? newExpanded.delete(path) : newExpanded.add(path);
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
        return "📄";
      case "json":
        return "⚙️";
      case "css":
      case "scss":
        return "🎨";
      case "html":
        return "🌐";
      case "md":
        return "📝";
      case "env":
        return "🔐";
      default:
        return "📄";
    }
  };

  const renderNode = (node: FileNode, path: string, depth: number = 0) => {
    const fullPath = `${path}/${node.name}`;
    const isExpanded = expandedFolders.has(fullPath);
    const isSelected = selectedFile?.name === node.name;

    return (
      <div key={fullPath}>
        <div
          className={cn(
            "flex items-center gap-2 py-1 px-2 rounded cursor-pointer transition-colors",
            "hover:bg-zinc-800",
            isSelected && "bg-zinc-700 border-l-2 border-primary",
            depth > 0 && "ml-4"
          )}
          onClick={() => {
            if (node.type === "folder") {
              toggleFolder(fullPath);
            } else {
              onFileSelect(node);
            }
          }}
        >
          {node.type === "folder" ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-primary" />
              ) : (
                <Folder className="w-4 h-4 text-zinc-400" />
              )}
            </>
          ) : (
            <span className="w-4 h-4 flex items-center justify-center text-xs">
              {getFileIcon(node.name)}
            </span>
          )}

          <span
            className={cn(
              "text-sm font-mono text-zinc-200 truncate",
              node.type === "folder" && "font-medium",
              isSelected && "text-primary font-medium"
            )}
          >
            {node.name}
          </span>
        </div>

        {node.type === "folder" && isExpanded && node.children && (
          <div>{node.children.map((child) => renderNode(child, fullPath, depth + 1))}</div>
        )}
      </div>
    );
  };

  const copyStructure = () => {
    navigator.clipboard.writeText(JSON.stringify(structure, null, 2));
  };

  const downloadStructure = () => {
    const blob = new Blob([JSON.stringify(structure, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "project-structure.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full border border-zinc-700 rounded-md p-4 bg-zinc-900">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-zinc-100">Project Structure</h2>
        <div className="flex gap-2">
          <button
            onClick={copyStructure}
            className="h-8 w-8 p-1 rounded hover:bg-zinc-800 text-zinc-300"
            title="Copy JSON"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={downloadStructure}
            className="h-8 w-8 p-1 rounded hover:bg-zinc-800 text-zinc-300"
            title="Download JSON"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      {structure.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-zinc-400">
          <div className="text-center space-y-2">
            <Folder className="w-12 h-12 mx-auto opacity-50" />
            <p>No structure generated yet</p>
          </div>
        </div>
      ) : (
        <div className="space-y-1 max-h-[600px] overflow-y-auto">
          {structure.map((node) => renderNode(node, "", 0))}
        </div>
      )}
    </div>
  );
};
