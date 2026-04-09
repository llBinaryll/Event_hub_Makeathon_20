const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');

let mainWindow;
const isDev = process.env.NODE_ENV === 'development';

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, '../public/icon.png'),
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle notifications from renderer process
ipcMain.on('send-notification', (event, { title, body, icon }) => {
  new Notification({
    title,
    body,
    icon: icon || path.join(__dirname, '../public/icon.png'),
  }).show();
});

// Handle app ready
ipcMain.handle('app-ready', () => {
  return {
    isDev,
    version: app.getVersion(),
  };
});
