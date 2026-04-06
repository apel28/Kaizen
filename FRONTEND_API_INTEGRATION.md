# Frontend API Integration Guide

After deploying to Netlify, update your frontend API calls to use the centralized configuration.

## Setup

1. Copy the provided API configuration:
   ```bash
   # Already created at: front_end/src/config/apiConfig.js
   ```

2. In your `.env.local` (for local development), you can optionally set:
   ```
   VITE_API_BASE_URL=http://localhost:5001
   ```
   (This is the default, so it's optional)

## Updating Your API Calls

### Example 1: Using Fetch

**Before:**
```javascript
const response = await fetch('http://localhost:5001/api/signin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
  }),
  credentials: 'include',
});
```

**After:**
```javascript
import { API_ENDPOINTS } from '../config/apiConfig';

const response = await fetch(API_ENDPOINTS.signin, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
  }),
  credentials: 'include',
});
```

### Example 2: Creating a Reusable API Utility

Create a file like `front_end/src/utils/api.js`:

```javascript
import { API_BASE_URL } from '../config/apiConfig';

export const apiCall = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    ...otherOptions
  } = options;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const config = {
    method,
    headers: defaultHeaders,
    credentials: 'include', // For cookies
    ...otherOptions,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusCode}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
```

Then use it in your components:

```javascript
import { apiCall } from '../utils/api';

// POST request
const data = await apiCall('/api/signin', {
  method: 'POST',
  body: { email: 'user@example.com', password: 'password123' },
});

// GET request
const profile = await apiCall('/api/profile');

// PUT request
const updated = await apiCall('/api/profile', {
  method: 'PUT',
  body: { name: 'New Name' },
});
```

### Example 3: In React Components

```javascript
import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/apiConfig';

export function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.dashboard, {
          credentials: 'include',
        });
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Display data */}</div>;
}
```

### Example 4: Form Submission

```javascript
import { API_ENDPOINTS } from '../config/apiConfig';

export function LoginForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch(API_ENDPOINTS.signin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await response.json();
      
      if (response.ok) {
        // Handle successful login
        console.log('Login successful');
      } else {
        // Handle error
        console.error('Login failed:', result);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Environment-Specific Behavior

### Local Development
- `VITE_API_BASE_URL` = `http://localhost:5001` (default)
- Frontend: `http://localhost:5173`
- No CORS issues because different ports

### Netlify Production
- `VITE_API_BASE_URL` = Current domain (default)
- Frontend and API on same domain
- CORS already configured in `netlify.toml`

## Important Points

1. **Always use `credentials: 'include'`** for authenticated requests (cookies/JWT)
2. **Content-Type headers** - Express in your server expects `application/json`
3. **Error handling** - Add try-catch blocks for better error management
4. **Loading states** - Always provide user feedback during async operations
5. **CORS** - Should be automatic on Netlify with current setup

## Troubleshooting

### CORS Errors
If you see CORS errors in console:
1. Check `netlify.toml` has the redirects rule
2. Verify your requests include proper headers
3. Test with OPTIONS method if needed

### 404 Errors on API Calls
1. Verify the endpoint path matches your route definitions
2. Check that environment variables are set in Netlify dashboard
3. Look at Netlify function logs for backend errors

### Development vs Production Differences
- Local: Use `http://localhost:5001` explicitly or rely on `VITE_API_BASE_URL`
- Production: Requests automatically go to same domain's `/api` endpoint

## Common API Endpoints in Your App

```
POST   /api/signup              - User registration
POST   /api/signin              - User login
GET    /api/dashboard           - Dashboard data
GET    /api/profile             - User profile
POST   /api/appointment         - Create appointment
GET    /api/appointment         - Get appointments
POST   /api/prescription        - Create prescription
GET    /api/patient-data        - Get patient data
POST   /api/test-orders         - Order tests
GET    /api/test-orders         - Get test orders
POST   /api/notifications       - Create notification
GET    /api/notifications       - Get notifications
GET    /api/admin               - Admin dashboard
```

Apply the same pattern to all these endpoints!
