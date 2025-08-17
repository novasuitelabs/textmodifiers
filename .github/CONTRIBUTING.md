# Contributing to Text Modifier

Thank you for your interest in contributing to Text Modifier! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs

1. **Check existing issues** - Search the [issues page](https://github.com/novasuitelabs/textmodifiers/issues) to see if the bug has already been reported
2. **Create a new issue** - Use the bug report template and provide:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/OS information
   - Screenshots if applicable

### Suggesting Features

1. **Check existing issues** - Search for similar feature requests
2. **Create a new issue** - Use the feature request template and provide:
   - Clear description of the feature
   - Use cases and benefits
   - Mockups or examples if applicable

### Code Contributions

#### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Git

#### Setup

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/novasuitelabs/textmodifiers.git
   cd textmodifiers
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development

1. **Start the development server**:
   ```bash
   npm run dev
   ```
2. **Make your changes** - Follow the coding standards below
3. **Test your changes** - Ensure everything works as expected
4. **Run linting**:
   ```bash
   npm run lint
   ```

#### Submitting Changes

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new text transformation"
   ```
2. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
3. **Create a Pull Request** - Use the PR template and provide:
   - Clear description of changes
   - Screenshots if UI changes
   - Link to related issues

## 📋 Coding Standards

### Code Style

- Use **TypeScript** for all new code
- Follow **ESLint** rules (run `npm run lint` to check)
- Use **Prettier** for code formatting
- Use **Material UI 3** components and patterns
- Follow **React best practices**

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

feat: add new text transformation
fix: resolve copy to clipboard issue
docs: update README with new features
style: improve button styling
refactor: simplify text processing logic
test: add unit tests for transformations
```

### File Structure

```
src/
├── components/          # Reusable components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── App.tsx             # Main app component
```

### Adding New Transformations

1. **Add the transformation function** to the `textTransformers` object in `src/App.tsx`:
   ```typescript
   const textTransformers = {
     // ... existing transformers
     yourNewTransform: (text: string) => {
       // Your transformation logic
       return transformedText;
     },
   };
   ```

2. **Add the button** to the `transformationButtons` array:
   ```typescript
   const transformationButtons = [
     // ... existing buttons
     { key: 'yourNewTransform', label: 'Your Transform Label' },
   ];
   ```

3. **Add tests** (if applicable)
4. **Update documentation** in README.md

## 🧪 Testing

### Manual Testing

- Test all text transformations with various inputs
- Test file upload/download functionality
- Test copy to clipboard feature
- Test responsive design on different screen sizes
- Test dark/light mode switching

### Automated Testing

Run the test suite:
```bash
npm test
```

## 📝 Documentation

### Code Documentation

- Add JSDoc comments for complex functions
- Include TypeScript types for all functions
- Document component props and usage

### User Documentation

- Update README.md for new features
- Add screenshots for UI changes
- Update usage examples

## 🚀 Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):
- **MAJOR** - Breaking changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Version is bumped in package.json
- [ ] Release notes are written

## 🏷️ Labels

We use the following labels for issues and PRs:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested
- `wontfix` - This will not be worked on

## 📞 Getting Help

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and general discussion
- **Pull Requests** - For code contributions

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- GitHub contributors page
- Release notes

Thank you for contributing to Text Modifier! 🎉
