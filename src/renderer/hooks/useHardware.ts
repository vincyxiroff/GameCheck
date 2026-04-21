import { useState, useEffect } from 'react';

export const useHardware = () => {
  const [hardware, setHardware] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.electronAPI.getHardwareInfo().then((info: any) => {
      setHardware(info);
      setLoading(false);
    });
  }, []);

  return { hardware, loading };
};
