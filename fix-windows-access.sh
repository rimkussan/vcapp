#!/bin/bash

echo "🔧 Fixing Windows Access to WSL Application"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Get the WSL IP address
WSL_IP=$(ip route show | grep -i default | awk '{ print $3}')
echo "📍 WSL Default Gateway: $WSL_IP"

# Get the WSL host IP (Windows host)
WSL_HOST_IP=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}')
echo "📍 WSL Host IP: $WSL_HOST_IP"

# Get WSL's own IP in the WSL network
WSL_SELF_IP=$(hostname -I | awk '{print $1}')
echo "📍 WSL Internal IP: $WSL_SELF_IP"

echo ""
echo "🔧 To fix Windows access, choose one option:"
echo ""
echo "OPTION 1 - Use the automated batch file:"
echo "   1. In Windows File Explorer, go to: \\\\wsl$\\Ubuntu\\home\\rimkus\\git\\entraid\\"
echo "   2. Right-click setup-windows-proxy.bat"
echo "   3. Select 'Run as administrator'"
echo ""
echo "OPTION 2 - Manual PowerShell commands (run AS ADMINISTRATOR):"
echo "   netsh interface portproxy delete v4tov4 listenport=3000"
echo "   netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=$WSL_SELF_IP"
echo ""
echo "OPTION 3 - Direct access (temporary):"
echo "   http://$WSL_SELF_IP:3000"
echo ""
echo "✅ After setup, use: http://localhost:3000"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"