# The Computational Crochet Lab: Comprehensive Build Plan

**Project Title:** The Algorithmic Loop  
**Tech Stack:** React (Vite), Tailwind CSS, TensorFlow.js, Chart.js  
**Goal:** A scientific lab dashboard exploring the mathematics and algorithms behind crochet patterns

---

## 📋 Project Overview

This project demonstrates the intersection of mathematics, computer science, and traditional craft through three interactive modules:
1. **Radial Topology (Doilies)** - Visualizing hyperbolic geometry in crochet
2. **Modular Permutations (Granny Squares)** - Graph coloring algorithms for pattern generation
3. **Texture Recognition (AI Scanner)** - Computer vision for stitch identification

---

## 🎯 Phase 0: Project Initialization & Setup

### Step 0.1: Initialize Vite + React Project
```bash
npm create vite@latest crochet-lab -- --template react
cd crochet-lab
npm install
```

**Verification:** Run `npm run dev` - should see default Vite page

### Step 0.2: Install Dependencies
```bash
# Core UI & Styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# UI Components & Icons
npm install lucide-react framer-motion

# Data Visualization
npm install chart.js react-chartjs-2

# AI/ML
npm install @tensorflow/tfjs @tensorflow-models/mobilenet

# Utilities
npm install clsx
```

### Step 0.3: Project Structure Setup
Create the following directory structure:
```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   └── Header.jsx
│   ├── modules/
│   │   ├── DoilyGraph.jsx
│   │   ├── SquarePermutator.jsx
│   │   └── TextureScanner.jsx
│   └── shared/
│       └── Manifesto.jsx
├── hooks/
│   └── useImageClassifier.js
├── utils/
│   └── constants.js
├── styles/
│   └── globals.css
└── assets/
    └── images/
```

---

## 🎨 Phase 1: Design System & Layout Foundation

### Step 1.1: Configure Tailwind CSS

**File:** `tailwind.config.js`

**Requirements:**
- Monospaced font stack: 'Space Mono', 'Courier Prime', monospace
- Color palette:
  - Canvas White: `#FAFAFA`
  - Charcoal: `#1A1A1A`
  - Yarn Blue: `#4A90E2`
  - Accent Green: `#2ECC71` (for terminal-style outputs)
- Dark mode support
- Custom spacing scale

**Implementation Notes:**
- Extend theme with custom colors
- Configure font family
- Add custom utilities for code-like aesthetics

### Step 1.2: Global Styles

**File:** `src/index.css`

**Requirements:**
- Import Tailwind directives
- Set base font to monospace stack
- Smooth scrolling
- Custom scrollbar styling (thin, minimal)
- Selection color matching Yarn Blue

### Step 1.3: Layout Component

**File:** `src/components/layout/Sidebar.jsx`

**Features:**
- Fixed left sidebar (desktop) / collapsible (mobile)
- Logo/Title: "The Algorithmic Loop"
- Navigation menu with 3 modules + About
- Active state highlighting
- Lucide icons for each module
- Responsive design (hamburger menu on mobile)

**Icons:**
- Radial Topology: `Circle` or `Radial`
- Modular Permutations: `Grid3x3` or `Boxes`
- Texture Recognition: `Scan` or `Camera`
- About: `FileText` or `Info`

### Step 1.4: Main App Structure

**File:** `src/App.jsx`

**Features:**
- Router setup (React Router or simple state-based routing)
- Sidebar + Main content area layout
- Module switching logic
- Smooth transitions between modules

---

## 📊 Phase 2: Module 1 - Radial Topology Visualizer

### Step 2.1: Mathematical Model

**File:** `src/utils/doilyMath.js`

**Functions to implement:**
```javascript
// Linear growth (flat plane)
function linearGrowth(row, baseStitches = 6) {
  return baseStitches * row;
}

// Exponential growth (hyperbolic ruffle)
function exponentialGrowth(row, multiplier = 1.2, baseStitches = 6) {
  return baseStitches * Math.pow(multiplier, row - 1);
}

// Generate data points for chart
function generateDoilyData(maxRows = 20, multiplier = 1.0) {
  // Returns array of {row, linear, exponential, adjusted}
}
```

### Step 2.2: Chart Component

**File:** `src/components/modules/DoilyGraph.jsx`

**Features:**
1. **Chart.js Configuration:**
   - Line chart with 2-3 datasets
   - X-axis: Row Number (1-20)
   - Y-axis: Stitch Count
   - Custom styling (monospace-friendly colors)

2. **Controls:**
   - Slider: Stitch Multiplier (0.8 to 1.5, step 0.05)
   - Display current multiplier value
   - Reset button

