# 🚀 React Workflow Builder

A premium, interactive workflow builder built with React and pure CSS. This application allows users to design logic flows visually, featuring dynamic branching, infinite nesting, and robust undo/redo capabilities.

## ✨ Features

- **Dynamic Tree Structure**: Create infinite flows with Action and Branch (Condition) nodes.
- **Connectors**: Smart CSS connector lines that automatically stretch and align as the tree grows.
- **Premium UI**: 
  - Glass-morphism effects and clean typography (Inter font).
  - Custom context menus for adding nodes.
  - "Infinite Canvas" experience (hidden scrollbars).
- **Branching Logic**:
  - Add "True" and "False" paths seamlessly.
  - Intelligent deletion ensures child nodes are adopted correctly to prevent data loss.
- **State Management**:
  - **Undo/Redo**: Full history stack implementation for mistake-proofing.
  - **JSON Export**: Save your workflow structure to the console for data persistence.

## 🛠️ Tech Stack

- **Frontend**: React (Hooks: `useState`, `useCallback`, `useEffect`).
- **Build Tool**: Vite (Super fast dev server).
- **Styling**: Pure CSS3 (Variable-based theming, Flexbox, `calc()` for dynamic geometry).
- **No External UI Libraries**: All components (Modals, Popovers, Lines) are custom-built from scratch.

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Ayu456sh/workflow-builder.git
cd workflow-builder
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

The app will run at `http://localhost:5173`.

## 🧠 How It Works (For Reviewers)

### Recursive Rendering
The `WorkflowNode` component calls itself to render children. This allows the tree to grow infinitely deep without complex iteration logic.
```javascript
{node.children.map(child => (
   <WorkflowNode node={child} ... />
))}
```

### Dynamic Connector Lines
We use CSS `calc()` to ensure branch lines always meet in the middle, regardless of how wide the sub-trees become.
```css
.branch-true::after {
  /* Start at center (50%) and reach to the gap midpoint (+) */
  width: calc(50% + 1rem); 
}
```

### Undo/Redo Logic
We store snapshots of the entire tree in a `history` array.
- **Undo**: Move `currentIndex` pointer back.
- **Redo**: Move `currentIndex` pointer forward.
- **Add Node**: Slice history up to current index and push new state.

## 📦 Deployment

This project is optimized for deployment on Vercel.
1.  Push to GitHub.
2.  Import project in Vercel.
3.  Deploy (Zero config required).

---
*Built for the Workflow Builder Assignment.*
