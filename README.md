# 🚀 Quick Start Guide

## Launch the Demo Application

### For Linux/WSL:
```bash
cd ~/git/entraid
./launch-demo.sh
```

### For Windows localhost Access:
1. **IMPORTANT**: Run `setup-windows-proxy.bat` as Administrator (one-time setup)
2. This enables Windows to access `http://localhost:3000`
3. **Required** for Microsoft Entra ID integration (redirect URI compliance)

## 📁 Project Structure

```
entraid/
├── launch-demo.sh              # Complete launch script (use this!)
├── start-app.sh               # Simple startup script  
├── setup-windows-proxy.bat    # Windows localhost fix (run as admin)
├── test-localhost-connection.sh # Test Windows networking
├── fix-windows-access.sh      # Diagnostic tool
├── README.md                  # This file
└── nextjs-entraid-auth/       # Main project
    ├── package/               # NPM package source
    ├── example/              # Demo application
    ├── README.md             # Detailed documentation
    └── SETUP-GUIDE.md        # Entra ID setup guide
```

## 🌐 Access URLs

- **Local:** http://localhost:3000
- **Network:** http://10.255.255.254:3000

## 🔧 Troubleshooting

1. **Port conflicts:** The script automatically handles port cleanup
2. **Windows access issues:** Run `setup-windows-proxy.bat` as Administrator
3. **Dependencies missing:** The script automatically installs them

## 📚 Full Documentation

- **Main docs:** `nextjs-entraid-auth/README.md`
- **Entra ID setup:** `nextjs-entraid-auth/SETUP-GUIDE.md`
- **Example app:** `nextjs-entraid-auth/example/README.md`

## 💡 What You Can Test

✅ **Demo Interface** - Complete UI with authentication buttons
✅ **Protected Routes** - Pages that require authentication  
✅ **Role-based Access** - Admin-only sections
✅ **Responsive Design** - Mobile-friendly interface

To enable **full authentication**, follow the Entra ID setup guide!