3. **Visualization:**
   - Line A: Ideal Flat Plane (linear)
   - Line B: Hyperbolic Ruffle (exponential)
   - Line C: Adjusted (based on slider)

4. **Image Display:**
   - Left side: Doily photo (`public/images/doily-analysis.jpg`)
   - Right side: Chart
   - Caption explaining the mathematics

**UI Improvements:**
- Add tooltips explaining each line
- Show mathematical formulas in legend
- Add "What happens if..." scenarios

### Step 2.3: Enhanced Features

**Additional Enhancements:**
- Row-by-row breakdown table
- Visual indicator when ruffle threshold is crossed
- Export chart as image
- Pre-set scenarios (e.g., "Perfect Flat", "Slight Ruffle", "Extreme Ruffle")

---

## 🎲 Phase 3: Module 2 - Granny Square Permutator

### Step 3.1: Grid Component

**File:** `src/components/modules/SquarePermutator.jsx`

**State Management:**
```javascript
const [grid, setGrid] = useState(initializeGrid(3, 3));
const [colors, setColors] = useState(['#E74C3C', '#3498DB', '#2ECC71', '#F39C12']);
const [attempts, setAttempts] = useState(0);
const [isValid, setIsValid] = useState(true);
```

### Step 3.2: Graph Coloring Algorithm

**File:** `src/utils/graphColoring.js`

**Algorithm Requirements:**
1. **Constraint:** No two adjacent squares (horizontal/vertical) can have the same color
2. **Backtracking Algorithm:**
   - Try random assignment
   - Check constraints
   - If violation, retry
   - Track attempts

**Implementation:**
```javascript
function isValidColoring(grid, row, col, color) {
  // Check neighbors (top, bottom, left, right)
  // Return false if any neighbor has same color
}

function generateValidPattern(gridSize, colors, maxAttempts = 1000) {
  // Try random shuffles until valid
  // Return {grid, attempts, success}
}
```

### Step 3.3: Interactive Features

**UI Components:**
1. **Grid Display:**
   - CSS Grid layout (3x3 default, configurable)
   - Colored squares with hover effects
   - Border highlighting for invalid neighbors

2. **Controls:**
   - "Generate Pattern" button
   - Grid size selector (3x3, 4x4, 5x5)
   - Color palette editor
   - Manual square color picker

3. **Feedback:**
   - Attempt counter
   - Success/failure indicator
   - Constraint violation highlights
   - Pattern statistics (color distribution)

### Step 3.4: Advanced Features

**Enhancements:**
- Save favorite patterns
- Pattern history (undo/redo)
- Export pattern as JSON/image
- Algorithm visualization (show backtracking process)
- Different algorithms (greedy, backtracking, genetic)

---

## 🤖 Phase 4: Module 3 - Texture Recognition Scanner

### Step 4.1: TensorFlow.js Hook

**File:** `src/hooks/useImageClassifier.js`

**Features:**
```javascript
const useImageClassifier = () => {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load MobileNet model
  // classifyImage function
  // Return { model, loading, error, classifyImage }
}
```

**Implementation Notes:**
- Load MobileNet on mount
- Handle loading states
- Error handling for model loading failures
- Cleanup on unmount

### Step 4.2: Scanner Component

**File:** `src/components/modules/TextureScanner.jsx`

**Features:**

1. **Upload Interface:**
   - Drag-and-drop zone
   - File input fallback
   - Image preview
   - Supported formats indicator

2. **Classification:**
   - Auto-classify on upload
   - Loading spinner during processing
   - Display top 3 predictions

3. **Results Display:**
   - Terminal-style output (green text on black)
   - Probability bars (visual + percentage)
   - Confidence threshold indicator
   - Re-classify button

4. **UI Enhancements:**
   - Image zoom/pan
   - Before/after comparison
   - Classification history
   - Export results

### Step 4.3: Mock Mode (Optional)

**For Demo Purposes:**
- If model loading fails or for faster demos
- Mock classification results
- Simulate realistic probabilities
- Toggle between real/mock mode

**Mock Data Structure:**
```javascript
const mockPredictions = [
  { className: 'Crochet Pattern', probability: 0.85 },
  { className: 'Textured Fabric', probability: 0.12 },
  { className: 'Knit Stitch', probability: 0.03 }
];
```

---

## 📝 Phase 5: About/Manifesto Section

### Step 5.1: Manifesto Component

**File:** `src/components/shared/Manifesto.jsx`

**Content:**
- Title: "The Human Algorithm"
- Main text (provided in original guide)
- Additional sections:
  - "Why This Matters"
  - "The Mathematics of Craft"
  - "Future Explorations"

**Styling:**
- Large serif font for body text
- Centered layout
- Generous whitespace
- Subtle animations on scroll

