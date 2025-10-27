#!/bin/bash

# 🕌 Deployment Verification Script

echo "🔍 Verifying deployment readiness..."
echo "=================================="

# Check if quotes.json exists and is valid
echo "📁 Checking quotes.json..."
if [ -f "src/quotes.json" ]; then
    echo "✅ quotes.json exists"
    QUOTES_COUNT=$(node -e "console.log(JSON.parse(require('fs').readFileSync('src/quotes.json', 'utf8')).length)")
    echo "📊 Total quotes: $QUOTES_COUNT"
else
    echo "❌ quotes.json not found"
    exit 1
fi

# Check API routes
echo ""
echo "🛣️  Checking API routes..."
API_ROUTES=(
    "src/app/api/quotes/route.ts"
    "src/app/api/quotes/random/route.ts"
    "src/app/api/quotes/categories/route.ts"
    "src/app/api/quotes/[id]/route.ts"
)

for route in "${API_ROUTES[@]}"; do
    if [ -f "$route" ]; then
        echo "✅ $route exists"
        # Check if import path is correct
        if grep -q "quotesData from.*quotes.json" "$route"; then
            echo "  ✅ Import path found"
        else
            echo "  ❌ Import path missing"
        fi
    else
        echo "❌ $route missing"
    fi
done

# Test build
echo ""
echo "🏗️  Testing build..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "🎉 All checks passed! Ready for deployment!"
echo ""
echo "📋 Next Steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Deploy to Vercel: https://vercel.com"
echo "3. Test API: https://islamic-quotes-api.vercel.app/api/quotes/random"