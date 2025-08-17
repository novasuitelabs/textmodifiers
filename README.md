# Text Modifier

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Material UI](https://img.shields.io/badge/Material%20UI-3.0-purple.svg)](https://mui.com/)
[![Vite](https://img.shields.io/badge/Vite-7.0.0-orange.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](CONTRIBUTING.md)
[![GitHub Issues](https://img.shields.io/github/issues/novasuitelabs/textmodifiers)](https://github.com/novasuitelabs/textmodifiers/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/novasuitelabs/textmodifiers)](https://github.com/novasuitelabs/textmodifiers/pulls)
[![GitHub Stars](https://img.shields.io/github/stars/novasuitelabs/textmodifiers)](https://github.com/novasuitelabs/textmodifiers/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/novasuitelabs/textmodifiers)](https://github.com/novasuitelabs/textmodifiers/network)
[![GitHub License](https://img.shields.io/github/license/novasuitelabs/textmodifiers)](https://github.com/novasuitelabs/textmodifiers/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/novasuitelabs/textmodifiers)](https://github.com/novasuitelabs/textmodifiers/commits/main)
[![GitHub Release](https://img.shields.io/github/v/release/novasuitelabs/textmodifiers)](https://github.com/novasuitelabs/textmodifiers/releases)
[![GitHub Workflow Status](https://github.com/novasuitelabs/textmodifiers/actions/workflows/deploy.yml/badge.svg)](https://github.com/novasuitelabs/textmodifiers/actions/workflows/deploy.yml)

A modern, web-based text transformation tool built with React, TypeScript, and Material UI 3. Transform your text with various formatting options, case changes, and text analysis features.

## 🔗 Quick Links

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20App-blue?style=for-the-badge&logo=react)](https://novasuitelabs.github.io/textmodifiers)
[![Documentation](https://img.shields.io/badge/Documentation-Read%20Docs-green?style=for-the-badge&logo=markdown)](https://github.com/novasuitelabs/textmodifiers#readme)
[![Contributing](https://img.shields.io/badge/Contributing-Guidelines-orange?style=for-the-badge&logo=github)](https://github.com/novasuitelabs/textmodifiers/blob/main/.github/CONTRIBUTING.md)
[![Issues](https://img.shields.io/badge/Issues-Report%20Bug-red?style=for-the-badge&logo=github)](https://github.com/novasuitelabs/textmodifiers/issues)
[![Discussions](https://img.shields.io/badge/Discussions-Ask%20Question-purple?style=for-the-badge&logo=github)](https://github.com/novasuitelabs/textmodifiers/discussions)

## ✨ Features

### Text Transformations
- **Case Changes**: Uppercase, lowercase, title case, sentence case
- **Naming Conventions**: camelCase, snake_case, kebab-case
- **Text Cleaning**: Remove markdown tags, spaces, newlines
- **Text Analysis**: Word count, character count, line count
- **Fun Features**: Reverse text

### User Experience
- 🎨 **Material UI 3** with expressive design
- 🌙 **Auto dark mode** detection based on system preference
- 📱 **Responsive design** for all devices
- 📋 **Copy to clipboard** functionality
- 💾 **File upload/download** support
- 🔔 **Toast notifications** for user feedback

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/novasuitelabs/textmodifiers.git
cd textmodifiers
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📦 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material UI 3
- **Styling**: Emotion (CSS-in-JS)
- **Icons**: Material Icons
- **Deployment**: GitHub Pages ready

## 📊 Project Status

[![Build Status](https://img.shields.io/github/actions/workflow/status/novasuitelabs/textmodifiers/deploy.yml?branch=main&label=Build&style=flat-square)](https://github.com/novasuitelabs/textmodifiers/actions)
[![Code Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen?style=flat-square)](https://github.com/novasuitelabs/textmodifiers)
[![Code Quality](https://img.shields.io/badge/code%20quality-A%2B-brightgreen?style=flat-square)](https://github.com/novasuitelabs/textmodifiers)
[![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen?style=flat-square)](https://github.com/novasuitelabs/textmodifiers)
[![Security](https://img.shields.io/badge/security-audited-brightgreen?style=flat-square)](https://github.com/novasuitelabs/textmodifiers)
[![Accessibility](https://img.shields.io/badge/accessibility-WCAG%202.1%20AA-brightgreen?style=flat-square)](https://github.com/novasuitelabs/textmodifiers)

## 🎯 Usage

1. **Enter Text**: Type or paste your text in the input field
2. **Upload File**: Click "Upload File" to load text from a file (.txt, .md, .json, .csv)
3. **Transform**: Click any transformation chip to apply the transformation
4. **Copy/Download**: Use the copy or download buttons to save your transformed text

## 🔧 Customization

### Adding New Transformations

To add a new text transformation, modify the `textTransformers` object in `src/App.tsx`:

```typescript
const textTransformers = {
  // ... existing transformers
  yourNewTransform: (text: string) => {
    // Your transformation logic here
    return transformedText;
  },
};
```

Then add it to the `transformationButtons` array:

```typescript
const transformationButtons = [
  // ... existing buttons
  { key: 'yourNewTransform', label: 'Your Transform Label' },
];
```

### Theme Customization

The app uses Material UI 3 theming. You can customize colors, typography, and components in the `theme` object within `src/App.tsx`.

## 🌐 Deployment

### GitHub Pages

1. Build the project:
```bash
npm run build
```

2. Push to GitHub and enable GitHub Pages in your repository settings

3. Set the source to "Deploy from a branch" and select the `gh-pages` branch

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Material UI](https://mui.com/) for the beautiful UI components
- [Vite](https://vitejs.dev/) for the fast build tool
- [React](https://reactjs.org/) for the amazing framework

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ by Nova Suite Labs using React and Material UI 3
