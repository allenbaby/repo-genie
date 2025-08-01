"use client";

import { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";


interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export const PromptInput = ({ onGenerate, isLoading }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt.trim());
    }
  };

  const examplePrompts = [
    "Build a todo app with Reactjs with toast notification on creation/removal of todo",
    "Create a Snake game using React which works with keyboard arrows",
    "Build a chat app like iOS iMessage with blue bubbles using reactjs",
    "Generate a React app for playing XOX"
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-6 w-full max-w-3xl mx-auto">
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Repo Genie
          </h1>
          <p className="text-zinc-400">
            Describe your project and get a complete structure with live demo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium text-white">
              Project Description
            </label>
            <textarea
              id="prompt"
              placeholder="e.g., Build a full-stack notes app with React frontend, Node backend, MongoDB..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full min-h-[100px] p-3 rounded-md bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-white"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md font-semibold transition ${
              isLoading
                ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-[1.01] text-white hover:opacity-90"
              }`}
            disabled={!prompt.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Structure...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate Project Structure
              </>
            )}
          </button>
        </form>

        <div className="space-y-3">
          <p className="text-sm font-medium text-white">Try these examples:</p>
          <div className="grid gap-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="w-full text-left px-3 py-2 text-sm rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
                disabled={isLoading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
