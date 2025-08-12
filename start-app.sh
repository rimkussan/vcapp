#!/bin/bash

# Microsoft Entra ID + Next.js Authentication Demo Startup Script
# Created: 2025-08-12

echo "🚀 Starting Microsoft Entra ID + Next.js Authentication Demo..."
echo "📁 Project location: /home/rimkus/git/entraid/nextjs-entraid-auth/example"
echo ""

# Navigate to the example app directory
cd /home/rimkus/git/entraid/nextjs-entraid-auth/example

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Creating with test values..."
    cp .env.local.example .env.local
    echo "✅ Created .env.local with test values"
    echo "💡 Edit .env.local with your real Entra ID credentials for full authentication"
    echo ""
fi

echo "🌐 Starting development server..."
echo "📍 Local access: http://localhost:3000"
echo "📍 Network access: http://10.255.255.254:3000 (if port proxy is configured)"
echo ""
echo "⏹️  Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Start the development server with hostname binding for Windows access
npm run dev -- --hostname 0.0.0.0