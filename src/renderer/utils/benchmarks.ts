export const GPU_TIERS: Record<string, { multiplier: number; name: string }> = {
  'vega 10': { multiplier: 0.45, name: 'AMD Radeon Vega 10' },
  'vega 8': { multiplier: 0.35, name: 'AMD Radeon Vega 8' },
  'rtx 3060': { multiplier: 1.0, name: 'Nvidia RTX 3060' },
  'gtx 1650': { multiplier: 0.6, name: 'Nvidia GTX 1650' },
  'intel uhd': { multiplier: 0.25, name: 'Intel UHD Graphics' },
  'default': { multiplier: 0.3, name: 'Integrated GPU' }
};

export const getGpuMultiplier = (model: string): number => {
  const normalized = model.toLowerCase();
  for (const key in GPU_TIERS) {
    if (normalized.includes(key)) return GPU_TIERS[key].multiplier;
  }
  return GPU_TIERS['default'].multiplier;
};
