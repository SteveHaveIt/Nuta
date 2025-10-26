# Nuta E-commerce Frontend

This is the frontend application for the Nuta e-commerce website, built with React, Vite, Tailwind CSS, and shadcn/ui.

## Features

- Homepage with hero section and featured products
- Product catalog with filtering
- Individual product detail pages
- Shopping cart functionality
- Checkout process
- User authentication (Login/Register)
- Blog section
- Promotions page with:
  - Spin Wheel
  - Giveaways
  - Social Media Contests
  - Flash Sales
- Responsive design with peanut-inspired branding

## Prerequisites

- Node.js 18+ and pnpm installed
- Backend API running (see backend README)

## Local Development

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your backend API URL:
   ```
   VITE_API_URL=http://localhost:3001
   ```

4. Start the development server:
   ```bash
   pnpm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Build for Production

```bash
pnpm run build
```

The built files will be in the `dist` directory.

## Deploy to Vercel

### Option 1: Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variable in Vercel dashboard:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://your-backend.onrender.com`)

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository or upload the frontend folder
4. Vercel will auto-detect the Vite framework
5. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: Your deployed backend URL (e.g., `https://your-backend.onrender.com`)
6. Click "Deploy"

## Environment Variables

- `VITE_API_URL`: The URL of your backend API (required)

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- Framer Motion
- Lucide React

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── SpinWheel.jsx
│   ├── MarketingPopup.jsx
│   ├── FlashSaleBanner.jsx
│   ├── GiveawayCard.jsx
│   ├── SocialContestCard.jsx
│   └── ui/          # shadcn/ui components
├── pages/           # Page components
│   ├── HomePage.jsx
│   ├── ProductsPage.jsx
│   ├── ProductDetailPage.jsx
│   ├── CartPage.jsx
│   ├── CheckoutPage.jsx
│   ├── AccountPage.jsx
│   ├── BlogPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── PromotionsPage.jsx
├── config/          # Configuration files
│   └── api.js
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

## License

Proprietary - Steve Have It Enterprise Hub

