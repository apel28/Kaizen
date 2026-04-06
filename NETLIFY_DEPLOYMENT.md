# Netlify Deployment Guide

## Overview

Your application has been configured for serverless deployment on Netlify. The server now runs on Netlify Functions instead of a traditional Node.js server.

## Changes Made

### 1. **Created Netlify Configuration** (`netlify.toml`)
   - Configured build command to install dependencies and build frontend
   - Set up Netlify Functions with proper bundling
   - Added redirects for API calls to `/netlify/functions/api`
   - SPA fallback for React routing

### 2. **Refactored Server Structure**
   - **`server/app.js`** - New file containing the Express app setup (previously in index.js)
   - **`netlify/functions/api.js`** - Netlify Function handler that wraps your Express app
   - **`server/index.js`** - Updated to use app.js, still works for local development
   - **`server/package.json`** - Added build and dev scripts

### 3. **Frontend Configuration**
   - **`front_end/src/config/apiConfig.js`** - Centralizes API endpoint configuration
   - **`front_end/.env.example`** - Environment variable template

## How Netlify Deployment Works

```
User Request
    ↓
Netlify CDN (serves static frontend)
    ↓
/api/* requests → Redirected to /.netlify/functions/api
    ↓
Netlify Function (api.js) → Express App
    ↓
Routes handlers → Database calls
```

## Deployment Steps

### 1. Connect Your Repository to Netlify

```bash
# Push your code to GitHub
git add .
git commit -m "Setup Netlify serverless deployment"
git push origin main
```

- Go to [netlify.com](https://netlify.com)
- Click "New site from Git"
- Select your GitHub repository
- Netlify will auto-detect `netlify.toml` configuration

### 2. Add Environment Variables in Netlify Dashboard

In Netlify Admin Panel → Site Settings → Build & Deploy → Environment:

```
DATABASE_URL=your_postgres_url
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_api_key
# Add any other environment variables your app needs
```

### 3. Deploy

- Netlify will automatically build and deploy when you push to main
- Or manually trigger a deploy from the dashboard

## Local Development

### Setup

```bash
# Install frontend dependencies
cd front_end
npm install

# Install server dependencies
cd ../server
npm install
```

### Running Locally

**Option 1: Separate terminals (recommended for development)**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd front_end
npm run dev
```

Your frontend will be at `http://localhost:5173` (Vite default)
Your backend will be at `http://localhost:5001`

**Option 2: Using Netlify Functions locally**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# From project root
netlify dev
```

This runs the full Netlify environment locally including Functions.

## Updating Frontend API Calls

### Option A: Update all API calls to use the config (Recommended)

In your existing API utility files, update them like:

```javascript
// Before
const response = await fetch('http://localhost:5001/api/signin', {
  method: 'POST',
  // ... 
});

// After
import { API_ENDPOINTS } from '../config/apiConfig';

const response = await fetch(API_ENDPOINTS.signin, {
  method: 'POST',
  // ...
});
```

### Option B: Manually update API endpoints

For each API call in your components/services:

**Development (local):**
```javascript
const apiBase = 'http://localhost:5001';
```

**Production (Netlify):**
```javascript
const apiBase = '/api'; // Relative to domain
```

Or use the provided config file which handles this automatically.

## Environment-Specific Behavior

### Local Development
- Frontend runs at `http://localhost:5173`
- Backend runs at `http://localhost:5001`
- Use `http://localhost:5001` as API base URL

### Netlify Production
- Frontend and backend served from same domain
- API calls use relative paths `/api/*`
- Redirects automatically route to Netlify Functions

## Troubleshooting

### API calls returning 404

1. Check that your environment variables are set in Netlify dashboard
2. Verify the API path matches your route definitions
3. Check browser console for CORS errors (should be handled by netlify.toml)

### Cold start latency

- Netlify Functions have a "cold start" delay on first request
- Subsequent requests are faster
- This is normal for serverless deployments

### Build failures

1. Check Netlify deploy logs in dashboard
2. Ensure all environment variables are set
3. Verify `npm install` works for both frontend and server locally
4. Check that `node_modules` is in `.gitignore`

### Database connection issues

- Make sure your database URL is correct
- Ensure your database allows connections from Netlify's IP ranges
- For Supabase, this is usually automatic

## Cost Considerations

Netlify offers:
- **Free tier**: 125,000 function invocations/month (plenty for most apps)
- **Paid**: 1M invocations/month included, then $0.000001 per invocation

## Additional Resources

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Express with Netlify Functions](https://www.netlify.com/blog/2021/10/13/netlify-functions-with-express-how-to-use-express-on-netlify-lambda/)
- [Netlify CLI Reference](https://docs.netlify.com/cli/get-started/)

## Next Steps

1. Test locally with `npm run dev` (backend) and `npm run dev` (frontend)
2. Push code to GitHub
3. Connect repository to Netlify
4. Add environment variables in Netlify dashboard
5. Deploy and monitor logs

Good luck with your deployment! 🚀
