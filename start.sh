#!/usr/bin/env bash
# Quick Start Guide for IMS Audit Management System

echo "=================================="
echo "IMS Audit Management System"
echo "Quick Start Script"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully!"
    echo ""
    echo "🚀 Starting development server..."
    echo ""
    npm run dev
else
    echo "❌ Installation failed!"
    exit 1
fi
