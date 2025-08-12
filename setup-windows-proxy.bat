@echo off
REM Microsoft Entra ID + Next.js Demo - Windows Port Proxy Setup
REM Run this as Administrator in Windows

echo Setting up port forwarding for Next.js demo...
echo.

REM Remove any existing proxy rules for ports 3000 and 3001
netsh interface portproxy delete v4tov4 listenport=3000 >nul 2>&1
netsh interface portproxy delete v4tov4 listenport=3001 >nul 2>&1

REM Add port proxy rule for port 3000
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=127.0.0.1

if %errorlevel%==0 (
    echo ✅ Port forwarding configured successfully!
    echo.
    echo Now you can access the demo at: http://localhost:3000
    echo.
    echo To view current proxy rules:
    netsh interface portproxy show all
) else (
    echo ❌ Failed to configure port forwarding.
    echo Make sure you're running this as Administrator.
)

echo.
echo Press any key to continue...
pause >nul