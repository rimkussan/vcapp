# 🚀 Quick Start Guide

## Launch the Demo Application

### For Linux/WSL:
```bash
cd ~/git/entraid
./launch-demo.sh
```

### For Windows Port Forwarding:
1. Run `setup-windows-proxy.bat` as Administrator (one-time setup)
2. Then access at `http://localhost:3000`

## 📁 Project Structure

```
entraid/
├── launch-demo.sh              # Complete launch script (use this!)
├── start-app.sh               # Simple startup script
├── setup-windows-proxy.bat    # Windows port forwarding setup
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