# GameCheck

**GameCheck** is a professional-grade PC gaming performance analyzer designed to provide realistic FPS estimations and hardware bottleneck identification, moving beyond theoretical requirements.

## 🎯 Key Features
*   **Real-Hardware Profiling**: Advanced detection of CPU, RAM, and GPU (including specialized handling for integrated APUs like AMD Vega).
*   **Performance Engine**: FPS estimation based on hardware tiering, memory bandwidth modeling, and driver-level optimizations (Mesa/Vulkan/ACO awareness).
*   **Bottleneck Detection**: Pinpoints whether the system limit is GPU (bandwidth/VRAM), RAM (capacity/channel), or CPU (core count).
*   **Steam Integration**: Real-time game search and metadata fetching via Steam Store API.
*   **Pro-Level Dashboard**: Gaming-centric dark mode UI with fluid animations and visual hardware health metrics.

## ⚙️ Development Requirements
*   Node.js (LTS)
*   npm

## 🚀 Getting Started
1. Clone the repository.
2. Install dependencies: `npm install`
3. Run in development mode: `npm run dev`
4. Build for production: `npm run build`

## 🛠️ Tech Stack
*   **Electron**: Cross-platform desktop framework.
*   **React + TailwindCSS**: Modern, responsive user interface.
*   **Systeminformation**: Low-level hardware diagnostics.
*   **Steam API**: Official game metadata and requirement retrieval.

---
*Engineered for performance accuracy and technical reliability.*
