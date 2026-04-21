import React from 'react';
import { Cpu, MemoryStick as Memory, Monitor } from 'lucide-react';

export const HardwareCard = ({ icon: Icon, label, value, sub }: any) => (
  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4">
    <div className="p-2 bg-slate-950 rounded-xl"><Icon className="w-5 h-5 text-blue-500" /></div>
    <div>
      <p className="text-[10px] text-slate-500 uppercase">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
      <p className="text-[10px] text-slate-500">{sub}</p>
    </div>
  </div>
);

export const Bar = ({ label, percentage }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] text-slate-400 uppercase">
      <span>{label}</span>
      <span>{percentage}%</span>
    </div>
    <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
      <div 
        className={`h-full ${percentage > 70 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);
