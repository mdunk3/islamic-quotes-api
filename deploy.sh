#!/bin/bash

# 🚀 Islamic Quotes API Deployment Script
# Script untuk deploy ke Vercel production

echo "🕌 Islamic Quotes API Deployment Script"
echo "======================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Initializing..."
    git init
    git add .
    git commit -m "Initial commit"
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 Switching to main branch..."
    git branch -M main
fi

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No remote repository found."
    echo "Please create a GitHub repository and run:"
    echo "git remote add origin https://github.com/USERNAME/islamic-quotes-api.git"
    echo "git push -u origin main"
    echo ""
    echo "Then deploy to Vercel at: https://vercel.com"
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
npx vercel --prod --yes

echo ""
echo "✅ Deployment completed!"
echo ""
echo "🌐 Your API is now live at:"
echo "https://islamic-quotes-api.vercel.app"
echo ""
echo "📡 API Endpoints:"
echo "- Main: https://islamic-quotes-api.vercel.app/api/quotes"
echo "- Random: https://islamic-quotes-api.vercel.app/api/quotes/random"
echo "- Categories: https://islamic-quotes-api.vercel.app/api/quotes/categories"
echo ""
echo "🎉 API is ready for production use!"