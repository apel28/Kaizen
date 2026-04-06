# API Updates Verification Checklist

## ✅ What Has Been Updated

- [x] **`src/config/apiConfig.js`** - Created with environment-aware API base URL
- [x] **`src/utils/api.js`** - Refactored to use apiConfig with smart URL building
- [x] **All existing components** - Already using `apiPost`, `apiGet`, `apiPut`, `apiDelete`

## 🧪 Local Testing Steps

Run through these steps to verify everything works:

### Step 1: Start Backend
```bash
cd server
npm install  # if needed
npm run dev
# Expected output: Server started on port 5001
```

### Step 2: Start Frontend (New Terminal)
```bash
cd front_end
npm install  # if needed
npm run dev
# Expected output: VITE v8... ready in XXX ms
# Frontend URL: http://localhost:5173
```

### Step 3: Test API Connection
1. Open http://localhost:5173 in browser
2. Go to **Sign In** page
3. Try logging in with valid credentials
4. Check browser **Network** tab:
   - Should see request to `http://localhost:5001/api/signin`
   - Status should be **200** or **401** (not CORS error)
5. Check console for errors (should be none)

### Step 4: Verify API Endpoints
```javascript
// Open browser console and run:
import("http://localhost:5173/src/config/apiConfig.js").then(m => {
  console.log("API_BASE_URL:", m.API_BASE_URL);
});
// Should print: http://localhost:5001
```

### Step 5: Test All HTTP Methods

**Test GET:**
```javascript
// In browser console:
const { apiGet } = await import("http://localhost:5173/src/utils/api.js");
apiGet("/dashboard").then(r => console.log("GET works:", r)).catch(e => console.error("GET failed:", e));
```

**Test POST:**
```javascript
const { apiPost } = await import("http://localhost:5173/src/utils/api.js");
apiPost("/signin", {email: "test@example.com", password: "test"})
  .then(r => console.log("POST works:", r))
  .catch(e => console.error("POST failed:", e));
```

## 📊 Expected Behavior

### Local Development (http://localhost:5173)
- Frontend: http://localhost:5173 (Vite)
- Backend: http://localhost:5001 (Node.js)
- API calls: `http://localhost:5001/api/*` ✅

### Production on Netlify (https://myapp.netlify.app)
- Frontend & Backend: https://myapp.netlify.app
- API calls: `/api/*` (relative) ✅
- Redirects to: `/.netlify/functions/api` ✅

## 🔍 Debugging

### Check if API configuration is loaded
```javascript
import { API_BASE_URL } from "./src/config/apiConfig.js";
console.log("Current API_BASE_URL:", API_BASE_URL);
console.log("Is development?", import.meta.env.DEV);
```

### Monitor network requests
1. Open Browser DevTools → **Network** tab
2. Make an API call (e.g., try to sign in)
3. Look for request to `/api/*`
4. Check response tab for errors
5. Check headers for correct Content-Type

### Check for import errors
1. Open **Console** tab
2. Look for any red errors
3. Search for errors mentioning "apiConfig" or "api.js"
4. Clear cache and reload if needed: `Ctrl+Shift+Delete`

## 🚨 Common Issues & Fixes

### Issue: "Cannot find module 'apiConfig'"
**Fix:** Clear node_modules and reinstall
```bash
cd front_end
rm -rf node_modules package-lock.json
npm install
```

### Issue: CORS errors in console
**Fix:** Make sure backend is running on port 5001
```bash
cd server
npm run dev
# Check output for "Server started on port 5001"
```

### Issue: API requests hang or timeout
**Fix:** 
1. Check backend is responding: `curl http://localhost:5001/api/dashboard`
2. Check network logs for actual errors
3. Restart both frontend and backend

### Issue: Wrong API base URL
**Fix:** 
1. Verify `apiConfig.js` has correct logic
2. Open browser console and check: `console.log(import.meta.env.DEV)`
3. Should be `true` for local development

## ✨ Files Summary

| File | Status | Purpose |
|------|--------|---------|
| `src/config/apiConfig.js` | ✅ Created | Environment-aware API config |
| `src/utils/api.js` | ✅ Updated | Uses apiConfig for smart URLs |
| `src/context/AuthContext.jsx` | ✅ Already using | Imports apiGet |
| `src/components/landingPg/LoginBlock.jsx` | ✅ Already using | Imports apiPost |
| `src/components/landingPg/SignUpBlock.jsx` | ✅ Already using | Imports apiPost |
| Other pages/components | ✅ Already using | Import as needed |

## 🎯 Next Tasks

After verification:

1. **Commit Changes**
   ```bash
   git add .
   git commit -m "Update frontend API calls to use centralized config"
   git push origin main
   ```

2. **Deploy to Netlify** (when ready)
   - Connect your GitHub repo to Netlify
   - Add environment variables
   - Deploy!

3. **Monitor Production** (after deployment)
   - Check Netlify deploy logs
   - Monitor function invocations
   - Check API call success rate

## ✅ Completion Status

- [x] API configuration created
- [x] API utilities refactored
- [x] Local development URLs fixed
- [x] Production URLs configured
- [ ] Local testing completed (do this next!)
- [ ] Pushed to GitHub
- [ ] Deployed to Netlify

**Great! Your API calls are now ready for Netlify! 🚀**
