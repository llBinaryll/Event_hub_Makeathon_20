# Installation & Setup Guide

## Prerequisites

Before starting, ensure you have installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Backend Server** (Event Hub API running on port 5000)

Check installations:
```bash
node --version    # Should be v14+
npm --version     # Should be v6+
```

## Step-by-Step Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- React & React Router DOM
- Axios for API calls
- Tailwind CSS for styling
- Vite as build tool
- Electron for desktop app
- All other required packages

Installation size: ~400MB (with node_modules)
Time: 2-5 minutes depending on internet speed

### 3. Create Environment File (Optional)
Create `.env.local` in the `frontend` folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ENABLE_NOTIFICATIONS=true
VITE_NOTIFICATION_POLL_INTERVAL=30000
```

If not created, defaults will be used.

### 4. Verify Backend is Running
Make sure your backend server is running:
```bash
# In backend directory
npm start
# Should see: "Server running on port 5000"
```

## Running the Application

### Option A: React Web App (Browser)
```bash
npm run dev
```

- Opens automatically in browser: `http://localhost:5173`
- Has hot reload (changes update instantly)
- Shows React DevTools in browser console
- Used for development and web deployment

**Test:** You should see the login page

### Option B: Electron Desktop App
```bash
npm run electron-dev
```

- Opens in native desktop window
- Same React app inside Electron
- Developer console available
- Native desktop notifications work

**Test:** You should see login page in desktop window

### Option C: Build for Production

Build React app:
```bash
npm run build
```
- Creates optimized `dist/` folder
- Ready for web deployment
- ~400KB minified

Build Electron app:
```bash
npm run electron-build
```
- Creates desktop executable in `dist/` folder
- Ready for distribution

## First Time Usage

### 1. Register New Account
- Click "Register here" on login page
- Fill in details:
  - Name: Your name
  - Email: yourname@example.com
  - Password: At least 6 characters
- Click "Register"
- Redirected to login page

### 2. Login
- Email: Use your registered email
- Password: Your password
- Click "Login"
- Redirected to dashboard

### 3. Explore Dashboard
- See registered events (none initially)
- See upcoming events
- See recommendations
- Try creating an event

### 4. Try Features
- **Create Event**: Fill form and submit
- **Browse Events**: See all available events
- **Register**: Click "Register" on any event
- **Notifications**: Click bell icon to see notifications
- **Profile**: Click your name dropdown

## Troubleshooting Setup

### Issue: "Cannot find module 'react'"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 5173 already in use"
```bash
# Kill the process using port 5173
# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :5173
kill -9 <PID>
```

### Issue: "Cannot connect to API"
- Check backend is running: `http://localhost:5000`
- Check `VITE_API_BASE_URL` in .env.local
- Check browser console for CORS errors

### Issue: "Electron won't start"
```bash
# Try these fixes in order:
npm install
npm run electron-dev

# If still fails:
rm -rf node_modules
npm install
npm run electron-dev
```

### Issue: "Blank white screen in browser"
- Check browser console for errors (F12)
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server (Ctrl+C and npm run dev again)

### Issue: "npm install stuck"
```bash
# Clear npm cache and retry
npm cache clean --force
npm install
```

## Development Workflow

### Daily Development
```bash
# Terminal 1: Start backend (if not running)
cd ../backend
npm start

# Terminal 2: Start frontend
cd ../frontend
npm run dev

# Then open browser: http://localhost:5173
```

### Making Changes
- Edit any file in `src/`
- Save file (Ctrl+S)
- Browser automatically refreshes
- No need to restart

### Stopping Development Server
Press `Ctrl + C` in terminal

### Debugging
1. **Browser Console**: F12 or Ctrl+Shift+I
2. **Network Tab**: Check API calls
3. **Application Tab**: View localStorage (JWT token)
4. **React DevTools**: Install browser extension

## Key Directories

```
frontend/
├── src/                  # Main application code
│   ├── components/       # Reusable components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── context/         # State management
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utilities
│   ├── App.jsx          # Main app
│   └── main.jsx         # Entry point
├── public/              # Static files
├── electron/            # Electron config
├── dist/                # Built files (after npm run build)
└── index.html           # HTML template
```

## Important Files to Know

| File | Purpose |
|------|---------|
| `package.json` | Dependencies & scripts |
| `.env.local` | Environment variables |
| `vite.config.js` | Vite configuration |
| `tailwind.config.js` | Tailwind CSS config |
| `electron/main.js` | Electron entry point |
| `src/App.jsx` | React app entry |
| `src/main.jsx` | Vite/React entry |

## Commands Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server (browser) |
| `npm run electron-dev` | Start Electron dev |
| `npm run build` | Build for production |
| `npm run electron-build` | Build Electron executable |
| `npm run dist` | Create installers |
| `npm run preview` | Preview built app |

## Next Steps

1. ✅ Complete this setup
2. 📚 Read ARCHITECTURE.md for code structure
3. 🎨 Customize colors in tailwind.config.js
4. 🚀 Explore and modify components
5. 📦 Deploy when ready

## Support

Check these files for help:
- `README.md` - Feature overview
- `QUICK_START.md` - Quick reference
- `ARCHITECTURE.md` - Code structure
- `ENVIRONMENT.md` - Configuration

Happy coding! 🎉
