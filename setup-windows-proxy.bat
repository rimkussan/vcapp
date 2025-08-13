@echo off
REM Microsoft Entra ID + Next.js Demo - Windows Port Proxy Setup
REM Run this as Administrator in Windows

echo Setting up port forwarding for Next.js demo...
echo.

REM Remove any existing proxy rules for ports 3000 and 3001
netsh interface portproxy delete v4tov4 listenport=3000 >nul 2>&1
netsh interface portproxy delete v4tov4 listenport=3001 >nul 2>&1

REM Add port proxy rule for port 3000 - pointing to WSL IP
echo Setting up: localhost:3000 --^> 172.21.133.77:3000
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=172.21.133.77

if %errorlevel%==0 (
    echo ✅ Port forwarding configured successfully!
    echo.
    echo 🌐 You can now access the demo at: http://localhost:3000
    echo.
    echo 💡 For Entra ID setup, use redirect URI:
    echo    http://localhost:3000/api/auth/callback
    echo.
    echo 📋 Current port forwarding rules:
    netsh interface portproxy show all
) else (
    echo ❌ Failed to configure port forwarding.
    echo.
    echo 🔧 Troubleshooting:
    echo 1. Make sure you're running this as Administrator
    echo 2. Right-click and select "Run as administrator"
    echo 3. Check if WSL application is running on 172.21.133.77:3000
)

echo.
echo Press any key to continue...
pause >nul