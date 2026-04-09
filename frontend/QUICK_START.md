# Event Hub Desktop - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Start Development Server

Option A - React only (for web browser):
```bash
npm run dev
```
Opens at `http://localhost:5173`

Option B - Electron desktop app:
```bash
npm run electron-dev
```
Opens Electron window with React app

### Step 3: Login
- Use test credentials from backend:
  - Email: `test@example.com`
  - Password: `password123`

## 📋 Useful Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start Vite dev server |
| `npm run electron-dev` | Start Electron + React dev |
| `npm run build` | Build React app |
| `npm run electron-build` | Build & run Electron |
| `npm run dist` | Create desktop installers |
| `npm run preview` | Preview built app |

## 🔗 API Integration

All API calls automatically connect to: `http://localhost:5000/api`

**Make sure backend is running before starting the frontend!**

## 🎨 Key Features Ready to Use

✅ Authentication (Login/Register)
✅ Dashboard with event cards
✅ Create events
✅ Event details and registration
✅ Notifications with polling
✅ Personalized recommendations
✅ Desktop notifications (Electron)

## 📂 File Structure Quick Reference

```
frontend/
├── src/
│   ├── components/    # UI components
│   ├── pages/         # Page components
│   ├── services/      # API calls
│   ├── context/       # State management
│   └── hooks/         # Custom hooks
├── electron/          # Electron config
└── package.json       # Dependencies
```

## 🔑 Environment Variables (Optional)

Create `.env.local` if needed:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## ⚠️ Common Issues

**Issue:** "Cannot connect to API"
- **Solution:** Make sure backend is running on port 5000

**Issue:** Electron won't start
- **Solution:** Kill any existing processes, restart with `npm run electron-dev`

**Issue:** Hot reload not working
- **Solution:** Save file again, or restart dev server

## 📚 Next Steps

1. **Customize branding:** Edit colors in `tailwind.config.js`
2. **Add more pages:** Create new files in `src/pages/`
3. **Extend components:** Add new components in `src/components/`
4. **Deploy:** Build with `npm run dist` for desktop or `npm run build` for web

## 🎯 API Endpoints Used

All endpoints configured in:
- `src/services/authService.js`
- `src/services/eventService.js`
- `src/services/notificationService.js`
- `src/services/recommendationService.js`

## 💡 Tips

- Use React DevTools in browser for debugging
- Check Network tab for API calls
- Look at localStorage for JWT token
- Notification panel in navbar shows unread count
- Most pages are protected (require login)

## 🚀 Ready to Deploy?

```bash
# Build for production
npm run build

# Or create desktop installers
npm run dist
```

Happy coding! 🎉
