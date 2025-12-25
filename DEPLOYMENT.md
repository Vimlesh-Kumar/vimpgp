# Deployment Guide for VimPGP

## Quick Deploy to Vercel (Recommended - FREE)

### Option 1: One-Click Deploy
Click this button to deploy instantly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Vimlesh-Kumar/vimpgp)

### Option 2: Manual Deploy via Vercel Dashboard

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose your `vimpgp` repository

3. **Configure Build Settings** (Auto-detected)
   - Framework Preset: **Nuxt.js**
   - Build Command: `npm run build`
   - Output Directory: `.output/public`
   - Install Command: `npm install`
   - Node Version: **20.x** (specified in .nvmrc)

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at `https://your-project.vercel.app`

### Option 3: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project directory)
vercel

# Deploy to production
vercel --prod
```

---

## Alternative Free Hosting Options

### Netlify

1. **Via Dashboard**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select `vimpgp`
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.output/public`
     - Node version: 20 (set in Environment variables)
   - Click "Deploy"

2. **Via CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

### Cloudflare Pages

1. **Via Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to "Workers & Pages"
   - Click "Create application" → "Pages"
   - Connect to GitHub and select `vimpgp`
   - Build settings:
     - Framework preset: **Nuxt.js**
     - Build command: `npm run build`
     - Build output directory: `.output/public`
     - Environment variable: `NODE_VERSION = 20`
   - Click "Save and Deploy"

### Render

1. Go to [render.com](https://render.com)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Settings:
   - Build Command: `npm run build`
   - Publish Directory: `.output/public`
   - Environment: Node 20
5. Click "Create Static Site"

---

## Environment Variables (Optional)

Currently, VimPGP doesn't require any environment variables as it's a fully client-side application. All operations happen in the browser.

---

## Custom Domain Setup

### Vercel
1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Netlify
1. Go to "Domain settings"
2. Click "Add custom domain"
3. Follow DNS configuration steps

---

## Important Notes

- **Node Version**: Use Node 20.x (specified in `.nvmrc`)
- **Build Time**: First build takes 2-3 minutes
- **Client-Side Only**: No server-side environment variables needed
- **Storage**: All data stored in browser localStorage
- **HTTPS**: All platforms provide free SSL certificates

---

## Troubleshooting

### Build Fails
- Ensure Node version is 20.x
- Check build logs for specific errors
- Try clearing build cache

### App Not Loading
- Check browser console for errors
- Ensure HTTPS is enabled
- Clear browser cache

### Keys Not Persisting
- Check browser localStorage is enabled
- Ensure cookies/storage not blocked

---

## Post-Deployment

After successful deployment:

1. ✅ Test key generation
2. ✅ Test key import/export
3. ✅ Verify localStorage persistence
4. ✅ Share your app URL!

Your VimPGP instance will be live at your deployment URL! 🎉
