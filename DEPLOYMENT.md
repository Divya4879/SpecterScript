# Deployment Guide

## Pre-Deployment Checklist

Before deploying to Vercel, ensure:

- [ ] All tests pass locally (`npm test`)
- [ ] Build succeeds without errors (`npm run build`)
- [ ] Environment variables are documented in `.env.example`
- [ ] `vercel.json` is configured with proper timeouts and memory
- [ ] Git repository is up to date

## Deployment Steps

### 1. Initial Setup

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install Vercel CLI (optional): `npm i -g vercel`
3. Push your code to GitHub/GitLab/Bitbucket

### 2. Import Project to Vercel

**Via Vercel Dashboard:**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your Git repository
4. Vercel will auto-detect Next.js configuration

**Via Vercel CLI:**
```bash
vercel
```

### 3. Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

| Variable | Value | Description |
|----------|-------|-------------|
| `GEMINI_API_KEY` | Your API key | Required for AI transformation |
| `NEXT_PUBLIC_MAX_FILE_SIZE` | `10485760` | Max upload size (10 MB) |
| `NODE_ENV` | `production` | Environment mode |

### 4. Deploy

Vercel will automatically deploy on every push to your main branch.

**Manual deployment via CLI:**
```bash
vercel --prod
```

### 5. Verify Deployment

After deployment, test the following:

## Post-Deployment Testing Checklist

### Upload & Validation
- [ ] Upload a small PDF (< 1 MB) - should succeed
- [ ] Upload a large PDF (8-10 MB) - should succeed
- [ ] Upload a file > 10 MB - should show error
- [ ] Upload a non-PDF file - should show error
- [ ] Upload a corrupted PDF - should show error
- [ ] Drag and drop a PDF - should work

### Text Extraction
- [ ] Extract text from a simple PDF - should complete in < 5 seconds
- [ ] Extract text from a multi-page PDF (40+ pages) - should preserve page count
- [ ] Extract text from a PDF with special characters - should sanitize properly
- [ ] Try a PDF with no text - should show appropriate error

### AI Transformation
- [ ] Transform a short document (< 5 pages) - should complete successfully
- [ ] Transform a long document (40-80 pages) - should handle chunking
- [ ] Verify haunted text maintains structure (headings, sections)
- [ ] Check that transformation preserves paragraph breaks
- [ ] Test retry logic by monitoring network (optional)

### Haunted Viewer
- [ ] Verify parchment texture displays correctly
- [ ] Check candle flame animations are smooth
- [ ] Verify fog overlay is visible
- [ ] Confirm gothic fonts load properly (Cinzel, Crimson Text)
- [ ] Test hover effects on text (spectral glow)
- [ ] Verify custom ghost cursor appears

### Page Navigation
- [ ] Navigate forward through pages - should work smoothly
- [ ] Navigate backward through pages - should work smoothly
- [ ] Try to navigate beyond last page - should be prevented
- [ ] Try to navigate before first page - should be prevented
- [ ] Verify page transition animations (flicker/glitch effect)
- [ ] Check that idle flicker triggers after 10 seconds
- [ ] Scroll within viewer - should show ember particles

### Export Functionality
- [ ] Export as PDF - should download with gothic styling
- [ ] Export as Markdown - should download with .md extension
- [ ] Export as TXT - should download as plain text
- [ ] Verify exported content matches haunted text
- [ ] Check that filenames are appropriate

### Accessibility Features
- [ ] Toggle non-flicker mode ON - animations should stop
- [ ] Toggle non-flicker mode OFF - animations should resume
- [ ] Verify prefers-reduced-motion CSS works
- [ ] Test keyboard navigation (Tab through all controls)
- [ ] Verify ARIA labels are present
- [ ] Toggle audio (if implemented) - should mute/unmute

### Performance
- [ ] Check page load time (should be < 3 seconds)
- [ ] Verify animations run at 60 FPS (use Chrome DevTools)
- [ ] Test with Chrome Lighthouse (aim for 90+ performance score)
- [ ] Monitor function execution time in Vercel dashboard

### Security & Privacy
- [ ] Verify no files persist after processing
- [ ] Check that API calls use HTTPS
- [ ] Confirm CORS is configured properly
- [ ] Verify API keys are not exposed in client code
- [ ] Test that no user data is logged

### Error Handling
- [ ] Trigger a network error - should show user-friendly message
- [ ] Cause an API failure - should retry and show error if all retries fail
- [ ] Test "Start Over" button on critical errors
- [ ] Verify errors clear when corrective action is taken

## Monitoring

After deployment, monitor:

1. **Vercel Dashboard**: Check function execution times and errors
2. **Analytics**: Monitor page views and user interactions
3. **Error Tracking**: Watch for runtime errors in Vercel logs
4. **API Usage**: Monitor Gemini API quota and costs

## Rollback

If issues occur in production:

```bash
# Via Vercel CLI
vercel rollback

# Or via Dashboard
# Go to Deployments → Select previous deployment → Promote to Production
```

## Troubleshooting

### Function Timeout Errors
- Increase timeout in `vercel.json` (max 60s on Hobby plan)
- Optimize chunking strategy for faster processing

### Memory Errors
- Increase memory allocation in `vercel.json` (max 1024 MB on Hobby plan)
- Optimize PDF parsing to use less memory

### API Rate Limits
- Implement request queuing
- Add user-facing rate limit messaging
- Consider upgrading Gemini API tier

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Review build logs in Vercel dashboard

## Production Environment Variables

Ensure these are set in Vercel:

```bash
GEMINI_API_KEY=<your-production-api-key>
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NODE_ENV=production
```

## Support

For deployment issues:
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Next.js Deployment: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- Gemini API: [ai.google.dev](https://ai.google.dev)
