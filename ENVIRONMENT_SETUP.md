# AI Features Setup Guide

This guide explains how to use the AI-powered features in Text Modifier.

## 🎯 For End Users (Simple Setup)

### Use in Production (Recommended)
1. **Visit the live app**: Go to the deployed version of Text Modifier
2. **Click any AI tool**: Try using "Summarize", "Fix Grammar", etc.
3. **Add your GitHub token**: When prompted, enter your GitHub Personal Access Token
4. **Start using AI features**: That's it! Your token is stored locally in your browser

### 🔑 Getting a GitHub Token

#### Quick Steps:
1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name like "Text Modifier AI"
4. Select scopes: `repo` and `read:user`
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

#### Token Security:
- ✅ **Stored locally**: Your token is only stored in your browser
- ✅ **Not sent to servers**: We don't collect or store your token
- ✅ **You control it**: You can revoke it anytime on GitHub
- ✅ **Fine-grained available**: You can also use fine-grained tokens for better security

## 👨‍💻 For Developers

### Fine-grained Tokens (Recommended)
For better security, you can use fine-grained tokens:

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Fine-grained tokens](https://github.com/settings/tokens?type=beta)
2. Click "Generate new token"
3. Give your token a descriptive name (e.g., "Text Modifier AI")
4. Set expiration as desired
5. For **Repository access**, select:
   - Either "All repositories" or specific repositories
   - Or "Only select repositories" and choose your project repository
6. For **Permissions**, set:
   - **Repository permissions**: `Contents` → `Read`
   - **Metadata** → `Read` (usually enabled by default)
7. Click "Generate token"
8. **Important**: Copy the token immediately - you won't be able to see it again!

### Local Development Setup
1. **Clone the repository**: `git clone https://github.com/novasuitelabs/textmodifiers.git`
2. **Install dependencies**: `npm install`
3. **Create `.env` file**: Add `VITE_GITHUB_TOKEN=your_token_here`
4. **Start the app**: `npm run dev`

### Alternative Environment Setup
If you prefer to use environment variables directly in your shell:

**Windows (PowerShell):**
```powershell
$env:VITE_GITHUB_TOKEN="your_github_token_here"
npm run dev
```

**macOS/Linux:**
```bash
export VITE_GITHUB_TOKEN="your_github_token_here"
npm run dev
```

### Troubleshooting for Developers

**"GitHub token not found" Error:**
- Make sure your `.env` file is in the project root directory
- Verify the token is correctly copied (no extra spaces or characters)
- Restart the development server after creating the `.env` file

**"API Error" or "Network Error":**
- Check that your GitHub token has the correct permissions
  - For fine-grained tokens: Ensure `Contents` → `Read` permission is granted
  - For classic tokens: Ensure `repo` scope is selected
- Verify your internet connection
- Make sure the token hasn't expired
- For fine-grained tokens: Check that the token has access to the specific repository

**Token Security for Developers:**
- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore` to prevent accidental commits
- If you accidentally expose your token, immediately revoke it on GitHub and create a new one

## 🚀 That's It!

Once you add your token, all AI features will work:
- **Text Summarization**
- **Grammar Correction**
- **Style Transfer**
- **Language Translation**
- **Text Analysis**
- **Content Generation**
- **Text Expansion**

### 🎯 **Streaming Support**
The app now supports **real-time streaming responses** for all AI features:
- **Toggle streaming mode** using the "Streaming ON/OFF" chip in the AI Tools panel
- **Real-time text generation** - see responses appear word by word
- **Native streaming** - uses Server-Sent Events (SSE) for true real-time streaming
- **Fallback support** - automatically falls back to simulated streaming if native streaming fails
- **Same cost** - streaming doesn't increase token usage, just improves user experience

## ❓ Need Help?

- **Token not working?** Make sure you have the correct permissions (`repo` scope)
- **Still having issues?** Open an issue on the GitHub repository
- **Security concerns?** Your token is only used to access GitHub's AI models and is stored locally

---

**Note**: This app uses GitHub's AI models, so you need a GitHub account and token to access the AI features.
