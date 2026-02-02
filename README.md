# IMS Audit Management System

A comprehensive web-based audit management platform for Integrated Management Systems (ISO 9001, ISO 14001, ISO 45001).

## Overview

The IMS Audit Management System is a professional-grade application designed to streamline and manage internal audits for organizations following integrated quality, environmental, and occupational health & safety management systems. 

### Key Features

- **Risk Assessment & Management**: Identify, track, and manage audit risks with a comprehensive risk register
- **Audit Planning**: Create and maintain detailed audit plans with scope, criteria, and resources
- **Audit Findings**: Document audit findings including non-conformities, observations, and opportunities for improvement
- **Performance Metrics Dashboard**: Track KPIs and performance indicators across ISO standards
- **Visual Auditing Workflows**: Understand audit processes through interactive Mermaid diagrams
- **Roadmap Management**: Plan and track corrective actions and improvement initiatives
- **Data Export**: Export audit data in JSON format for reporting and analysis

## Technology Stack

- **Frontend Framework**: React 19.2.0 with Vite
- **Visualization**: 
  - Chart.js for data visualization and KPI dashboards
  - Mermaid for process flow diagrams
- **Build Tool**: Vite 7.2.4 (ESM-first, optimized for fast development)
- **Code Quality**: ESLint for consistent code standards

## Project Structure

```
ims-audit/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── AuditPlan.jsx        # Audit planning and scheduling
│   │   ├── Findings.jsx         # Audit findings documentation
│   │   ├── KpiDashboard.jsx     # Performance metrics visualization
│   │   ├── MermaidDiagram.jsx   # Process flow diagrams
│   │   ├── RiskRegister.jsx     # Risk assessment and tracking
│   │   ├── Roadmap.jsx          # Action tracking and improvements
│   │   ├── ExportJson.jsx       # Data export functionality
│   │   └── Tabs.jsx             # Tab navigation component
│   ├── data/
│   │   └── sampleData.js        # Sample data for demonstration
│   ├── assets/                  # Images and static assets
│   ├── styles/                  # CSS stylesheets
│   ├── App.jsx                  # Main application component
│   └── main.jsx                 # Application entry point
├── public/                      # Static files
├── index.html                   # HTML entry point
├── vite.config.js               # Vite configuration
├── package.json                 # Project dependencies
└── eslint.config.js             # ESLint configuration

```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Navigate to the project directory**:
   ```bash
   cd ims-audit
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. The application will be available at `http://localhost:5173`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with hot module replacement (HMR) |
| `npm run build` | Build the project for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check code quality |

## Features & Modules

### 1. Overview Tab
- Visual representation of PDCA (Plan-Do-Check-Act) cycle
- IMS Integration diagram showing relationship between ISO 9001, 14001, and 45001
- Audit flow process from planning to continuous improvement

### 2. Risk Assessment
- Risk register with probability and impact assessment
- Risk matrix for visual evaluation
- Risk mitigation tracking

### 3. Audit Planning
- Comprehensive audit schedules
- Resource allocation
- Audit scope and criteria definition

### 4. Findings Documentation
- Classification of findings (Non-Conformities, Observations, Opportunities for Improvement)
- Root cause analysis
- Corrective action tracking

### 5. KPI Dashboard
- Real-time performance metrics
- Charts and visualizations for trend analysis
- Multi-standard compliance monitoring

### 6. Roadmap Management
- Strategic improvement initiatives
- Timeline and milestone tracking
- Progress monitoring

### 7. Data Export
- Export audit data to JSON format
- Prepare data for reporting and analysis
- Integration with external tools

## Design Principles

- **User-Centric**: Intuitive interface for audit professionals
- **Standards-Compliant**: Aligned with ISO 9001:2015, ISO 14001:2015, ISO 45001:2018
- **Performance-Optimized**: Fast load times and smooth interactions
- **Maintainable**: Clean, well-organized code structure

## Standards Covered

- **ISO 9001:2015** - Quality Management System
- **ISO 14001:2015** - Environmental Management System  
- **ISO 45001:2018** - Occupational Health & Safety Management System

## Development Workflow

1. Components are modular and reusable
2. Sample data is stored in `src/data/sampleData.js` for demonstration
3. State management uses React Hooks (useState, useEffect, useMemo)
4. Local storage integration for data persistence during sessions
5. Responsive design principles for accessibility

## Browser Compatibility

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

When contributing to this project:
1. Follow the existing code structure and naming conventions
2. Run `npm run lint` before committing
3. Ensure all features are documented in the components
4. Test across multiple browsers

## Future Enhancements

- Multi-user collaboration features
- Database integration for persistent storage
- Advanced reporting and analytics
- Mobile application version
- Integration with external audit tools
- User authentication and role-based access control

## Support & Documentation

For detailed setup instructions, see [SETUP.md](./SETUP.md)

For presentation guidelines, see [PRESENTATION.md](./PRESENTATION.md)

---

**Last Updated**: February 2026  
**Version**: 1.0.0
