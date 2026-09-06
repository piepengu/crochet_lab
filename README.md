# The Algorithmic Loop

**Where craft meets computation** — an interactive lab exploring the mathematics, algorithms, and computer vision behind fiber craft.

Created by **Jason Zlatinski** — STEM education through craft, maker tools, and explainable AI, run entirely in the browser.

[Live demo](https://crochet-lab.vercel.app/) · [Source](https://github.com/piepengu/crochet_lab)

---

## Highlights

| Pillar | How this app addresses it |
|--------|---------------------------|
| **Idea** | Unusual bridge of hyperbolic geometry, graph coloring, and on-device AI with fiber craft |
| **Implementation** | Interactive 3D, printable PDFs, Stash Buster, attention heatmaps, Demo Mode for reliable presentations |
| **Coding** | Client-side React, procedural mesh math, constraint satisfaction, TensorFlow.js |

**Demo tip:** Open the site with **Demo Mode** on (default). Walk Impact → Radial Topology → Modular Permutations → Texture Recognition.

### AI disclosure

AI coding assistants (including Cursor) were used to accelerate implementation of UI wiring, documentation, and some utility code. Core concepts, architecture, algorithm choices (hyperbolic growth, graph coloring / stash constraints, explainable activations), and validation of behavior were directed and reviewed by **Jason Zlatinski**. The Texture Scanner uses the public MobileNet model via TensorFlow.js; Demo Mode provides deterministic mock predictions for presentations.

---

## What it is

Every crochet pattern is an algorithm. Every stitch is a variable. This lab makes that connection tangible: hyperbolic geometry you can spin in 3D, graph-coloring puzzles you can export as PDFs, and a texture scanner that shows *where* a neural network is looking—not just *what* it guessed.

Built as a React/Vite single-page app with lazy-loaded modules, client-side ML, and a tactile “cyber-cottagecore” UI.

## Modules

### Radial Topology
Visualize how stitch growth creates flat disks vs. hyperbolic ruffles. Adjust the growth multiplier and explore a live **3D mesh** (React Three Fiber) tied to the same math as the stitch-count chart.

### Modular Permutations
Generate valid **granny square** patterns using graph-coloring backtracking—no two adjacent squares share a color. Click squares to edit manually, then **download a printable PDF** with row instructions and yarn estimates.

### Texture Recognition
Upload a photo of crochet or fabric. **MobileNet** (TensorFlow.js, runs in the browser) classifies textures in real time. An **attention heatmap** overlays activation hotspots so you can see which regions drove the prediction.

## Features

- 3D hyperbolic doily visualization with orbit controls
- Graph-coloring pattern generator (3×3 – 5×5 grids)
- PDF pattern export (`@react-pdf/renderer`)
- Explainable AI activation heatmaps
- Crochet-hook cursor and yarn-loop loading animations
- Mock mode for Texture Scanner demos (no model download)
- Responsive layout with keyboard-accessible navigation

## Tech stack

| Layer | Tools |
|--------|--------|
| UI | React 18, Vite, Tailwind CSS, Framer Motion |
| 3D | Three.js, React Three Fiber, Drei |
| Charts | Chart.js |
| ML | TensorFlow.js, MobileNet v2 |
| Export | React PDF |

## Getting started

```bash
git clone https://github.com/piepengu/crochet_lab.git
cd crochet_lab
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
npm run build   # production build
npm run preview # preview production build locally
```

> **Note:** The Texture Scanner downloads MobileNet on first use (~few MB). Enable **mock mode** for faster demos, or wait for the “Loading AI model…” indicator to finish.

## Project structure

```
src/
├── components/
│   ├── layout/Sidebar.jsx
│   ├── modules/
│   │   ├── DoilyGraph.jsx      # Hyperbolic growth + 3D view
│   │   ├── Doily3D.jsx
│   │   ├── SquarePermutator.jsx
│   │   └── TextureScanner.jsx
│   └── shared/
│       ├── YarnSpinner.jsx
│       └── StitchDivider.jsx
├── hooks/useImageClassifier.js
└── utils/
    ├── doilyMath.js
    ├── graphColoring.js
    ├── activationHeatmap.js
    └── patternExport.js
```

## Roadmap

- [x] Visual polish (noise overlay, yarn shader, stitch dividers)
- [x] 3D hyperbolic visualization
- [x] PDF pattern export
- [x] Explainable AI heatmaps
- [x] Micro-interactions (hook cursor, yarn spinners)
- [x] Stash Buster — yarn quantity constraints in pattern generation
- [x] Impact landing + Demo Mode for presentations
- [x] Vite manual chunks (TF.js / Three / PDF)
- [ ] Power-user hotkeys (`Space`, `R`, `1`–`3`)
