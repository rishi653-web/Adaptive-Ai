# Adaptive AI - Loan Eligibility Predictor

A modern, intelligent loan eligibility assessment platform built with React, TypeScript, and Vite. This application helps users determine their eligibility for various government schemes and loan programs through an AI-powered analysis.

## Features

- **AI-Powered Eligibility Assessment**: Advanced algorithms analyze user data to predict loan eligibility
- **Multi-Module Analysis**: Comprehensive evaluation across multiple parameters
- **Real-time Scheme Detection**: Automatically identifies applicable government schemes
- **Interactive Dashboard**: Beautiful, responsive UI with smooth animations
- **Multi-language Support**: Accessible interface for diverse users
- **Progressive Web App**: Fast, reliable, and installable experience

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite with TypeScript
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rishi653-web/Adaptive-Ai.git
cd Adaptive-Ai
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

## Deployment

This project is configured for deployment on GitHub Pages. The built files are in the `dist` folder.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Contact

For questions or support, please open an issue on GitHub.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
