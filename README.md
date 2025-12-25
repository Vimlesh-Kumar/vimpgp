# VimPGP 🔐

A modern, client-side PGP key management application built with Nuxt 3 and Vuetify. Generate, manage, and use PGP keys entirely in your browser - your keys never leave your device!

![VimPGP](https://img.shields.io/badge/Security-Client--Side-green)
![Nuxt](https://img.shields.io/badge/Nuxt-4.2.2-00DC82)
![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D)

## ✨ Features

- 🔒 **100% Client-Side Encryption** - All operations happen in your browser
- 🎨 **Modern UI** - Beautiful glassmorphism design with dark theme
- 🔑 **Full Key Management** - Generate, import, export, and delete PGP keys
- 📝 **Multiple Algorithms** - Support for RSA (1024-8192 bits) and ECC (Curve25519, P-256, P-384, P-521)
- ⏰ **Flexible Expiry** - Set key expiration from 30 days to 10 years, or never
- 🔐 **Subkey Support** - Add signing, encryption, and authentication subkeys
- 💾 **Local Storage** - Keys stored securely in browser localStorage
- 📤 **Export/Import** - Download and backup your keys easily

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: Node 24+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Vimlesh-Kumar/vimpgp.git
cd vimpgp

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the app!

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 🌐 Deploy to Vercel (Free)

The easiest way to deploy VimPGP is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Vimlesh-Kumar/vimpgp)

### Manual Deployment Steps:

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your `vimpgp` repository
   - Click "Deploy"

3. **Deploy via CLI**
   ```bash
   vercel
   ```

## 🎯 Alternative Free Hosting Options

### Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Build command: `npm run build`
4. Publish directory: `.output/public`

### Cloudflare Pages
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub repository
3. Framework preset: Nuxt.js
4. Build command: `npm run build`

### GitHub Pages (Static)
```bash
npm run generate
# Deploy the .output/public directory
```

## 🛠️ Technology Stack

- **Framework**: [Nuxt 4](https://nuxt.com/)
- **UI Library**: [Vuetify 3](https://vuetifyjs.com/)
- **Cryptography**: [OpenPGP.js](https://openpgpjs.org/)
- **Icons**: [Material Design Icons](https://materialdesignicons.com/)
- **Styling**: Custom CSS with Glassmorphism

## 📖 Usage

### Generate a New Key Pair

1. Click "Generate Key Pair" or navigate to the Generate page
2. Enter your name and email
3. Choose a strong passphrase (optional but recommended)
4. Select algorithm (ECC recommended for modern security)
5. Choose key size and expiration
6. Click "Generate Identity"

### Manage Keys

- **View Keys**: All keys are displayed on the dashboard
- **Export Keys**: Click "Manage" → Export Public/Private keys
- **Add Subkeys**: Manage page → Add Subkey
- **Delete Keys**: Use the menu (⋮) → Delete Key

## 🔒 Security Notes

- All cryptographic operations happen client-side
- Private keys are stored in browser localStorage
- **Always backup your private keys!**
- Use strong passphrases to protect your keys
- Never share your private key

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

**Vimlesh Kumar**
- GitHub: [@Vimlesh-Kumar](https://github.com/Vimlesh-Kumar)

## 🙏 Acknowledgments

- Built with [OpenPGP.js](https://openpgpjs.org/)
- UI powered by [Vuetify](https://vuetifyjs.com/)
- Framework: [Nuxt](https://nuxt.com/)

---

**⚠️ Disclaimer**: This is a client-side application for educational and personal use. Always follow best practices for key management and security.
