import { FileNode } from "@/components/FileTreeViewer";

// LLM integration for project structure generation
export const generateProjectStructure = async (prompt: string, apiKey?: string): Promise<FileNode[]> => {
  const groqApiKey = apiKey || process.env.NEXT_PUBLIC_GROQ_API_KEY || localStorage.getItem('groq_api_key');
  try {
    // console.log("Using API Key:", groqApiKey);
    if (!groqApiKey || !groqApiKey.startsWith('gsk_')) {
      throw new Error('API key required. Please set your Groq API key.');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a senior software architect. Generate a complete project structure based on the user's description. Return ONLY a valid JSON array of FileNode objects with this exact structure:

interface FileNode {
  name: string;
  type: "file" | "folder";
  content?: string; // Only for files
  language?: string; // For syntax highlighting (typescript, json, markdown, etc.)
  children?: FileNode[]; // Only for folders
}

Rules:
1. Generate realistic file content with proper boilerplate code using latest technologies
2. Include package.json files with correct and the latest dependencies
3. Create proper folder structure
4. Add README.md with setup instructions
5. Include configuration files (tsconfig.json, vite.config.ts, etc.)
6. Generate actual functional code, not placeholders
8. Return ONLY the JSON array, no other text because I have to parse it directly dont add any other thing which will break the JSON parsing`,
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('API key required. Please set VITE_GROQ_API_KEY in your environment variables.');
      }
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from API');
    }

    // Parse the JSON response
    const structure = JSON.parse(content.trim());

    if (!Array.isArray(structure)) {
      throw new Error('Invalid response format: expected array');
    }
    // console.log("Generated Project Structure:", structure);

    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });


    return structure;
  } catch (error) {
    // console.error('Error generating project structure:', error);

    // Fallback to basic structure if API fails
    if (error instanceof Error && error.message.includes('API key required')) {
      throw error; // Re-throw API key errors
    }

    return [];
  }
};
