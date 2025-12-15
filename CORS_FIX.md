# CORS Configuration Required

## 🚨 URGENT: Backend CORS Setup Needed

The frontend at `http://localhost:3000` is being blocked by CORS policy when trying to access `https://probeauty-backend.onrender.com`.

## Backend Fix Required

Add the following CORS configuration to your backend server:

### For Express.js:

```javascript
const cors = require("cors");

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000", // Local development
    "https://your-production-url.com", // Add your production URL when deployed
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
```

### Install CORS package (if not installed):

```bash
npm install cors
```

### Alternative: Allow All Origins (Development Only)

⚠️ **Use only for development testing:**

```javascript
const cors = require("cors");
app.use(cors());
```

## What is CORS?

Cross-Origin Resource Sharing (CORS) is a security feature that restricts web pages from making requests to a different domain than the one serving the web page.

**Your situation:**

- Frontend: `http://localhost:3000`
- Backend: `https://probeauty-backend.onrender.com`
- These are different origins, so CORS headers are required

## Checklist

- [ ] Install `cors` package in backend
- [ ] Add CORS middleware with `http://localhost:3000` in allowed origins
- [ ] Restart backend server
- [ ] Test API call from frontend

## Testing After Fix

1. Backend should include this header in responses:

   ```
   Access-Control-Allow-Origin: http://localhost:3000
   ```

2. Refresh your frontend and try signing up again

## Production Deployment

When you deploy your frontend, add its production URL to the CORS origins array:

```javascript
origin: [
  "http://localhost:3000",
  "https://your-deployed-frontend.vercel.app", // Add this
];
```
