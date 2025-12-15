# 🚨 Troubleshooting "Failed to fetch" Error

## Quick Fix

This error means the frontend can't connect to your backend server.

### Step 1: Check if Backend is Running

Make sure your backend server is running on `http://localhost:5000`

```bash
# In your backend directory, start the server
npm start
# or
npm run dev
```

### Step 2: Verify the API URL

Check that `.env.local` exists in your project root with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 3: Restart Next.js Dev Server

After creating/updating `.env.local`, restart your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

### Step 4: Check CORS Settings

If your backend is running on a different port, ensure CORS is enabled in your backend to allow requests from `http://localhost:3000`

## Common Issues

### Backend Not Running

**Error**: `Cannot connect to backend server at http://localhost:5000`
**Solution**: Start your backend server

### Wrong Port

**Error**: Connection refused
**Solution**: Update `NEXT_PUBLIC_API_URL` in `.env.local` to match your backend port

### CORS Issues

**Error**: CORS policy blocked
**Solution**: Add CORS middleware in your backend:

```javascript
// Express example
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
```

## Testing Connection

Open browser console and check:

- The exact URL being called (logged in red)
- Network tab to see the failed request
- Backend logs to confirm it's receiving requests

## Need More Help?

1. Check backend server logs
2. Verify environment variables: `console.log(process.env.NEXT_PUBLIC_API_URL)`
3. Test backend endpoint directly: `curl http://localhost:5000/api/v1/auth/signup`
