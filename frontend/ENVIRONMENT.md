# Environment Configuration Guide

## Environment Variables

Create a `.env.local` file in the frontend root directory to override defaults.

### Available Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Event Hub
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_NOTIFICATIONS=true
VITE_NOTIFICATION_POLL_INTERVAL=30000

# Electron Configuration
VITE_ELECTRON_ENABLED=true
```

## Development vs Production

### Development Mode
```bash
npm run dev
# Vite dev server at http://localhost:5173
# Hot Module Replacement (HMR) enabled
# Source maps available
# Console logs visible
```

### Production Mode
```bash
npm run build
# Optimized bundle in `dist/` folder
# Minified and tree-shaken
# Source maps optional
```

### Electron Development
```bash
npm run electron-dev
# React app in Electron window
# Shows DevTools
# Hot reload on file changes
```

## Configuration Files

### vite.config.js
- Port configuration (5173)
- Build output directory (dist)
- Aliases for imports (@)
- Plugin configuration (React)

### tailwind.config.js
- Color definitions
- Font configurations
- Custom theme extensions

### postcss.config.js
- Tailwind CSS processing
- Autoprefixer

### package.json
- Dependencies and dev dependencies
- Scripts for various tasks
- Electron builder configuration

## Customization

### Change API Base URL
Update in `.env.local`:
```env
VITE_API_BASE_URL=http://api.example.com
```

### Change Colors
Update in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
      accent: '#your-color',
    },
  },
},
```

### Change Port
Update in `vite.config.js`:
```javascript
server: {
  port: 3000, // Change from 5173
},
```

### Enable/Disable Features
Create feature flag in component:
```javascript
const notificationsEnabled = import.meta.env.VITE_ENABLE_NOTIFICATIONS;
```

## Build Configuration

### For Desktop Distribution
Update `package.json` build section:
```json
"build": {
  "appId": "com.yourdomain.app",
  "productName": "Your App Name",
  "files": ["dist/**/*", "electron/main.js"],
  "directories": {
    "buildResources": "public"
  }
}
```

### For Web Deployment
1. Build: `npm run build`
2. Deploy `dist/` folder to:
   - Vercel
   - Netlify
   - AWS S3
   - GitHub Pages
   - Any static host

## Performance Tuning

### Reduce Bundle Size
```javascript
// vite.config.js
export default defineConfig({
  build: {
    minify: 'terser',
    target: 'esnext',
  },
});
```

### Optimize Images
- Use WebP format when possible
- Compress SVGs
- Lazy load images

### Code Splitting
```javascript
// In App.jsx
const LazyPage = lazy(() => import('./pages/LazyPage'));
```

## Security Considerations

1. **Never commit .env.local**
   - Add to .gitignore

2. **Keep secrets in environment**
   - API keys
   - JWT secrets
   - Database credentials

3. **Validate API responses**
   - Check data types
   - Sanitize user input

4. **HTTPS in production**
   - Always use HTTPS
   - Set secure cookies

## Troubleshooting Configuration

### Port Already in Use
```bash
# Find process using port 5173
lsof -i :5173
# Kill process
kill -9 <PID>
```

### Module Not Found
```javascript
// Make sure vite.config.js alias is correct
alias: {
  '@': path.resolve(__dirname, './src'),
}
```

### Build Optimization Issues
- Clear cache: `rm -rf dist/ node_modules/.vite`
- Check dependencies: `npm audit`
- Update packages: `npm update`

## Production Checklist

- [ ] Environment variables set correctly
- [ ] API base URL points to production
- [ ] Build completes without errors
- [ ] No console errors or warnings
- [ ] Responsive design works on all devices
- [ ] Authentication flow tested
- [ ] Notifications working
- [ ] Error handling working
- [ ] Performance acceptable
- [ ] Security headers configured
