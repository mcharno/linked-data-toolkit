# Publishing Guide

This document provides step-by-step instructions for publishing the Linked Data Toolkit to npm.

## Prerequisites

### 1. npm Account
- Create an account at [npmjs.com](https://www.npmjs.com/signup)
- Verify your email address
- Enable two-factor authentication (highly recommended)

### 2. Organization/Scope (if using @charno scope)
- The package name is `@charno/linked-data-toolkit` (scoped package)
- You need access to the `@charno` organization on npm
- Or change the package name to an unscoped version in `package.json`

## Technical Checklist

### Before Publishing

- [ ] All tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] Package contents verified (`npm pack` and inspect)
- [ ] Version number updated if needed (`npm version [patch|minor|major]`)
- [ ] CHANGELOG.md updated
- [ ] All changes committed to git

### Package Verification

```bash
# 1. Clean install dependencies
npm ci

# 2. Run all checks
npm run lint
npm run type-check
npm test

# 3. Build the package
npm run build

# 4. Preview package contents
npm pack
tar -tzf charno-linked-data-toolkit-*.tgz

# 5. Test the package locally
npm install -g ./charno-linked-data-toolkit-*.tgz
linked-data-toolkit --help
npm uninstall -g @charno/linked-data-toolkit

# 6. Clean up
rm charno-linked-data-toolkit-*.tgz
```

## Legal Checklist

### License Compliance

✅ **This package (MIT License):**
- Permissive license allowing commercial and private use
- Compatible with npm ecosystem
- Properly attributed in LICENSE file

✅ **Dependencies:**
- `axios` (MIT) - Compatible ✓
- `commander` (MIT) - Compatible ✓

✅ **No Legal Issues:**
- Package name doesn't infringe trademarks
- Code is original or properly licensed
- Data sources are publicly accessible APIs
- No proprietary code included

### Data Provider Attribution

The package queries public linked data endpoints. Ensure users cite:
- Individual data providers as per their requirements
- See ARCHAEOLOGICAL.md for citation guidelines

## Publishing Steps

### First-Time Setup

```bash
# Login to npm
npm login

# Verify login
npm whoami
```

### For Scoped Packages (@charno/...)

```bash
# If publishing a scoped package for the first time,
# you need access to the @charno organization
# OR publish as public (scoped packages are private by default)
npm publish --access public
```

### Standard Publishing

```bash
# 1. Ensure you're on the correct branch
git status

# 2. Update version (if needed)
npm version patch  # or minor, or major
# This automatically creates a git tag

# 3. Publish to npm
npm publish --access public

# 4. Push git changes and tags
git push && git push --tags
```

### Publishing Checklist

- [ ] Logged in to npm (`npm whoami`)
- [ ] On correct branch (main/master or release branch)
- [ ] Version bumped if needed
- [ ] Run `npm publish --dry-run` first to preview
- [ ] Run `npm publish --access public` to publish
- [ ] Push git tags (`git push --tags`)
- [ ] Verify package on npmjs.com
- [ ] Test installation: `npx @charno/linked-data-toolkit@latest --version`

## Post-Publishing

### Verification

```bash
# Install from npm in a test directory
mkdir test-install && cd test-install
npm init -y
npm install @charno/linked-data-toolkit

# Test library usage
node -e "const {DBPediaClient} = require('@charno/linked-data-toolkit'); console.log('Library loaded successfully');"

# Test CLI
npx @charno/linked-data-toolkit --help

# Clean up
cd .. && rm -rf test-install
```

### Update Documentation

- [ ] Add npm badge to README: `[![npm version](https://badge.fury.io/js/@charno%2Flinked-data-toolkit.svg)](https://www.npmjs.com/package/@charno/linked-data-toolkit)`
- [ ] Update installation instructions with actual package name
- [ ] Announce release (if appropriate)

## Version Management

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (3.0.0): Breaking changes
- **MINOR** (2.1.0): New features, backwards compatible
- **PATCH** (2.0.1): Bug fixes, backwards compatible

```bash
# Patch release (2.0.0 -> 2.0.1)
npm version patch

# Minor release (2.0.0 -> 2.1.0)
npm version minor

# Major release (2.0.0 -> 3.0.0)
npm version major
```

## Troubleshooting

### Package Name Already Taken

If `@charno/linked-data-toolkit` is taken or you don't have access:

1. **Option A:** Use unscoped name (if available)
   ```json
   {
     "name": "linked-data-toolkit-arch",
     ...
   }
   ```

2. **Option B:** Use your own scope
   ```json
   {
     "name": "@yourusername/linked-data-toolkit",
     ...
   }
   ```

3. **Option C:** Request access to @charno organization

### 403 Forbidden Error

- Verify you're logged in: `npm whoami`
- Check organization access
- Ensure using `--access public` for scoped packages
- Verify 2FA code if enabled

### Build Failures

```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Module Not Found After Installing

Check that:
- `"main"`, `"module"`, and `"types"` point to existing files in `dist/`
- `"files"` array includes `"dist"`
- Build created all necessary files

## Support

For issues:
- GitHub Issues: https://github.com/mcharno/linked-data-toolkit/issues
- npm package page: https://www.npmjs.com/package/@charno/linked-data-toolkit
- Email: michael@charno.net

## Security

To report security vulnerabilities:
- Email: michael@charno.net (private disclosure)
- Do not open public issues for security problems
