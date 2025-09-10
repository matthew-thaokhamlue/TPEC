#!/bin/bash

# GitHub Pages Deployment Commands
# Replace 'yourusername' and 'your-repo-name' with your actual GitHub username and repository name

echo "🚀 GitHub Pages Deployment Guide"
echo "================================"
echo ""

echo "1. Initialize Git repository (if not already done):"
echo "   git init"
echo ""

echo "2. Add all files to Git:"
echo "   git add ."
echo ""

echo "3. Make your first commit:"
echo "   git commit -m \"Initial commit: Construction consulting website\""
echo ""

echo "4. Add your GitHub repository as remote:"
echo "   git remote add origin https://github.com/yourusername/your-repo-name.git"
echo ""

echo "5. Push to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""

echo "6. Enable GitHub Pages:"
echo "   - Go to your repository on GitHub"
echo "   - Click Settings tab"
echo "   - Scroll to Pages section"
echo "   - Source: Select 'GitHub Actions'"
echo "   - Save"
echo ""

echo "7. Your site will be available at:"
echo "   https://yourusername.github.io/your-repo-name"
echo ""

echo "🎉 Deployment will happen automatically when you push to main branch!"