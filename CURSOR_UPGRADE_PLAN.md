Here is a structured Markdown file designed for Cursor. You can save this as `CURSOR_UPGRADE_PLAN.md` in your project root.

I have structured this specifically for an AI-assisted workflow, with clear file targets and technical context that Cursor can use to execute these tasks for you.

```markdown
# Cursor Upgrade Plan: The Algorithmic Loop v2.0

**Goal:** Elevate "The Algorithmic Loop" from a functional React app to a high-fidelity, "Cyber-Cottagecore" scientific visualization lab. 
**Focus:** 3D Visualization, Algorithmic Depth, and Tactile UI.

---

## 🎨 Phase 1: Visual Polish ("The Texture of Code")
*Objective: Move beyond flat UI to a tactile, procedural aesthetic that merges "lab" with "craft".*

### 1.1 Procedural Noise Overlay
**Target:** `src/index.css` / `src/App.jsx`
- [ ] Add a global CSS `::after` overlay on the `body` or main container.
- [ ] **Implementation:** Use a base64 SVG noise pattern or CSS `filter: noise()`.
- [ ] **Style:** Low opacity (3-5%), `mix-blend-mode: overlay` to give the flat colors a "paper" or "fabric" grain.

### 1.2 "Yarn" Shader for Grid Cells
**Target:** `src/components/modules/SquarePermutator.jsx`
- [ ] Replace flat background colors on grid squares with a CSS radial gradient or SVG pattern.
- [ ] **Effect:** Make squares look like woven thread (center-out radial gradient) rather than flat `div` blocks.

### 1.3 SVG Stitch Dividers
**Target:** `src/components/shared/` (Create `StitchDivider.jsx`)
- [ ] Create a reusable divider component.
- [ ] **Design:** Instead of `<hr />`, render an SVG path mimicking a crochet chain stitch symbol `(O-O-O-O)`.

---

## 🧊 Phase 2: Module 1 - 3D Hyperbolic Visualization
*Objective: Leverage React Three Fiber to visualize the actual geometry of the math, not just the stitch counts.*

### 2.1 Setup R3F
**Target:** `package.json`, `src/components/modules/Doily3D.jsx`
- [ ] Install dependencies: `npm install @react-three/fiber @react-three/drei`.
- [ ] Create `Doily3D.jsx` to exist alongside or replace the static image in `DoilyGraph.jsx`.

### 2.2 Procedural Geometry Generation
**Target:** `src/utils/doilyMath.js` (Update)
- [ ] **Task:** Create a function to generate vertices for a mesh based on the hyperbolic growth formula.
- [ ] **Logic:**
    - Ring 0: Center point.
    - Ring $n$: Calculate circumference based on `stitchCount`.
    - If circumference > $2 * \pi * radius$ (Hyperbolic), displace vertices in Y-axis (ruffling/buckling) using a `sin` wave function dependent on the "excess" length.
- [ ] **Interaction:** Bind the mesh parameters to the existing `multiplier` slider state.

---

## 🧶 Phase 3: Module 2 - Functional Depth
*Objective: Transform the "Permutator" into a practical tool for makers.*

### 3.1 "Stash Buster" Logic
**Target:** `src/utils/graphColoring.js`
- [ ] **Task:** Update `generateValidPattern` to accept `quantityConstraints`.
- [ ] **Logic:**
    - Input: Color A (40 units), Color B (10 units).
    - Constraint: The generated grid must not use Color B more than 10 times.
    - Implementation: Modify the backtracking/randomizer to prioritize abundant colors and reject patterns that exceed the "stash".

### 3.2 PDF Pattern Export
**Target:** `src/components/modules/SquarePermutator.jsx`
- [ ] Install `npm install @react-pdf/renderer`.
- [ ] **Task:** Add "Download Pattern" button.
- [ ] **Output:** A generated PDF containing:
    - The visual grid.
    - Text instructions ("Row 1: [A, B, A, C]...").
    - Estimated yarn usage.

---

## 🧠 Phase 4: Module 3 - Explainable AI
*Objective: Visualize "Why" the AI sees crochet, addressing black-box opacity.*

### 4.1 Heatmap / Feature Visualization
**Target:** `src/hooks/useImageClassifier.js` / `src/components/modules/TextureScanner.jsx`
- [ ] **Investigation:** Check if the loaded MobileNet model supports accessing internal activation layers in TF.js.
- [ ] **Task:** If possible, extract the activation map of the final convolution layer.
- [ ] **UI:** Overlay this map on the user's uploaded image with `opacity: 0.5` to show "hotspots" (texture/edges) that triggered the classification.

---

## ⚡ Phase 5: Interaction & Performance

### 5.1 Micro-Interactions
**Target:** `src/styles/globals.css`
- [ ] **Cursor:** Change cursor to a "crochet hook" SVG when hovering over interactive grids.
- [ ] **Loading:** Replace spinners with a "looping yarn" animation using Framer Motion.

### 5.2 Power User Hotkeys
**Target:** `src/hooks/useKeyboardControls.js` (New)
- [ ] Create a hook for global shortcuts.
- [ ] **Map:**
    - `Space`: Trigger "Scan" or "Generate".
    - `R`: Reset/Randomize current module.
    - `1, 2, 3`: Quick switch between modules.

---

## 📝 Implementation Priority Queue

1.  **Visual Polish (1.1, 1.2)** - *Quick wins that immediately upgrade the "feel".*
2.  **3D Visualization (2.1, 2.2)** - *High-value feature for your portfolio (Graphics/Math).*
3.  **PDF Export (3.2)** - *High utility for actual users.*
4.  **Stash Buster (3.1)** - *Algorithmic complexity.*

```