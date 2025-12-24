# Pro Beauty Admin Dashboard

Admin dashboard for managing salons, bookings, customers, and services.

## 🚀 Quick Start

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Deployment

**No configuration needed!** Just deploy to Vercel:

1. Push to GitHub
2. Import to Vercel
3. Deploy
4. Done! ✅

See [DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md) for details.

## ✨ Features

- 👥 Salon Management (approve, edit, delete)
- 📅 Booking Management
- 💳 Payments & Finance
- 👤 Customer Management
- 📊 Analytics & Reports
- 🔔 Notifications
- ⚙️ System Health Monitoring
- 🛍️ E-commerce Management

## 🔐 Authentication

Admin login required. Use an account with `ADMIN` role.

## 🔧 API Configuration

**Default Backend**: `https://probeauty-backend.onrender.com`

All requests go through Next.js proxy (`/api/proxy`) to eliminate CORS issues.

**Optional**: Set `NEXT_PUBLIC_API_URL` to use a different backend.

## 📚 Documentation

- [DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md) - Zero-config deployment guide
- [DEBUG_403_ERROR.md](./DEBUG_403_ERROR.md) - Debug permission issues
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues and solutions

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
