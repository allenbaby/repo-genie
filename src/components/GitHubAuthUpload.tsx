"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast"; // optional custom toast hook
import { useSession, signIn, signOut } from "next-auth/react";
import { CheckCircle, XCircle, LogIn, LogOut, UploadCloud } from "lucide-react";
import axios from "axios";

interface GitHubAuthUploadProps {
  projectStructure: any[];
}

const GitHubAuthUpload: React.FC<GitHubAuthUploadProps> = ({ projectStructure }) => {
  const { toast: customToast } = useToast(); // your custom toast hook
  const { data: session } = useSession();

  // Local state for simple toast fallback
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({ visible: false, message: "", type: "info" });

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const notify = (options: {
    title: string;
    description?: string;
    status?: "success" | "error" | "info";
  }) => {
    if (customToast) {
      customToast({
        title: options.title,
        description: options.description,
        variant: options.status === "error" ? "destructive" : "default",
      });
    } else {
      setToast({
        visible: true,
        message: options.title + (options.description ? `: ${options.description}` : ""),
        type: options.status || "info",
      });
    }
  };

  const uploadToGitHub = async () => {
    if (!session?.accessToken) {
      notify({
        title: "Not signed in",
        description: "Please sign in with GitHub first.",
        status: "error",
      });
      return;
    }

    const repo = prompt("Enter repo name (e.g. username/repo-name):");
    if (!repo) return;

    try {
      const res = await axios.post("/api/upload", {
        accessToken: session.accessToken,
        repo,
        files: projectStructure,
      });

      if (res.status === 200) {
        notify({
          title: "Uploaded to GitHub",
          description: "AI code successfully pushed to your repo!",
          status: "success",
        });
      } else {
        console.error("Failed:", res.statusText);
        throw new Error("Failed to upload to GitHub");
      }
    } catch (error) {
      notify({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Error uploading",
        status: "error",
      });
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-end gap-3 mb-4 items-center">
        {!session ? (
          <button
            onClick={() => signIn("github")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            aria-label="Sign in with GitHub"
          >
            <LogIn className="w-5 h-5" />
            Sign in with GitHub
          </button>
        ) : (
          <>
            <span className="flex items-center gap-2 text-white text-sm mr-4">
              <img
                src={session.user?.image || ""}
                alt="GitHub Avatar"
                className="w-8 h-8 rounded-full border border-white"
              />
              Hello <strong>{session.user?.name}</strong>
            </span>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              aria-label="Sign out"
            >
              <LogOut className="w-5 h-5" />
              Sign out
            </button>
            <button
              onClick={uploadToGitHub}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white rounded hover:bg-green-700 transition"
              aria-label="Upload to GitHub"
            >
              <UploadCloud className="w-5 h-5" />
              Upload to GitHub
            </button>
          </>
        )}
      </div>

      {/* Simple toast fallback */}
      {toast.visible && (
        <div
          className={`fixed top-5 right-5 z-50 max-w-xs rounded-md px-4 py-3 shadow-lg text-white
            ${toast.type === "success" ? "bg-green-600" : ""}
            ${toast.type === "error" ? "bg-red-600" : ""}
            ${toast.type === "info" ? "bg-blue-600" : ""}
          `}
          role="alert"
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" && <CheckCircle className="w-5 h-5" />}
            {toast.type === "error" && <XCircle className="w-5 h-5" />}
            {toast.type === "info" && <LogIn className="w-5 h-5" />}
            <p className="text-sm font-semibold">{toast.message}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default GitHubAuthUpload;
