import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Gamepad2, ChevronLeft, ChevronRight, Cpu, MemoryStick as Memory, Monitor } from 'lucide-react';
import { useHardware } from './hooks/useHardware';
import { HardwareCard, Bar } from './components/UIComponents';
import { getPerformanceReport, PerformanceReport } from './utils/performance';

const App: React.FC = () => {
  const { hardware, loading: hwLoading } = useHardware();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gameData, setGameData] = useState<any>(null);
  const [perfReport, setPerfReport] = useState<PerformanceReport | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    if (query.length > 2) {
      const results = await window.electronAPI.searchGame(query);
      setSearchResults(results.slice(0, 5));
      setShowDropdown(true);
    } else setShowDropdown(false);
  };

  const handleAnalyze = async (id: string) => {
    setShowDropdown(false);
    setLoading(true);
    try {
      const details = await window.electronAPI.getGameDetails(id);
      if (details && hardware) {
        setGameData(details);
        setPerfReport(getPerformanceReport(hardware, details.pc_requirements));
        setHistory(prev => [{ id, name: details.name, image: details.header_image }, ...prev].slice(0, 100));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3"><div className="p-2 bg-blue-600 rounded-lg"><Gamepad2 className="w-8 h-8 text-white" /></div><h1 className="text-3xl font-bold">Game<span className="text-blue-500">Check</span></h1></div>
        <div className="relative" ref={searchRef}>
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search game..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)} className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl w-72" />
          {showDropdown && (
            <div className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden z-50">
              {searchResults.map((game: any) => (<button key={game.id} onClick={() => handleAnalyze(game.id.toString())} className="w-full px-4 py-3 hover:bg-slate-800 text-left text-sm">{game.name}</button>))}
            </div>
          )}
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-slate-400">YOUR HARDWARE</h2>
          {hwLoading ? <p>Detecting...</p> : (
            <>
              <HardwareCard icon={Cpu} label="CPU" value={hardware?.cpu.brand || '...'} sub={`${hardware?.cpu.speed} GHz`} />
              <HardwareCard icon={Monitor} label="GPU" value={hardware?.gpu.model || '...'} sub={`${hardware?.gpu.type} | ${hardware?.gpu.memory}`} />
              <HardwareCard icon={Memory} label="RAM" value={`${(hardware?.ram.total / (1024**3)).toFixed(1)} GB`} sub="System Memory" />
            </>
          )}
        </section>

        <section className="lg:col-span-2 space-y-8">
          {gameData && perfReport && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
              <div className="relative h-48 rounded-2xl overflow-hidden -mt-8 -mx-8 mb-4">
                <img src={gameData.header_image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                <h2 className="absolute bottom-6 left-8 text-3xl font-bold">{gameData.name}</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl"><p className="text-xs text-slate-400">720p Low</p><p className="font-mono text-emerald-400 text-lg">{perfReport.fps['720p_low']}</p></div>
                <div className="p-4 bg-slate-950 rounded-xl"><p className="text-xs text-slate-400">1080p Low</p><p className="font-mono text-emerald-400 text-lg">{perfReport.fps['1080p_low']}</p></div>
              </div>
              <div className="space-y-3">
                <Bar label="RAM Bandwidth" percentage={perfReport.metrics.ramBandwidth} />
                <Bar label="CPU Headroom" percentage={perfReport.metrics.cpuHeadroom} />
                <Bar label="GPU Power" percentage={perfReport.metrics.gpuPower} />
              </div>
              <div><p className="text-xs text-slate-500 uppercase">Bottleneck</p><p className="font-bold text-white text-lg">{perfReport.bottleneck}</p></div>
              <div><p className="text-xs text-slate-500 uppercase">Notes</p><ul className="text-xs text-slate-300 list-disc pl-4 mt-2">{perfReport.notes.filter(n => n).map((n, i) => <li key={i}>{n}</li>)}</ul></div>
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
