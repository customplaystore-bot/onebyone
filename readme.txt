PROJECT: OneByOne - Professional 1:1 Image Cropper
===================================================

Overview:
A high-performance, responsive React application built with Vite and Tailwind CSS.
Designed for precision 1:1 image cropping with advanced manipulation tools
including zooming, panning, and automatic fitting.

Tech Stack:
- Framework: React 18 (Vite)
- Styling: Tailwind CSS (Modern UI/UX)
- Icons: lucide-react (Standardized set)
- Image Engine: react-cropper (Cropper.js wrapper)

Project Architecture:
---------------------
The codebase is structured for scalability and separation of concerns.

1. src/hooks/useImageUpload.js
   - Custom React hook managing the image lifecycle.
   - Handles asynchronous file reading (FileReader API).
   - Manages error states and loading flags.

2. src/components/SquareCropper.jsx (Updated)
   - Specialized 1:1 cropping component.
   - Logic: ViewMode 1 (crop box bounded), 1:1 Aspect Ratio.
   - Features: 
     - Zoom In/Out controls.
     - Mode Toggle: Switch between 'Crop' and 'Pan' (Move) modes.
     - Fit to Width: Automatically scales and centers image to match width.
     - Fit to Height: Automatically scales and centers image to match height.
     - Reset View: Returns image to original transform without re-uploading.

3. src/utils/fileHelpers.js
   - Pure JS utilities for file handling.
   - Promisified image readers and programmatic download triggers.

4. src/App.jsx
   - Main application container.
   - Implements a modern "SaaS-style" dashboard UI.
   - Responsive layout with "Live Preview" and deployment-ready states.
   - NEW: Configurable Target Resolution up to 5000px.
   - NEW: Intelligent Quality/Compression engine targeting user-defined file sizes.
   - NEW: Output format selection (JPEG with compression or Lossless PNG).

Testing:
--------
- Framework: Vitest + React Testing Library.
- Command: 'npm run test' to run all unit and integration tests.
- Setup: jsdom environment with custom DOM matchers.

Deployment & Production:
------------------------
- Build: 'npm run build' (Generates optimized /dist).
- Routing: Configured via 'vercel.json' and '_redirects' for SPA support.
- Preview: 'npm run preview' to test the production build locally.

Key Design Decisions:
---------------------
- Functional Refactoring: Moved from a generic wrapper to a feature-rich 
  SquareCropper component.
- UX Precision: Integrated automatic centering logic during 'Fit' operations 
  using Cropper.js coordinate calculations.
- Clean Icons: Used standardized Lucide icons to ensure runtime stability.
- Performance: Minimized re-renders by decoupling UI components from 
  heavy image processing logic.
