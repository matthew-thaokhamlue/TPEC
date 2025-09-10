#!/bin/bash

echo "🧪 Website Testing Script"
echo "========================"
echo ""

# Kill any existing local servers to prevent port conflicts
echo "🔄 Cleaning up existing servers..."
pkill -f "python.*http.server" 2>/dev/null || true
pkill -f "python.*-m.*http.server" 2>/dev/null || true

# Also kill any processes using common development ports
for port in 8080 8000 3000 5000; do
    if lsof -ti:$port >/dev/null 2>&1; then
        echo "   Killing process on port $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
    fi
done

sleep 1
echo "✅ Cleanup complete"
echo ""

# Start fresh server
echo "🚀 Starting new server on port 8080..."
python3 -m http.server 8080 &
sleep 2

# Verify server is running
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Server started successfully at http://localhost:8080"
else
    echo "❌ Failed to start server"
    exit 1
fi

echo ""
echo "🔍 Quick Tests:"
echo ""

# Test main pages
pages=("" "about.html" "projects.html" "contact.html" "404.html")
for page in "${pages[@]}"; do
    url="http://localhost:8080/$page"
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
        echo "✅ $url - OK"
    else
        echo "❌ $url - Failed"
    fi
done

echo ""
echo "📋 Manual Testing Checklist:"
echo ""
echo "1. 🌐 Open http://localhost:8080 in your browser"
echo "2. 🔄 Test language switcher (EN ↔ Lao)"
echo "3. 📱 Resize browser to mobile (375px width)"
echo "4. 🍔 Test hamburger menu on mobile"
echo "5. 🖱️  Click all navigation links"
echo "6. 📞 Test contact links (phone/email)"
echo "7. 🎬 Scroll to see animations"
echo "8. 🔍 Press F12 → Console (check for errors)"
echo ""
echo "🎯 Target Scores (run Lighthouse in Chrome):"
echo "   Performance: ≥90"
echo "   Accessibility: ≥95" 
echo "   SEO: ≥90"
echo ""
echo "🚀 Ready to test! Open http://localhost:8080"