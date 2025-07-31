# 🧞 Repo Genie

**Repo Genie** is a web-based tool that allows users to generate a full-stack application structure, visualize the project files, preview source code, and directly upload the project to GitHub — all with a clean, modern interface.

![Screenshot](./public/demo.gif)

## 🚀 Features

- 🔑 GitHub Authentication (via NextAuth)
- 📂 Visual file tree explorer
- 🧠 AI-generated project structures
- 📝 Monaco-based code preview
- 🔄 GitHub repository upload (with auto folder and file creation)
- 🧪 Clean architecture with modular components and service separation

---

## 📁 Project Structure

```bash
.
├── @types                   # TypeScript type definitions
│   └── next-auth.d.ts
├── app                  
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── api
│       ├── auth
│       │   └── [...nextauth]/route.ts
│       └── upload/route.ts
│       └── generate/route.ts
├── components
│       │   └── ui/sonner.ts             # Toast
│       ├── ApiKeyDialog.tsx
│       ├── AppPreview.tsx
│       ├── CodePreview.tsx
│       ├── FileTreeViewer.tsx
│       ├── GitHubAuthUpload.tsx
│       └── PromptInput.tsx
├── lib                     # Utility functions
│   └── utils.ts
├── services                # Business logic & services
│   └── projectGenerator.ts
└── styles                  # CSS modules and global styles
    └── Preview.css
```

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** TailwindCSS + MUI
- **Authentication:** NextAuth.js (GitHub Provider)
- **State Management:** React Hooks
- **Editor:** Monaco Editor
- **API:** REST API via Next.js Route Handlers
- **Version Control:** GitHub REST API (via Octokit)

## ⚙️ Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/repo-genie.git
   cd repo-genie
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env.local` file and add:
   ```env
   GITHUB_CLIENT_ID=your_id
   GITHUB_CLIENT_SECRET=your_secret
   NEXTAUTH_SECRET=some_random_string
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Visit `http://localhost:3000` in your browser.

---

## 📄 License

MIT License © 2025