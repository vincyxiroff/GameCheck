const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const si = require('systeminformation');
const axios = require('axios');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    backgroundColor: '#0f172a',
    show: false,
  });

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../../dist/renderer/index.html'));
  }

  win.once('ready-to-show', () => {
    win.show();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Hardware Detection IPC
ipcMain.handle('get-hardware-info', async () => {
  try {
    const cpu = await si.cpu();
    const mem = await si.mem();
    const graphics = await si.graphics();
    const os = await si.osInfo();
    const disk = await si.diskLayout();

    const classifyGpu = (graphics, memTotal, osPlatform) => {
      const controllers = graphics.controllers || [];
      const primary = controllers.sort((a, b) => (b.vram || 0) - (a.vram || 0))[0] || { model: 'Unknown GPU', vram: 0 };
      
      const model = primary.model || 'Unknown GPU';
      const isIntegrated = /vega|uhd|iris|radeon graphics|hd graphics|apu/i.test(model);
      
      return {
        model: model,
        type: isIntegrated ? 'integrated' : 'discrete',
        memory: isIntegrated ? 'shared' : 'dedicated',
        vram: isIntegrated 
          ? Math.min(memTotal * 0.25, 4 * 1024 * 1024 * 1024) 
          : (primary.vram || 0),
        isAcoEnabled: osPlatform === 'linux'
      };
    };

    return {
      cpu: { brand: cpu.brand, speed: cpu.speed, cores: cpu.cores },
      ram: { total: mem.total },
      gpu: classifyGpu(graphics, mem.total, os.platform),
      os: { platform: os.platform },
      storage: disk.map(d => ({ type: d.type }))
    };
  } catch (error) {
    console.error('Error getting hardware info:', error);
    return null;
  }
});

// Search for game by name
ipcMain.handle('search-game', async (event, query) => {
  try {
    const response = await axios.get(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=en&cc=US`);
    return response.data.items || [];
  } catch (error) {
    console.error('Error searching games:', error);
    return [];
  }
});

// Get game details
ipcMain.handle('get-game-details', async (event, appId) => {
  try {
    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
    if (response.data[appId]?.success) {
      return response.data[appId].data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching game details:', error);
    return null;
  }
});
