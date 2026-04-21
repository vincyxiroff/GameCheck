# GameCheck

**GameCheck** è uno strumento di analisi delle performance di gioco per PC, progettato per fornire stime reali basate sull'architettura hardware, non solo su requisiti minimi teorici.

## 🎯 Caratteristiche
*   **Analisi Hardware Reale**: Rilevamento avanzato di CPU, RAM e GPU (inclusa la gestione intelligente di iGPU come le serie AMD Vega).
*   **Performance Engine**: Calcolo degli FPS basato su tier hardware, larghezza di banda della memoria e ottimizzazione driver (supporto Vulkan/ACO).
*   **Bottleneck Detection**: Identifica se il limite è la GPU, la RAM (banda/capacità) o la CPU.
*   **Search Engine**: Cerca i giochi direttamente da Steam e ottieni requisiti e stime di performance in tempo reale.
*   **Dashboard Moderna**: UI Gaming in dark mode, animazioni fluide e analisi visiva dei componenti.

## ⚙️ Requisiti di Sistema (Sviluppo)
*   Node.js (LTS)
*   npm

## 🚀 Installazione e Avvio
1. Clona il repository.
2. Installa le dipendenze: `npm install`
3. Avvia in modalità sviluppo: `npm run dev`
4. Build per produzione (Linux): `npm run build`

## 🛠️ Tecnologie
*   **Electron**: Framework per app desktop.
*   **React + TailwindCSS**: Interfaccia utente moderna.
*   **Systeminformation**: Analisi hardware di basso livello.
*   **Steam API**: Dati ufficiali dai server Steam.

---
*Progettato per precisione tecnica e accuratezza nelle stime di gioco.*