### Step 5.2: Project Credits

**Additional Sections:**
- Technology stack
- Inspiration sources
- Future improvements
- Contact/portfolio links

---

## 🚀 Phase 6: Polish & Optimization

### Step 6.1: Performance Optimization

**Tasks:**
- Code splitting (lazy load modules)
- Image optimization (WebP, lazy loading)
- Memoization for expensive calculations
- Debounce slider inputs
- Virtual scrolling for large grids

### Step 6.2: Accessibility

**Requirements:**
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader friendly
- Color contrast compliance (WCAG AA)
- Focus indicators

### Step 6.3: Responsive Design

**Breakpoints:**
- Mobile: < 640px (stacked layout, collapsible sidebar)
- Tablet: 640px - 1024px (adjusted grid)
- Desktop: > 1024px (full layout)

### Step 6.4: Error Handling

**Implement:**
- Error boundaries for each module
- User-friendly error messages
- Fallback UI for failed operations
- Loading states everywhere

### Step 6.5: Testing Considerations

**Test Cases:**
- Graph coloring algorithm correctness
- Chart data accuracy
- Image upload/classification flow
- Responsive breakpoints
- Navigation between modules

---

## 📦 Phase 7: Deployment Preparation

### Step 7.1: Build Configuration

**File:** `vite.config.js`

**Optimizations:**
- Production build settings
- Asset optimization
- Environment variables setup

### Step 7.2: Documentation

**Files to Create:**
- `README.md` - Project overview, setup instructions
- `DEPLOYMENT.md` - Deployment guide
- `CONTRIBUTING.md` - If open source

### Step 7.3: Pre-Deployment Checklist

- [ ] All modules functional
- [ ] Responsive design tested
- [ ] Performance optimized
- [ ] Error handling in place
- [ ] Images optimized
- [ ] SEO meta tags added
- [ ] Analytics (optional) configured

### Step 7.4: Deploy to Vercel

**Steps:**
1. Initialize git: `git init`
2. Create `.gitignore` (if not exists)
3. Commit: `git add . && git commit -m "Initial commit"`
4. Push to GitHub/GitLab
5. Import to Vercel
6. Configure environment variables (if any)
7. Deploy

---

## 🔄 Improvements Over Original Plan

### 1. **Better Project Structure**
   - Organized component hierarchy
   - Separation of concerns (utils, hooks, components)
   - Clear file naming conventions

### 2. **Enhanced Functionality**
   - More interactive features per module
   - Advanced algorithms (graph coloring with backtracking)
   - Better error handling and loading states

### 3. **Performance Considerations**
   - Code splitting
   - Lazy loading
   - Memoization strategies

### 4. **Accessibility & UX**
   - ARIA labels
   - Keyboard navigation
   - Responsive design details
   - Loading states

### 5. **Developer Experience**
   - Clear file structure
   - Utility functions separated
   - Reusable hooks
   - Better code organization

### 6. **Deployment Ready**
   - Pre-deployment checklist
   - Build optimization
   - Documentation requirements

---

## 📅 Estimated Timeline

- **Phase 0-1:** 2-3 hours (Setup & Layout)
- **Phase 2:** 3-4 hours (Doily Visualizer)
- **Phase 3:** 3-4 hours (Square Permutator)
- **Phase 4:** 2-3 hours (Texture Scanner)
- **Phase 5:** 1 hour (Manifesto)
- **Phase 6:** 2-3 hours (Polish)
- **Phase 7:** 1 hour (Deployment)

**Total:** ~14-18 hours

---

## 🎯 Success Criteria

- [ ] All three modules functional and interactive
- [ ] Responsive on mobile, tablet, desktop
- [ ] Fast load times (< 3s initial load)
- [ ] Accessible (keyboard navigable, screen reader friendly)
- [ ] Deployed and accessible via URL
- [ ] Code is clean, commented, and maintainable

---

## 🚨 Potential Challenges & Solutions

1. **TensorFlow.js Model Loading**
   - Challenge: Large model size, slow loading
   - Solution: Show loading states, consider CDN, or mock mode

2. **Graph Coloring Performance**
   - Challenge: Large grids may take many attempts
   - Solution: Set max attempts, show progress, use better algorithms

3. **Chart.js Configuration**
   - Challenge: Complex styling requirements
   - Solution: Create reusable chart config utility

4. **Mobile Responsiveness**
   - Challenge: Complex layouts on small screens
   - Solution: Mobile-first approach, collapsible sidebar, stacked layouts

---

## 📚 Additional Resources

- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [TensorFlow.js Guide](https://www.tensorflow.org/js/guide)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/) (if using routing)

---

**Ready to start? Begin with Phase 0 and work through each phase sequentially!**
