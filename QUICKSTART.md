# ProBeauty Admin - Quick Start

## 🚀 Setup in 3 Steps

### 1. Configure API URL

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> Replace `http://localhost:5000` with your backend API URL

### 2. Install & Run

```bash
npm install
npm run dev
```

### 3. Access the App

Open [http://localhost:3000](http://localhost:3000)

- **First Time?** → You'll be redirected to `/auth` to create an admin account
- **Already Have Account?** → Sign in with your admin credentials

## 🔐 Authentication Info

### Creating Admin Account

1. Click "Create admin account"
2. Fill in your details (role is auto-set to "admin")
3. Click "Create Admin Account"
4. Check email for OTP (if enabled)
5. Return to login and sign in

### Signing In

1. Enter your email and password
2. Click "Sign In"
3. **Admin check** happens automatically
4. Redirected to dashboard if you're an admin

### Important Notes

⚠️ **Only admin users can access the dashboard**  
⚠️ **Role is automatically set to "admin" during signup**  
⚠️ **Non-admin accounts will be rejected at login**

## 📋 Environment Variables

| Variable              | Description          | Required | Default                 |
| --------------------- | -------------------- | -------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes      | `http://localhost:5000` |

## 🛠️ Troubleshooting

### Can't login?

- Check API URL in `.env.local`
- Verify backend is running
- Check browser console for errors
- Ensure account has `role: "admin"`

### Stuck on loading?

- Clear localStorage: Open DevTools → Console → Type `localStorage.clear()`
- Refresh the page

### Access denied?

- Your account must have `role: "admin"`
- Contact backend admin to update your role

## 📚 Full Documentation

See [AUTH_SETUP.md](./AUTH_SETUP.md) for complete authentication documentation.

---

**Need Help?** Check the browser console and network tab for error messages.
