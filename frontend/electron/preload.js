const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  sendNotification: (notification) => {
    ipcRenderer.send('send-notification', notification);
  },
  appReady: () => {
    return ipcRenderer.invoke('app-ready');
  },
});
