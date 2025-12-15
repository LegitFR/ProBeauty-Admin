# ProBeauty Admin - Authentication Setup

## Overview

This admin dashboard is secured with role-based authentication that **only allows admin users** to access the system. The authentication integrates with the backend API and supports both traditional email/password login and signup.

## Features

✅ **Admin-Only Access** - Only users with `role: "admin"` can access the dashboard  
✅ **Email/Password Authentication** - Traditional login/signup flow  
✅ **Auto-Signup as Admin** - New accounts are automatically registered with admin role  
✅ **Role Verification** - Checks admin status at login and on every protected route  
✅ **Token Management** - Automatic access token and refresh token handling  
✅ **Protected Routes** - Dashboard routes are protected and require authentication  
✅ **Persistent Sessions** - Authentication state persists across page refreshes  
✅ **Beautiful UI** - Captivating gradient design with animated backgrounds

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the project root:

```bash
# Copy from example
cp .env.example .env.local
```

Edit `.env.local` and set your API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Authentication Flow

### Sign Up (Admin Registration)

1. Navigate to `/auth` or click "Create admin account"
2. Fill in the form:
   - Full Name
   - Email Address
   - Phone Number
   - Password
3. Click "Create Admin Account"
4. **Role is automatically set to "admin"**
5. Check email for OTP verification (if OTP flow is enabled)
6. After verification, use credentials to login

### Login

1. Navigate to `/auth` or the root path will redirect
2. Enter email and password
3. Click "Sign In"
4. **System verifies user has admin role**
5. If admin: Redirected to dashboard
6. If not admin: Access denied with error message

### Logout

1. Click on profile avatar in top-right corner
2. Click "Log out"
3. Redirected to login page
4. All tokens cleared from storage

## Security Features

### Admin Role Enforcement

The system enforces admin-only access at **multiple levels**:

1. **Signup**: Role is hardcoded to "admin" in the signup form
2. **Login**: Checks if `user.role === 'admin'` before allowing access
3. **Auth Context**: Validates admin role when loading user from storage
4. **Protected Routes**: `ProtectedRoute` component verifies admin status
5. **Dashboard Layout**: Wrapped in `ProtectedRoute` for extra security

### Token Storage

- **Access Token**: Stored in `localStorage`, expires in 3 hours
- **Refresh Token**: Stored in `localStorage`, expires in 15 days
- **User Data**: Stored in `localStorage` for quick auth checks

### Protected Route Logic

```typescript
// Only admin users can access protected routes
if (!isAuthenticated || user?.role !== 'admin') {
  redirect to /auth
}
```

## File Structure

```
app/
├── auth/
│   └── page.tsx              # Login/Signup page
├── dashboard/
│   ├── layout.tsx            # Protected dashboard layout
│   └── ...                   # Dashboard pages
├── layout.tsx                # Root layout with AuthProvider
└── page.tsx                  # Root redirect page

components/
├── ProtectedRoute.tsx        # Route protection wrapper
└── dashboard-header.tsx      # Header with logout functionality

lib/
├── context/
│   └── AuthContext.tsx       # Auth state management
├── services/
│   └── authService.ts        # API communication
└── types/
    └── auth.ts               # TypeScript interfaces
```

## API Endpoints Used

### POST `/api/v1/auth/signup`

Registers a new admin user

- **Body**: `{ name, email, phone, password, role: "admin" }`
- **Response**: `{ message, userId }`

### POST `/api/v1/auth/login`

Authenticates a user

- **Body**: `{ identifier, password }`
- **Response**: `{ message, accessToken, refreshToken, user }`
- **Validation**: Checks if `user.role === "admin"`

### POST `/api/v1/auth/refresh-token`

Refreshes the access token

- **Body**: `{ refreshToken }`
- **Response**: `{ message, accessToken }`

## Customization

### Change API URL

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Modify Auth Page Styling

Edit [app/auth/page.tsx](app/auth/page.tsx):

- Change gradient colors in `bg-gradient-to-br`
- Modify animation blob colors
- Adjust form styling

### Add Additional Role Checks

Edit [lib/context/AuthContext.tsx](lib/context/AuthContext.tsx):

```typescript
// Add custom role validation
if (parsedUser.role !== "admin" || !parsedUser.isVerified) {
  // Custom logic
}
```

## Common Issues

### "Access denied. Admin privileges required."

**Cause**: The user account does not have `role: "admin"`  
**Solution**:

- Ensure backend creates users with correct role
- Check API response includes `user.role === "admin"`
- Verify database has correct role value

### Stuck on loading screen

**Cause**: Authentication check is hanging  
**Solution**:

- Check browser console for errors
- Verify API URL is correct in `.env.local`
- Clear localStorage: `localStorage.clear()`

### Redirects to login after refresh

**Cause**: Tokens or user data not persisting  
**Solution**:

- Check localStorage in DevTools
- Verify tokens are being saved after login
- Check for JavaScript errors in console

## Development Tips

### Testing Authentication

1. **Test Login**: Use existing admin credentials
2. **Test Signup**: Create new admin account
3. **Test Protection**: Try accessing `/dashboard` without login
4. **Test Logout**: Verify tokens are cleared and redirect works
5. **Test Refresh**: Reload page and check auth persists

### Debug Mode

Add console logs in [lib/context/AuthContext.tsx](lib/context/AuthContext.tsx):

```typescript
console.log("Auth State:", { user, isAuthenticated, isLoading });
console.log("Tokens:", {
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
});
```

## Next Steps

- [ ] Add OTP verification flow for signup
- [ ] Implement password reset functionality
- [ ] Add Google OAuth integration
- [ ] Add remember me functionality
- [ ] Implement session timeout warnings
- [ ] Add two-factor authentication

## Support

For issues or questions:

1. Check the API documentation
2. Review browser console for errors
3. Verify environment variables are set correctly
4. Check network tab for API responses

---

**Built with ❤️ for ProBeauty Admin Dashboard**
