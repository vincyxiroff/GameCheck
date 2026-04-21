export interface HardwareInfo {
  cpu: {
    brand: string;
    speed: number;
    cores: number;
  };
  ram: {
    total: number;
  };
  gpu: {
    model: string;
    vram: number;
  }[];
}

export interface GameRequirements {
  minimum?: string;
  recommended?: string;
}

export interface Score {
  cpu: number;
  gpu: number;
  ram: number;
  total: number;
  status: 'unsupported' | 'playable' | 'good' | 'great';
  estimatedFps: string;
}

const parseRam = (req: string): number => {
  const match = req.match(/(\d+)\s*(GB|MB)/i);
  if (!match) return 0;
  const val = parseInt(match[1]);
  return match[2].toUpperCase() === 'GB' ? val : val / 1024;
};

// Extended Score interface
export interface Score {
  cpu: number;
  gpu: number;
  ram: number;
  total: number;
  status: 'unsupported' | 'playable' | 'good' | 'great';
  estimatedFps: string;
  minReq: { cpu: string, gpu: string, ram: string };
}

export const calculateScore = (hardware: HardwareInfo, requirements: GameRequirements, gameName: string = "", releaseDate: string = ""): Score => {
  const ramTotalGB = hardware.ram.total / (1024 * 1024 * 1024);
  const cpuSpeed = hardware.cpu.speed;
  const primaryGpu = hardware.gpu[0];
  let gpuVramGB = (primaryGpu?.model.includes('Vega 10')) ? 2 : (primaryGpu?.vram ? primaryGpu.vram / 1024 : 1);

  // Parsing intelligente con fallback per i giochi moderni/datati
  const parseReq = (req: string | undefined, defaultVal: number) => {
    if (!req) return defaultVal;
    const match = req.match(/(\d+)\s*(GB|GHz|GHz)/i);
    return match ? parseInt(match[1]) : defaultVal;
  };

  // Fallback basato sull'anno se i dati API sono vuoti
  const year = parseInt(releaseDate.split(',').pop() || "2020");
  const baseRam = year > 2020 ? 16 : (year > 2015 ? 8 : 4);
  const baseGpuVram = year > 2020 ? 6 : (year > 2015 ? 3 : 2);

  const minRam = parseReq(requirements.minimum, baseRam);
  const minGpuVram = baseGpuVram; // stima

  const cpuGap = Math.min(100, (cpuSpeed / 2.5) * 100);
  const gpuGap = Math.min(100, (gpuVramGB / minGpuVram) * 100);
  const ramGap = Math.min(100, (ramTotalGB / minRam) * 100);

  const totalGap = (cpuGap + gpuGap + ramGap) / 3;
  
  let fps = '< 20';
  let status: Score['status'] = 'unsupported';
  if (totalGap >= 90) { fps = '60+'; status = 'great'; }
  else if (totalGap >= 60) { fps = '30-60'; status = 'good'; }
  else if (totalGap >= 30) { fps = '20-30'; status = 'playable'; }

  return {
    cpu: Math.round(cpuGap),
    gpu: Math.round(gpuGap),
    ram: Math.round(ramGap),
    total: Math.round(totalGap),
    status,
    estimatedFps: fps,
    minReq: { cpu: 'Min: 2.5GHz', gpu: `Min: ${minGpuVram}GB VRAM`, ram: `${minRam}GB RAM` }
  };
};
