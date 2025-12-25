# 🛡️ Linting Guide for VimPGP

This project uses **ESLint** with the **Nuxt ESLint Module** to ensure high code quality, consistent styling, and to catch potential bugs early.

## 🚀 Available Scripts

You can run these commands from the root of the project:

### 1. Check for Issues
Run this to see a list of any linting errors or warnings in the codebase.
```bash
npm run lint
```

### 2. Automatically Fix Issues
Run this to automatically fix most styling issues (like spacing, quotes, and tag closing) and some simple logic errors.
```bash
npm run lint:fix
```

---

## 🛠️ Configuration Details

- **Module**: [`@nuxt/eslint`](https://eslint.nuxt.com/)
- **Ruleset**: Uses the Nuxt recommended rules for Vue 3, TypeScript, and Nuxt 3.
- **Config File**: `eslint.config.mjs` (Flat Config format)

### Customizations
Some specialized libraries like `openpgp` require dynamic types. In these rare cases, you might see `eslint-disable` comments. Please use these sparingly and only when necessary for library compatibility.

## 💡 Best Practices

1. **Run before committing**: Check your code with `npm run lint` before you push changes to GitHub.
2. **VS Code Integration**: For the best experience, install the [ESLint extension for VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint). It will highlight errors as you type.
3. **Format on Save**: You can configure your editor to run the fix script automatically whenever you save a file.

---

## 📁 Key Files
- `package.json`: Contains the scripts.
- `eslint.config.mjs`: The core configuration.
- `.nuxt/eslint.config.mjs`: Auto-generated configuration by Nuxt (do not edit).
