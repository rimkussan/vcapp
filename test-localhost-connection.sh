#!/bin/bash

echo "🧪 Testing Windows localhost Connection to WSL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Get WSL IP
WSL_IP=$(hostname -I | awk '{print $1}')
echo "📍 WSL Internal IP: $WSL_IP"
echo "📍 Expected Windows access: http://localhost:3000"
echo ""

# Check if app is running
echo "🔍 Checking if application is running..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Application responds on localhost:3000 (from WSL)"
else
    echo "❌ Application not responding on localhost:3000 (from WSL)"
fi

if curl -s http://$WSL_IP:3000 > /dev/null 2>&1; then
    echo "✅ Application responds on $WSL_IP:3000"
else
    echo "❌ Application not responding on $WSL_IP:3000"
fi

echo ""
echo "🔧 To fix Windows access:"
echo "1. Run the batch file as Administrator:"
echo "   \\\\wsl$\\Ubuntu\\home\\rimkus\\git\\entraid\\setup-windows-proxy.bat"
echo ""
echo "2. Or run these PowerShell commands as Administrator:"
echo "   netsh interface portproxy delete v4tov4 listenport=3000"
echo "   netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=$WSL_IP"
echo ""
echo "3. Then test from Windows browser: http://localhost:3000"
echo ""
echo "💡 For Entra ID, use redirect URI: http://localhost:3000/api/auth/callback"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"