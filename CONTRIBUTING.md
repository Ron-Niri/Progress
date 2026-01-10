# Contributing to Progress App

Thank you for your interest in contributing to Progress! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach
   - Any relevant mockups or examples

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Write clear commit messages
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   npm run dev  # Test locally
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear description
   - Reference any related issues
   - Include screenshots for UI changes

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Progress.git
cd Progress

# Install dependencies
npm run install:all

# Set up environment variables
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI

# Start development servers
npm run dev
```

## Code Style Guidelines

### JavaScript/React
- Use ES6+ features
- Functional components with hooks
- Meaningful variable names
- Comments for complex logic
- Keep components small and focused

### CSS/Tailwind
- Use Tailwind utility classes
- Follow the design system in STYLE.md
- Maintain responsive design
- Use semantic class names

### Git Commit Messages
Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example: `feat: add habit reminder notifications`

## Project Structure

```
Progress/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── utils/       # Utility functions
├── server/              # Express backend
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── middleware/      # Custom middleware
└── docs/                # Documentation
```

## Testing

- Write unit tests for utilities
- Test API endpoints
- Test React components
- Ensure responsive design works

## Documentation

- Update README.md if needed
- Add JSDoc comments for functions
- Update ROADMAP.md for new features
- Keep STYLE.md current

## Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited

## Getting Help

- Check existing documentation
- Search closed issues
- Ask in discussions
- Reach out to maintainers

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the app (for significant contributions)

Thank you for contributing to Progress! 🚀
