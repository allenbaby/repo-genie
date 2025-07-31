import React, { useState, useEffect, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { toast } from "sonner";
import { LogIn, LogOut, UploadCloud, ChevronDown } from "lucide-react";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Collapse dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const uploadToGitHub = async () => {
    if (!session?.accessToken) {
      toast.error("Please sign in with GitHub first.");
      return;
    }

    const repo = prompt("Enter repo name you want to create:");
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
    <div className="relative flex flex-col items-end">
      {!session ? (
        <button
          onClick={() => signIn("github")}
          className="absolute flex items-center gap-2 
                      px-2.5 py-1 text-xs
                      sm:px-3 sm:py-1.5 sm:text-sm
                      bg-purple-600 text-white rounded-md 
                      shadow-md hover:scale-[1.03] hover:shadow-lg 
                      transition-all duration-150 font-medium 
                      focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="sm:hidden">Sign in</span>
          <span className="hidden sm:inline">Sign in with GitHub</span>
        </button>
      ) : (
        <>
          {/* User info top right */}
          <div className="absolute top-0 right-0 flex items-center gap-2 hover:cursor-pointer bg-zinc-800 px-3 py-2 rounded-lg shadow"
            ref={dropdownRef} onClick={() => setDropdownOpen((open) => !open)}>
            <Image
              src={session.user?.image || ""}
              alt="GitHub Avatar"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border-2 border-purple-500"
            />
            <strong className="text-purple-400 hidden sm:block">{session.user?.name}</strong>
            <button

              className="ml-2 text-zinc-400 hover:text-purple-400 hover:cursor-pointer transition"
              aria-label="Open user menu"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
            {dropdownOpen && (
              <div className="absolute top-12 right-0 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg min-w-[180px] z-10">
                <button
                  onClick={uploadToGitHub}
                  className="w-full flex items-center gap-2 px-4 py-3 text-left text-white hover:bg-zinc-800 hover:cursor-pointer rounded-t-lg transition"
                >
                  <UploadCloud className="w-5 h-5" />
                  <span>Push to GitHub</span>
                </button>
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-2 px-4 py-3 text-left text-white hover:bg-zinc-800 hover:cursor-pointer rounded-b-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default GitHubAuthUpload;