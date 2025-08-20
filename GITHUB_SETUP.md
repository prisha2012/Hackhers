# GitHub Setup Instructions

## Option 1: GitHub Desktop (Easiest)

1. Download GitHub Desktop from https://desktop.github.com/
2. Install and sign in to your GitHub account
3. Click "Add an Existing Repository from your Hard Drive"
4. Select this folder: `c:/Users/hp/Downloads/project/project`
5. Click "Publish repository" to upload to GitHub

## Option 2: Manual Upload via Web

1. Go to https://github.com and sign in
2. Click "+" → "New repository"
3. Name: `hackhub-event-management`
4. Make it Public
5. Don't initialize with README
6. Click "Create repository"
7. Click "uploading an existing file"
8. Upload ALL files EXCEPT:
   - node_modules/ (too large)
   - dist/ (build output)
   - .env (contains secrets)

## Option 3: Command Line (Advanced)

If you have Git installed:

```bash
# Navigate to your project folder
cd c:/Users/hp/Downloads/project/project

# Initialize Git repository
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit - Event Management System"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/hackhub-event-management.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## What Files to Include

✅ **Include these files:**
- All .tsx, .ts, .js files
- package.json and package-lock.json
- index.html
- vite.config.ts
- tailwind.config.js
- All configuration files (.yml, .json, .md)
- src/ folder with all components
- public/ folder

❌ **DON'T include:**
- node_modules/ (too large, will be installed via npm)
- dist/ (build output, generated automatically)
- .env (contains secrets)
- .DS_Store, Thumbs.db (system files)

## After Upload

1. Your repository URL will be: `https://github.com/YOUR_USERNAME/hackhub-event-management`
2. Clone URL for Azure: `https://github.com/YOUR_USERNAME/hackhub-event-management.git`
3. You can now use this for Azure Static Web App deployment!

## Verify Upload

Check that these key files are visible on GitHub:
- package.json
- src/App.tsx
- src/components/
- azure-pipelines.yml
- staticwebapp.config.json
- DEPLOYMENT.md
