#!/bin/bash

# 🚀 Islamic Quotes API Auto-Deployment Script
# Usage: ./auto-deploy.sh YOUR_GITHUB_USERNAME YOUR_GITHUB_TOKEN

set -e

GITHUB_USERNAME=$1
GITHUB_TOKEN=$2

if [ -z "$GITHUB_USERNAME" ] || [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Usage: ./auto-deploy.sh <github_username> <github_token>"
    echo "💡 Get token from: https://github.com/settings/tokens"
    exit 1
fi

echo "🕌 Islamic Quotes API Auto-Deployment"
echo "===================================="
echo "👤 Username: $GITHUB_USERNAME"
echo "📦 Repository: islamic-quotes-api"
echo ""

# Step 1: Create GitHub repository via API
echo "📁 Creating GitHub repository..."
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d '{
    "name": "islamic-quotes-api",
    "description": "API publik gratis kutipan Islami tentang pendidikan untuk sekolah Islam Indonesia",
    "private": false,
    "has_issues": true,
    "has_projects": true,
    "has_wiki": true,
    "auto_init": false
  }'

echo ""
echo "✅ Repository created successfully!"

# Step 2: Add remote and push
echo "📤 Pushing to GitHub..."
git remote add origin https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/islamic-quotes-api.git
git branch -M main
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub!"

# Step 3: Wait for GitHub to process
echo "⏳ Waiting for GitHub to process repository..."
sleep 5

# Step 4: Get repository info
REPO_URL="https://github.com/$GITHUB_USERNAME/islamic-quotes-api"
echo ""
echo "🌐 Repository URL: $REPO_URL"
echo ""

# Step 5: Instructions for Vercel deployment
echo "🚀 Next Steps for Vercel Deployment:"
echo "====================================="
echo "1. Open https://vercel.com"
echo "2. Login with GitHub account: $GITHUB_USERNAME"
echo "3. Click 'New Project'"
echo "4. Select 'islamic-quotes-api' repository"
echo "5. Click 'Deploy'"
echo ""
echo "🎉 Your API will be live at: https://islamic-quotes-api.vercel.app"
echo ""
echo "📡 API Endpoints will be available at:"
echo "- https://islamic-quotes-api.vercel.app/api/quotes"
echo "- https://islamic-quotes-api.vercel.app/api/quotes/random"
echo "- https://islamic-quotes-api.vercel.app/api/quotes/categories"
echo ""
echo "✨ Auto-deployment completed successfully!"