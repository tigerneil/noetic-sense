# 智觉 · NOETIC SENSE — Cognitive Prosthesis for Human–ASI Symbiosis

**Live Interactive Monograph:** [https://tigerneil.github.io/noetic-sense/](https://tigerneil.github.io/noetic-sense/)

An interactive bilingual (Chinese / English) editorial monograph and sensory simulation website for **智觉 (Noetic Sense / Intellect-Sense)** — powered by **Three.js (`three/webgpu`)**, **TSL (Three.js Shading Language) Compute Shaders**, and **Web Audio Sub-Audible Harmonic Synthesis**.

## Architecture

- **[index.html](./index.html)** — Semantic HTML5 shell, bilingual language-mode switcher (`双语 / 中文 / EN`), Obsidian/Rice-Paper theme switcher, neuro-acoustic resonance toggle, and live GPU telemetry strip.
- **[src/engine/noeticWebGPUEngine.js](./src/engine/noeticWebGPUEngine.js)** — `THREE.WebGPURenderer` + TSL shader graph:
  - **Sovereignty Mind-Membrane (`MeshPhysicalNodeMaterial`)**: Multi-octave MaterialX 3D simplex flow, Chladni harmonic standing waves vs. microtonal dissonance tremors, cliff-edge gravitational curvature, and real-time 3D cursor raycast tactile recoil ripples.
  - **GPU Compute Spore Field (`instancedArray` + `.compute(4096)`)**: 4,096 GPU-computed barometric & causal spores modulated by Probabilistic Depth of Field (`uDepth`), Bidirectional Cognitive Overload Attenuation (`uOverload`), and Sovereignty Boundary repulsion — compiling natively to WGSL Compute on WebGPU with automatic WebGL2 Transform-Feedback fallback.
  - **Concentric Causal Horizon Filaments**: Three temporal horizon orbits (`τ₁`, `τ₂`, `τ₃`) with traveling-phase TSL opacity nodes.
- **[src/engine/noeticAudioEngine.js](./src/engine/noeticAudioEngine.js)** — Pure Web Audio sub-audible bone-conduction & harmonic interval synthesizer (`108 Hz` mastoid fundamental, `3:2` pure fifth ↔ detuned beating interval, `54 Hz` spatial gravity sub-bass, barometric wind, and tactile recoil pulses).
- **[src/data/noeticContent.js](./src/data/noeticContent.js)** — Complete bilingual manifesto, 4D synesthetic specifications, hardware paradigms, 3 wearable prototypes (Micro-Neurosurgery, Macro-Risk Stewardship, Symbiotic Artistry), and 3 post-noetic philosophical dialectics.
- **[src/styles/index.css](./src/styles/index.css)** — Pure Vanilla CSS design system featuring curated Obsidian Mineral and Archival Xuan Rice-Paper palettes.

## Development

```bash
npm install
npm run dev
```
