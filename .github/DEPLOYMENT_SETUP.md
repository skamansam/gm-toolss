# GitHub Pages Deployment Setup

## ✅ What's Been Configured

Your D&D GM Toolkit is now ready for automatic deployment to GitHub Pages!

### Files Created/Modified

1. **`.github/workflows/deploy.yml`** - GitHub Actions workflow for automatic deployment
2. **`svelte.config.js`** - Updated to use static adapter with base path support
3. **`src/routes/+layout.ts`** - Enables prerendering and disables SSR
4. **`static/.nojekyll`** - Prevents GitHub from ignoring `_app` directory
5. **`DEPLOYMENT.md`** - Complete deployment documentation
6. **`README.md`** - Updated with deployment information

### Dependencies Added

- `@sveltejs/adapter-static` - For static site generation

## 🚀 Next Steps

### 1. Enable GitHub Pages

Go to your repository settings on GitHub:

1. Navigate to **Settings** → **Pages**
2. Under "Build and deployment":
   - **Source**: Select "GitHub Actions" (not "Deploy from a branch")
3. Save

### 2. Push Your Changes

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

### 3. Monitor Deployment

1. Go to the **Actions** tab in your GitHub repository
2. Watch the "Deploy to GitHub Pages" workflow
3. Once complete (green checkmark), your site is live!

### 4. Access Your Site

Your site will be available at:
```
https://skamansam.github.io/gm-toolss/
```

## 🔧 How It Works

### Automatic Deployment

Every time you push to `main`:
1. GitHub Actions triggers the workflow
2. Installs dependencies with pnpm
3. Builds the static site with proper base path
4. Deploys to GitHub Pages
5. Site is live in ~2-3 minutes

### Base Path Configuration

The workflow automatically sets `BASE_PATH=/gm-toolss` during build, ensuring:
- All links work correctly in the subdirectory
- Assets load from the correct paths
- Client-side routing functions properly

### Static Site Generation

- All pages are pre-rendered to HTML
- No server required
- Fast loading times
- Works offline after first visit (PWA-ready)

## 📝 Important Notes

### First Deployment

The first deployment may take a few extra minutes as GitHub sets up the Pages environment.

### Subsequent Deployments

After the initial setup, deployments typically complete in 2-3 minutes.

### Local Development

The base path is only applied in production builds. Local development (`pnpm run dev`) works normally without any path prefix.

### Testing Production Build Locally

```bash
# Build with production settings
pnpm run build

# Preview the build
pnpm run preview
```

Note: The preview won't include the base path, so some navigation may differ from the deployed version.

## 🐛 Troubleshooting

### "Pages is not enabled"

- Ensure you've enabled GitHub Pages in repository settings
- Source must be set to "GitHub Actions"

### "Workflow failed"

- Check the Actions tab for error details
- Ensure all files are committed and pushed
- Verify the build works locally first

### "Site shows 404"

- Wait a few minutes after deployment completes
- Clear browser cache
- Check that the URL matches your repository name

### "Assets not loading"

- Verify `.nojekyll` file exists in `static/` directory
- Check browser console for specific errors
- Ensure base path is configured correctly

## 🎉 You're All Set!

Your D&D GM Toolkit will now automatically deploy to GitHub Pages every time you push to main. No manual deployment needed!

For more details, see [DEPLOYMENT.md](../../DEPLOYMENT.md).
