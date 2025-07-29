import { Sandpack } from "@codesandbox/sandpack-react";
import { FileNode } from "@/components/FileTreeViewer";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import "@/styles/Preview.css";

interface AppPreviewProps {
  projectStructure: FileNode[];
}

const AppPreview = ({ projectStructure }: AppPreviewProps) => {
  if (!projectStructure.length) {
    return (
      <Card
        sx={{
          height: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1e1e1e",
          color: "#ddd",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            No Preview Available
          </Typography>
          <Typography variant="body2">
            Generate a project structure to see the live preview
          </Typography>
        </div>
      </Card>
    );
  }

  const convertToSandpackFiles = (nodes: FileNode[], basePath = ""): Record<string, string> => {
    const files: Record<string, string> = {};

    nodes.forEach((node) => {
      const fullPath = basePath ? `${basePath}/${node.name}` : node.name;

      if (node.type === "file" && node.content) {
        files[fullPath] = node.content;
      } else if (node.type === "folder" && node.children) {
        Object.assign(files, convertToSandpackFiles(node.children, fullPath));
      }
    });

    return files;
  };

  function findFileContentByName(
    files: Record<string, string>,
    name: string,
    rKey: string = "N"
  ): string | null {
    for (const key of Object.keys(files)) {
      if (key.includes(name)) {
        const res = rKey === "Y" ? key : files[key];
        return res;
      }
    }
    return null;
  }

  const sandpackFiles = convertToSandpackFiles(projectStructure);

  const getProjectDependencies = () => {
    const packageJsonFile = findFileContentByName(sandpackFiles, "package.json");
    if (packageJsonFile) {
      try {
        const packageJson = JSON.parse(packageJsonFile);
        return {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
        };
      } catch (error) {
        console.error("Failed to parse package.json:", error);
      }
    }
  };

  const projectDependencies = getProjectDependencies();

  const findMainEntryPoint = () => {
    const readmeFile =
      findFileContentByName(sandpackFiles, "README.md") ||
      findFileContentByName(sandpackFiles, "readme.md");

    if (readmeFile) {
      const lowerReadme = readmeFile.toLowerCase();
      if (lowerReadme.includes("npm start") || lowerReadme.includes("npm run dev")) {
        // do nothing special here
      }
    }

    const packageJsonFile = findFileContentByName(sandpackFiles, "package.json");
    if (packageJsonFile) {
      try {
        const packageJson = JSON.parse(packageJsonFile);
        if (packageJson.main) {
          return packageJson.main;
        }
      } catch (error) {
        console.error("Failed to parse package.json:", error);
      }
    }

    const entryPoints = [
      "src/index.tsx",
      "src/index.jsx",
      "src/index.js",
      "src/index.ts",
      "src/main.tsx",
      "src/main.jsx",
      "src/main.js",
      "src/main.ts",
      "index.tsx",
      "index.jsx",
      "index.js",
      "index.ts",
      "main.tsx",
      "main.jsx",
      "main.js",
      "main.ts",
    ];

    for (const entry of entryPoints) {
      const res = findFileContentByName(sandpackFiles, entry, "Y");
      if (res) return res;
    }

    return null;
  };

  const mainEntry = findMainEntryPoint();

  return (
    <Card
      sx={{
        height: 600,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1e1e1e",
        color: "#ddd",
        border: "1px solid #333",
      }}
    >
      <CardHeader
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 10,
                height: 10,
                backgroundColor: "#22c55e",
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
            <Typography variant="h6" component="div" sx={{ color: "#fff" }}>
              Live Preview
            </Typography>
          </div>
        }
        sx={{
          borderBottom: "1px solid #444",
          backgroundColor: "#1e1e1e",
          color: "#ddd",
        }}
      />
      <CardContent sx={{ flexGrow: 1, p: 0 }}>
        <div style={{ width: "100%", height: "100%", border: "2px solid #333" }}>
          <Sandpack
            template="react"
            files={sandpackFiles}
            theme="dark"
            options={{
              showNavigator: false,
              showTabs: true,
              showLineNumbers: true,
              showInlineErrors: true,
              wrapContent: true,
              layout: "preview",
              autorun: true,
              editorHeight: "100%",
            }}
            customSetup={{
              dependencies: projectDependencies,
              entry: mainEntry,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AppPreview;
