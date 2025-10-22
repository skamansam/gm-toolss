# Deployment Guide - GitHub Pages

This guide explains how to deploy the D&D GM Toolkit to GitHub Pages.

## Automatic Deployment

The repository is configured to automatically deploy to GitHub Pages whenever you push to the `main` branch.

### Setup (One-Time)

1. **Enable GitHub Pages in Repository Settings**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Build and deployment":
     - **Source**: Select "GitHub Actions"
   - Save the settings

2. **Push to Main Branch**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

3. **Wait for Deployment**
   - Go to the **Actions** tab in your repository
   - Watch the "Deploy to GitHub Pages" workflow run
   - Once complete, your site will be live!

### Accessing Your Deployed Site

Your site will be available at:
```
https://<your-username>.github.io/<repository-name>/
```

For example:
```
https://skamansam.github.io/gm-toolss/
```

## How It Works

### GitHub Actions Workflow

The `.github/workflows/deploy.yml` file contains the automated deployment pipeline:

1. **Trigger**: Runs on every push to `main` branch
2. **Build**:
   - Checks out the code
   - Sets up Node.js 20 and pnpm
   - Installs dependencies
   - Builds the static site with `pnpm run build`
   - Sets the `BASE_PATH` environment variable to match your repo name
3. **Deploy**:
   - Uploads the built files to GitHub Pages
   - Deploys to the `github-pages` environment

### Configuration Files

**svelte.config.js**
- Uses `@sveltejs/adapter-static` for static site generation
- Configures base path for GitHub Pages subdirectory deployment
- Enables SPA fallback with `index.html`

**src/routes/+layout.ts**
- Enables prerendering for all pages
- Disables server-side rendering (SSR) for client-only app

**static/.nojekyll**
- Prevents GitHub Pages from ignoring files starting with `_`
- Required for SvelteKit's `_app` directory

## Manual Deployment

If you need to deploy manually:

```bash
# Build the site
pnpm run build

# The built files are in the ./build directory
# You can upload these to any static hosting service
```

## Troubleshooting

### Deployment Failed

1. **Check the Actions tab** for error messages
2. **Common issues**:
   - Build errors: Fix TypeScript/Svelte errors locally first
   - Permission errors: Ensure GitHub Pages is enabled in settings
   - 404 errors: Check that base path is configured correctly

### Site Not Loading

1. **Check the base path** in `svelte.config.js` matches your repo name
2. **Clear browser cache** and try again
3. **Check browser console** for errors

### Assets Not Loading

1. **Verify `.nojekyll` file** exists in the `static` directory
2. **Check network tab** in browser dev tools for 404s
3. **Ensure all imports** use relative paths, not absolute

## Environment Variables

The workflow sets these automatically:

- `BASE_PATH`: Set to `/<repository-name>` during build
- This ensures all links and assets work in the subdirectory

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `static` directory with your domain
2. Configure DNS records to point to GitHub Pages
3. Enable custom domain in repository settings

## Local Testing

To test the production build locally:

```bash
# Build the site
pnpm run build

# Preview the built site
pnpm run preview
```

Note: The preview won't use the base path, so some links may not work exactly as they will on GitHub Pages.

## Deployment Checklist

Before deploying:

- [ ] All tests pass locally
- [ ] Build completes without errors (`pnpm run build`)
- [ ] Preview looks correct (`pnpm run preview`)
- [ ] Commit all changes
- [ ] Push to main branch
- [ ] Monitor Actions tab for deployment status
- [ ] Verify deployed site works correctly

## Rollback

If a deployment breaks the site:

1. **Revert the commit**:
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Or deploy a previous version**:
   ```bash
   git checkout <previous-commit-hash>
   git push origin main --force
   ```

## Performance

The static build is optimized for performance:

- ✅ Static HTML generation
- ✅ Code splitting
- ✅ Asset optimization
- ✅ Client-side routing (SPA)
- ✅ LocalStorage for data persistence

## Security

- All data is stored in browser localStorage
- No server-side processing
- No external API calls (except for dice rolling logic)
- Safe to use with sensitive campaign data

## Monitoring

After deployment:

1. **Check the Actions tab** for build/deploy status
2. **Test the live site** to ensure everything works
3. **Monitor browser console** for any errors
4. **Check GitHub Pages settings** for deployment URL

---

**Need Help?** Open an issue on GitHub or check the main README for more information.
