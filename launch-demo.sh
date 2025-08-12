#!/bin/bash

# Microsoft Entra ID + Next.js Demo - Complete Launch Script
# This script handles everything needed to run the demo independently

echo "🚀 Microsoft Entra ID + Next.js Authentication Demo"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to kill existing processes on ports 3000 and 3001
cleanup_ports() {
    echo "🧹 Cleaning up any existing processes..."
    
    # Kill any processes on ports 3000 and 3001
    fuser -k 3000/tcp 2>/dev/null || true
    fuser -k 3001/tcp 2>/dev/null || true
    
    # Wait a moment for processes to fully terminate
    sleep 2
}

# Function to setup Windows port proxy
setup_windows_proxy() {
    echo "🔧 Setting up Windows port forwarding..."
    echo "   Run this in Windows PowerShell as Administrator:"
    echo "   netsh interface portproxy delete v4tov4 listenport=3000"
    echo "   netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=127.0.0.1"
    echo ""
}

# Navigate to project directory
cd /home/rimkus/git/entraid/nextjs-entraid-auth/example

echo "📁 Project: nextjs-entraid-auth/example"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Ensure .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚙️  Creating environment configuration..."
    cp .env.local.example .env.local
    echo "✅ Created .env.local with demo values"
fi

# Clean up any existing processes
cleanup_ports

echo "🌐 Starting development server..."
echo ""

# Start the server on a specific port to avoid conflicts
PORT=3000 npm run dev -- --hostname 0.0.0.0 --port 3000 &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 3

# Check if server started successfully
if kill -0 $SERVER_PID 2>/dev/null; then
    echo ""
    echo "✅ Server started successfully!"
    echo ""
    echo "🌐 Access URLs:"
    echo "   • Local: http://localhost:3000"
    echo "   • Network: http://10.255.255.254:3000"
    echo ""
    echo "📋 Features you can test:"
    echo "   • Home page with demo interface"
    echo "   • Click 'Protected Page' button (will redirect to login)"
    echo "   • Click 'Admin Page' button (will redirect to login)"
    echo "   • Sign in button (will show Entra ID setup needed)"
    echo ""
    echo "💡 To enable full authentication:"
    echo "   1. Set up Microsoft Entra ID app registration"
    echo "   2. Edit .env.local with your real credentials"
    echo "   3. Follow: ~/git/entraid/nextjs-entraid-auth/SETUP-GUIDE.md"
    echo ""
    setup_windows_proxy
    echo "⏹️  Press Ctrl+C to stop the server"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Keep the script running and wait for the server
    wait $SERVER_PID
else
    echo "❌ Failed to start server"
    exit 1
fi