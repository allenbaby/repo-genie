import { FileNode } from "@/components/FileTreeViewer";

// LLM integration for project structure generation
export const generateProjectStructure = async (prompt: string, apiKey?: string): Promise<FileNode[]> => {
  const groqApiKey = apiKey || process.env.GROQ_API_KEY || localStorage.getItem('groq_api_key');
  try {
    // console.log("Using API Key:", groqApiKey, process.env.GROQ_API_KEY);
    // if (!groqApiKey || !groqApiKey.startsWith('gsk_')) {
    //   throw new Error('API key required. Please set your Groq API key.');
    // }
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('API key required. Please set VITE_GROQ_API_KEY in your environment variables.');
      }
      throw new Error(`API request failed: ${res.statusText}`);
    }

    const data = await res.json();
    const content = data.result.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from API');
    }

    // Parse the JSON response
    const structure = JSON.parse(content.trim());
    console.log("Generated Project Structure:", structure);

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
