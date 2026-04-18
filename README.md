# VimPGP 🔐

VimPGP is a premium, **100% client-side** OpenPGP identity management suite. Built for developers and privacy advocates who demand absolute security with a modern, glassmorphic experience.

[![Security - Client-Side](https://img.shields.io/badge/Security-Client--Side-00E5FF?style=for-the-badge&logo=shield-lock)](https://github.com/Vimlesh-Kumar/vimpgp)
[![Nuxt 3](https://img.shields.io/badge/Nuxt-4.2.2-00DC82?style=for-the-badge&logo=nuxtdotjs)](https://nuxt.com/)
[![License - MIT](https://img.shields.io/badge/License-MIT-white?style=for-the-badge)](./LICENSE)

---

## ✨ Why VimPGP?

Traditional PGP tools are either complex command-line utilities or centralized web services that ask you to trust their servers. **VimPGP** changes that.

- 🛡️ **Zero-Trust**: All cryptographic operations happen in your browser's memory. No keys, passphrases, or plain-text ever touch a server.
- ⚡ **ECC & RSA Support**: Modern Elliptic Curve Cryptography (Curve25519) and high-bit RSA (up to 8192-bit) supported.
- 🎨 **Premium UX**: A performance-optimized, glassmorphic interface that makes security feel effortless.
- 🔌 **Offline Capabilities**: Once loaded, use it in isolation. All logic is local.
- 📦 **Subkey Management**: Advanced handling for signing, encryption, and authentication identities.

---

## 🚀 Quick Deployment (Production)

VimPGP is optimized for serverless hosting. Choose your preferred platform:

### ⚡ Option A: Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Vimlesh-Kumar/vimpgp)
1. Fork the repo.
2. Connect to Vercel.
3. Done. All configurations are pre-tuned in `vercel.json`.

### 🌍 Alternative Platforms
| Platform | Build Command | Output Directory |
| :--- | :--- | :--- |
| **Netlify** | `npm run build` | `.output/public` |
| **Cloudflare Pages** | `npm run build` | `.output/public` |

---

## 🛠️ Internal Development

### 1. Setup
```bash
# Clone and install
git clone https://github.com/Vimlesh-Kumar/vimpgp.git
cd vimpgp
npm install

# Start Dev Server
npm run dev
```

### 2. Code Quality (Linting)
We maintain a strict quality standard. Before pushing, ensure your code is clean:
```bash
npm run lint      # Check for errors
npm run lint:fix  # Automatically fix formatting
```

---

## 🔒 Security Architecture

VimPGP leverages the battle-tested [OpenPGP.js](https://openpgpjs.org/) library.
- **Storage**: Keys are persisted in `localStorage`. They are never synced to any cloud service.
- **Verification**: Digital signatures can be verified against imported public keys or pasted armored blocks.
- **Integrity**: We recommend users to backup their private keys externally, as clearing browser Cache/Data will erase your local keyring.

---

## 🤝 Contributing

Contributions that improve security or UI efficiency are welcome.
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Vimlesh Kumar**
- Portfolio: [vimlesh.dev](https://vimlesh.dev)
- GitHub: [@Vimlesh-Kumar](https://github.com/Vimlesh-Kumar)

---

**⚠️ Security Disclaimer**: This software is provided "as is" without warranty of any kind. While built with robust cryptographic standards, users are responsible for their own key management and security practices.
