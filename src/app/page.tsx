"use client";

import { useState, useEffect } from "react";
import { PromptInput } from "@/components/PromptInput";
import { FileTreeViewer, FileNode } from "@/components/FileTreeViewer";
import { CodePreview } from "@/components/CodePreview";
import AppPreview from "@/components/AppPreview";
import { ApiKeyDialog } from "@/components/ApiKeyDialog";
import { generateProjectStructure } from "@/services/projectGenerator";
import GitHubAuthUpload from "@/components/GitHubAuthUpload";
import { SessionProvider } from "next-auth/react";
import { toast } from "sonner";
import { Folder, Eye, Code } from "lucide-react";


const Page = () => {
  const [projectStructure, setProjectStructure] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [tempApiKey, setTempApiKey] = useState<string>("");
  const [activeView, setActiveView] = useState<"structure" | "preview" | "code">("structure");

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setSelectedFile(null);

    try {
      const structure = await generateProjectStructure(prompt, tempApiKey);
      setProjectStructure(structure);

      toast.success("Your project structure has been created successfully.");
    } catch (error) {
      if (error instanceof Error && error.message.includes("API key required")) {
        setShowApiKeyDialog(true);
        toast.error("API Key Required", {
          description: "Please provide your Groq API key to generate AI-powered structures."
        });
      } else {
        toast.error("Generation failed", {
          description:
            error instanceof Error ? error.message : "There was an error generating your project structure.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySet = (apiKey: string) => {
    setTempApiKey(apiKey);
    setShowApiKeyDialog(false);
    localStorage.setItem("groq_api_key", apiKey);

    toast.success("API Key Set", {
      description: "You can now generate AI-powered project structures!",
    });
  };

  useEffect(() => {
    const storedApiKey = localStorage.getItem("groq_api_key");
    if (storedApiKey) {
      setTempApiKey(storedApiKey);
    }
  }, []);

  const handleFileSelect = (file: FileNode) => {
    setSelectedFile(file);
  };

  const baseBtnClass =
    "inline-flex items-center gap-2 px-4 py-2 rounded transition-colors duration-200";

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-6 space-y-6">
        <div className="max-w-3xl mx-auto">
          <SessionProvider>
            <GitHubAuthUpload projectStructure={projectStructure} />
          </SessionProvider>
          <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />
        </div>

        {(projectStructure.length > 0 || isLoading) && (
          <div className="space-y-4">
            {/* Button Controls */}
            <div className="flex gap-4 justify-center mb-4">
              <button
                className={`${baseBtnClass} ${activeView === "structure"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  }`}
                onClick={() => setActiveView("structure")}
                aria-label="File Structure View"
              >
                <Folder className="w-5 h-5" />
                File Structure
              </button>

              <button
                className={`${baseBtnClass} ${activeView === "preview"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  }`}
                onClick={() => setActiveView("preview")}
                aria-label="Live Preview View"
              >
                <Eye className="w-5 h-5" />
                Live Preview
              </button>

              <button
                className={`${baseBtnClass} ${activeView === "code"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  }`}
                onClick={() => setActiveView("code")}
                aria-label="Code View"
              >
                <Code className="w-5 h-5" />
                Code View
              </button>
            </div>

            {/* Render Views */}
            {activeView === "structure" && (
              <FileTreeViewer
                structure={projectStructure}
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
              />
            )}
            {activeView === "preview" && <AppPreview projectStructure={projectStructure} />}
            {activeView === "code" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FileTreeViewer
                  structure={projectStructure}
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                />
                <CodePreview selectedFile={selectedFile} />
              </div>
            )}
          </div>
        )}

        <ApiKeyDialog
          isOpen={showApiKeyDialog}
          onApiKeySet={handleApiKeySet}
          onClose={() => setShowApiKeyDialog(false)}
        />
      </div>
    </div>
  );
};

export default Page;
