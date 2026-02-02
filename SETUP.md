# IMS Audit Management System - Setup Guide

Complete step-by-step guide to set up and run the IMS Audit Management System project.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation Steps](#installation-steps)
3. [Running the Application](#running-the-application)
4. [Building for Production](#building-for-production)
5. [Troubleshooting](#troubleshooting)
6. [Project Configuration](#project-configuration)

---

## System Requirements

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js**: Version 16.x or higher ([Download](https://nodejs.org/))
  - Check version: `node --version`
- **npm**: Version 7.x or higher (comes with Node.js)
  - Check version: `npm --version`

### Optional
- **Git**: For version control ([Download](https://git-scm.com/))
- **VS Code**: Recommended code editor ([Download](https://code.visualstudio.com/))

---

## Installation Steps

### Step 1: Navigate to Project Directory
```bash
cd c:\Shashwata\ Chowdhury\IMS\ project\ims-audit
```

### Step 2: Install Dependencies
```bash
npm install
```

This command will:
- Install all packages listed in `package.json`
- Create a `node_modules` folder
- Generate a `package-lock.json` file for dependency locking

**Time required**: 2-5 minutes depending on internet speed

### Step 3: Verify Installation
Check if all dependencies are correctly installed:
```bash
npm list
```

You should see a tree structure of all installed packages without errors.

---

## Running the Application

### Development Mode (with Hot Module Replacement)

```bash
npm run dev
```

**Output**:
```
  VITE v7.2.4  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

**Features**:
- Fast refresh on code changes
- Debug console for JavaScript errors
- Optimized development experience

**Access the application**: Open `http://localhost:5173/` in your web browser

### Stopping the Server
Press `Ctrl + C` in the terminal

---

## Building for Production

### Create Optimized Production Build

```bash
npm run build
```

This will:
- Minify and optimize all code
- Create a `dist/` folder with production-ready files
- Reduce bundle size significantly

### Preview Production Build Locally

```bash
npm run preview
```

This launches a preview server to test the production build before deployment.

### Expected Output Structure (dist/):
```
dist/
├── index.html           # Main HTML file
├── assets/
│   ├── index-*.js       # Bundled JavaScript
│   └── index-*.css      # Bundled CSS
└── [other assets]       # Images and static files
```

---

## Troubleshooting

### Issue: "npm: The term 'npm' is not recognized"
**Solution**: 
- Node.js is not installed or not added to PATH
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installation

### Issue: "Port 5173 is already in use"
**Solution**:
```bash
# Option 1: Stop the process using the port
npm run dev -- --port 3000

# Option 2: Kill the process (Windows PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force
```

### Issue: Module not found errors
**Solution**:
```bash
# Clear node_modules and reinstall
rm -r node_modules
rm package-lock.json
npm install
```

### Issue: ESLint errors when running `npm run lint`
**Solution**:
```bash
# View all linting errors
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Issue: Application loads but shows blank page
**Solutions**:
- Check browser console (F12) for JavaScript errors
- Clear browser cache: `Ctrl + Shift + Delete`
- Verify you're accessing `http://localhost:5173/`
- Restart the dev server: `npm run dev`

### Issue: Changes not reflecting in browser
**Solution**:
- Hard refresh the page: `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac)
- Check that the dev server is running
- Verify file is saved in your editor

---

## Project Configuration

### Vite Configuration (`vite.config.js`)
```javascript
// Development server settings
// HMR (Hot Module Replacement) enabled
// React plugin configured for fast refresh
```

### ESLint Configuration (`eslint.config.js`)
```javascript
// Code quality standards
// React-specific rules
// Enforces consistent coding style
```

### Package Dependencies Overview

**Production Dependencies**:
- `react@^19.2.0` - UI library
- `react-dom@^19.2.0` - React DOM rendering
- `chart.js@^4.5.1` - Charting library
- `react-chartjs-2@^5.3.1` - React wrapper for Chart.js
- `mermaid@^11.12.2` - Diagram generation

**Development Dependencies**:
- `vite@^7.2.4` - Build tool
- `@vitejs/plugin-react@^5.1.1` - Vite React plugin
- `eslint@^9.39.1` - Code linter
- TypeScript types for React

---

## Development Workflow

### 1. Start Development Server
```bash
npm run dev
```

### 2. Open in Browser
Navigate to `http://localhost:5173/`

### 3. Make Changes
Edit files in the `src/` directory. Changes will auto-reload in the browser.

### 4. Check Code Quality
```bash
npm run lint
```

### 5. Build for Production
```bash
npm run build
```

---

## Directory Structure

```
ims-audit/
├── src/
│   ├── components/      # React components
│   ├── data/           # Sample data
│   ├── assets/         # Images and static assets
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── *.css           # Component styles
├── public/             # Static files (served as-is)
├── dist/               # Production build (generated)
├── node_modules/       # Dependencies (generated)
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── vite.config.js      # Build configuration
├── eslint.config.js    # Linting rules
└── README.md           # Documentation
```

---

## Performance Tips

1. **Use npm ci instead of npm install in CI/CD**:
   ```bash
   npm ci
   ```
   This uses the exact versions from `package-lock.json`

2. **Monitor bundle size**:
   ```bash
   npm run build
   ```
   Check the console output for bundle size information

3. **Use production build for testing**:
   ```bash
   npm run build
   npm run preview
   ```

---

## Next Steps

1. ✅ Complete setup following this guide
2. 📖 Read [README.md](./README.md) for feature overview
3. 🎯 Review [PRESENTATION.md](./PRESENTATION.md) for teacher presentation guide
4. 💻 Start the dev server: `npm run dev`
5. 🚀 Explore the application features

---

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [Mermaid Diagram Documentation](https://mermaid.js.org/)
- [ESLint Rules](https://eslint.org/docs/latest/rules/)

---

**Version**: 1.0.0  
**Last Updated**: February 2026
