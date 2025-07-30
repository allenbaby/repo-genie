export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
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
8. Return ONLY the JSON array starting with "[" and ending with "]" because I have to parse it directly dont add any other thing which will break the JSON parsing`,
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.3,
                max_tokens: 8000,
            }),
        });

        // Handle HTTP-level errors
        if (!groqRes.ok) {
            if (groqRes.status === 429) {
                return Response.json(
                    { error: "Rate limit exceeded. Please try again later." },
                    { status: 429 }
                );
            }

            if (groqRes.status === 500) {
                return Response.json(
                    { error: "Internal server error from Groq. Try again shortly." },
                    { status: 500 }
                );
            }

            return Response.json(
                { error: `Groq API error: ${groqRes.statusText}` },
                { status: groqRes.status }
            );
        }

        const data = await groqRes.json();
        console.log("Groq API Response:", data);

        return Response.json({ result: data });
    } catch (error: unknown) {
        console.error("Unexpected error:", error);

        const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred.";

        return Response.json(
            { error: `Unexpected error occurred while calling Groq API: ${errorMessage}` },
            { status: 500 }
        );
    }

}
