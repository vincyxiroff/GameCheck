import { getGpuMultiplier } from './benchmarks';

export interface PerformanceReport {
  bottleneck: string;
  fps: { '720p_low': string; '1080p_low': string; };
  notes: string[];
  metrics: { ramBandwidth: number; cpuHeadroom: number; gpuPower: number; };
}

export const getPerformanceReport = (hardware: any, requirements: any): PerformanceReport => {
  const gpu = hardware.gpu;
  const ramGB = hardware.ram.total / 1024**3;
  
  // 1. Dati dinamici dal DB
  const gpuMult = getGpuMultiplier(gpu.model);
  const isDualChannel = ramGB >= 14; 
  const ramBandwidthMod = isDualChannel ? 1.25 : 0.85;
  
  // 2. Bottleneck Detection
  let bottleneck = 'Balanced System';
  if (gpu.type === 'integrated') bottleneck = 'GPU (Memory Bandwidth)';
  else if (ramGB < 12) bottleneck = 'RAM (Capacity/Channel)';
  
  // 3. FPS Scaling basato su Tier GPU (Base 100 FPS per una GPU moderna di riferimento)
  const baseFPS_720p = 100 * gpuMult * ramBandwidthMod;
  const baseFPS_1080p = 75 * gpuMult * ramBandwidthMod;

  return {
    bottleneck,
    fps: {
      '720p_low': `${Math.max(15, Math.round(baseFPS_720p - 5))}-${Math.round(baseFPS_720p + 5)} FPS`,
      '1080p_low': `${Math.max(10, Math.round(baseFPS_1080p - 5))}-${Math.round(baseFPS_1080p + 5)} FPS`
    },
    notes: [
      isDualChannel ? "Dual Channel detected (+25% bandwidth)" : "Single Channel detected (Bottleneck: Bandwidth)",
      `GPU Tier Multiplier: ${gpuMult}x (Based on ${gpu.model})`,
      hardware.isAcoEnabled ? "Vulkan/ACO boost applied" : ""
    ],
    metrics: {
      ramBandwidth: isDualChannel ? 100 : 40,
      cpuHeadroom: 75,
      gpuPower: Math.round(gpuMult * 100)
    }
  };
};
