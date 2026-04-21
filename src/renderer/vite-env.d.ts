interface ElectronAPI {
  getHardwareInfo: () => Promise<any>;
  getGameDetails: (appId: string) => Promise<any>;
}

interface Window {
  electronAPI: ElectronAPI;
}
