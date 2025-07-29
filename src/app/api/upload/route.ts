import { Octokit } from "@octokit/rest";
import { NextRequest, NextResponse } from "next/server";

interface FileNode {
  name: string;
  type: "file" | "folder";
  content?: string;
  language?: string;
  children?: FileNode[];
}

interface FlattenedFile {
  path: string;
  content: string;
}

function flattenStructure(
  nodes: FileNode[],
  currentPath = ""
): FlattenedFile[] {
  let files: FlattenedFile[] = [];

  for (const node of nodes) {
    const fullPath = currentPath ? `${currentPath}/${node.name}` : node.name;

    if (node.type === "file" && node.content !== undefined) {
      files.push({
        path: fullPath,
        content: node.content,
      });
    } else if (node.type === "folder" && node.children) {
      files = files.concat(flattenStructure(node.children, fullPath));
    }
  }

  return files;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { accessToken, repo, files } = body;

  if (!accessToken || !repo || !files) {
    return NextResponse.json({ error: "Missing accessToken, repo, or files" }, { status: 400 });
  }

  // const [owner, repoName] = repo.split("/");
  const octokit = new Octokit({ auth: accessToken });

  try {
    const flatFiles = flattenStructure(files);

    // STEP 1: Get authenticated user
    const user = await octokit.rest.users.getAuthenticated();
    const username = user.data.login;

    // STEP 2: Create new repo
    const created = await octokit.rest.repos.createForAuthenticatedUser({
      name: repo,
      auto_init: false,
      private: false,
    });

    // OR easier workaround: push file, which will auto-create main branch

    // STEP 4: Upload each file
    for (const file of flatFiles) {
      await octokit.repos.createOrUpdateFileContents({
        owner: username,
        repo,
        path: file.path,
        message: `Add ${file.path}`,
        content: Buffer.from(file.content).toString("base64"),
        branch: "main",
        committer: {
          name: username,
          email: "uploader@example.com",
        },
        author: {
          name: "Allen",
          email: "allen.baby10@gmail.com",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("GitHub Upload Error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
