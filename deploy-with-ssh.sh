#!/bin/bash

# 🕌 Islamic Quotes API Deployment with SSH Key
# Use this script after creating repository manually on GitHub

set -e

GITHUB_USERNAME=$1

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Usage: ./deploy-with-ssh.sh <github_username>"
    echo "💡 Make sure you've created repository 'islamic-quotes-api' on GitHub first"
    exit 1
fi

echo "🕌 Islamic Quotes API SSH Deployment"
echo "==================================="
echo "👤 Username: $GITHUB_USERNAME"
echo "📦 Repository: islamic-quotes-api"
echo ""

# Step 1: Add SSH remote
echo "🔗 Setting up SSH remote..."
git remote add origin git@github.com:$GITHUB_USERNAME/islamic-quotes-api.git
git branch -M main

# Step 2: Push with SSH
echo "📤 Pushing to GitHub via SSH..."
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "🌐 Repository: https://github.com/$GITHUB_USERNAME/islamic-quotes-api"
echo ""
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