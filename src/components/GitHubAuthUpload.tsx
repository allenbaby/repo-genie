"use client";

import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { toast } from "sonner";
import { LogIn, LogOut, UploadCloud } from "lucide-react";
import axios from "axios";
import Image from "next/image";

interface FileNode {
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileNode[];
}

interface GitHubAuthUploadProps {
  projectStructure: FileNode[];
}

const GitHubAuthUpload: React.FC<GitHubAuthUploadProps> = ({ projectStructure }) => {
  const { data: session } = useSession();

  const uploadToGitHub = async () => {
    if (!session?.accessToken) {
      toast.error("Please sign in with GitHub first.");
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
        toast.success("AI code successfully pushed to your GitHub repo!");
      } else {
        throw new Error(res.statusText);
      }
    } catch (error) {
      toast.error(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <div className="flex flex-wrap justify-end gap-3 mb-4 items-center">
      {!session ? (
        <button
          onClick={() => signIn("github")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <LogIn className="w-5 h-5" />
          Sign in with GitHub
        </button>
      ) : (
        <>
          <span className="flex items-center gap-2 text-white text-sm mr-4">
            <Image
              src={session.user?.image || ""}
              alt="GitHub Avatar"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border border-white"
            />
            Hello <strong>{session.user?.name}</strong>
          </span>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
          <button
            onClick={uploadToGitHub}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white rounded"
          >
            <UploadCloud className="w-5 h-5" />
            Upload to GitHub
          </button>
        </>
      )}
    </div>
  );
};

export default GitHubAuthUpload;
