const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getHardwareInfo: () => ipcRenderer.invoke('get-hardware-info'),
  getGameDetails: (appId) => ipcRenderer.invoke('get-game-details', appId),
  searchGame: (query) => ipcRenderer.invoke('search-game', query),
});
