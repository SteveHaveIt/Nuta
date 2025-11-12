# Nuta E-commerce Platform

A state-of-the-art, full-stack e-commerce platform for authentic Kenyan peanut products. Built with modern technologies including React, Express, tRPC, Drizzle ORM, and integrated with M-PESA, PayPal, Supabase, and AI-powered features.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Configuration Guide](#configuration-guide)
- [Contributing](#contributing)

## 🎯 Overview

**Nuta** - "The taste of real Kenyan peanuts. Healthy. Honest. Homegrown."

A comprehensive e-commerce solution designed for the Steve Have It brand, offering:

- **E-commerce Hub**: Product catalog, shopping cart, and checkout with multiple payment methods
- **Customer Loyalty**: Points system, spin wheel promotions, and rewards redemption
- **Affiliate Program**: 5% commission system with rank-based bonuses and monthly payouts
- **Customer Support**: Ticketing system with AI-powered chatbot and knowledge base
- **Admin Console**: Full dashboard with CRM, analytics, and AI assistant
- **AI Integration**: Fraud detection, product recommendations, and marketing automation
- **Multi-channel Notifications**: Email, SMS, and WhatsApp integration

## ✨ Features

### For Customers

- **Product Browsing**: Search, filter, and discover peanut products
- **Flexible Checkout**: Guest checkout with OTP or registered user accounts
- **Multiple Payments**: M-PESA (STK Push) and PayPal support
- **Loyalty Program**: Earn points (KES 500 = 9 points), redeem for discounts
- **Spin Wheel**: Earn rewards based on purchase frequency (5, 10, 20, 30+ purchases)
- **Affiliate Program**: Earn 5% commission on referrals
- **Order Tracking**: Real-time tracking with PIN-based guest access
- **Support System**: Create tickets, access knowledge base, AI chat support
- **Returns & Refunds**: Simple return process with automated refund handling

### For Admins

- **Dashboard**: Sales overview, metrics, and alerts
- **Product Management**: Add, edit, delete products with inventory tracking
- **Order Management**: View, process, and track all orders
- **Customer Management**: Segment customers, track behavior
- **Analytics**: Sales trends, customer insights, performance metrics
- **Affiliate Management**: Approve affiliates, track commissions, manage payouts
- **Marketing Tools**: Campaign management, popup configuration, email automation
- **AI Assistant**: Smart recommendations, fraud detection, system monitoring
- **Support Management**: View and respond to support tickets

## 🛠 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **shadcn/ui** for component library
- **tRPC** for type-safe API communication
- **Wouter** for routing
- **Sonner** for notifications

### Backend
- **Express 4** for HTTP server
- **tRPC 11** for RPC framework
- **Drizzle ORM** for database management
- **MySQL/TiDB** for relational database
- **Zod** for validation

### Integrations
- **Manus OAuth** for authentication
- **Supabase** for database and storage
- **M-PESA** for payment processing
- **PayPal** for international payments
- **Gmail SMTP** for email notifications
- **Twilio** for SMS notifications
- **Cloudinary** for image storage
- **Ollama/DeepSeek** for AI features

## 📁 Project Structure

```
Nuta/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── ProductCatalog.tsx  # Product listing
│   │   │   ├── ProductDetails.tsx  # Product details
│   │   │   ├── Cart.tsx            # Shopping cart
│   │   │   ├── Checkout.tsx        # Checkout flow
│   │   │   ├── Dashboard.tsx       # User dashboard
│   │   │   ├── DashboardOrders.tsx # Order history
│   │   │   ├── DashboardLoyalty.tsx# Loyalty points
│   │   │   ├── DashboardAffiliate.tsx# Affiliate dashboard
│   │   │   ├── Support.tsx         # Support tickets
│   │   │   ├── AdminDashboard.tsx  # Admin home
│   │   │   ├── AdminOrders.tsx     # Admin orders
│   │   │   ├── AdminProducts.tsx   # Admin products
│   │   │   ├── AdminTickets.tsx    # Admin tickets
│   │   │   ├── Blog.tsx            # Blog posts
│   │   │   ├── About.tsx           # About page
│   │   │   ├── Policies.tsx        # Legal policies
│   │   │   └── OrderTracking.tsx   # Guest order tracking
│   │   ├── components/             # Reusable components
│   │   ├── contexts/               # React contexts
│   │   ├── hooks/                  # Custom hooks
│   │   ├── lib/                    # Utilities
│   │   ├── App.tsx                 # Main app component
│   │   └── main.tsx                # Entry point
│   └── public/                     # Static assets
├── server/                          # Backend Express application
│   ├── db.ts                       # Database query helpers
│   ├── routers.ts                  # tRPC procedure definitions
│   └── _core/                      # Core infrastructure
├── drizzle/                         # Database schema and migrations
│   ├── schema.ts                   # Table definitions
│   └── migrations/                 # Migration files
├── shared/                          # Shared types and constants
├── storage/                         # S3 storage helpers
├── BLUEPRINT_EXTRACTION.md          # Detailed requirements from blueprint
├── todo.md                          # Implementation checklist
├── README.md                        # This file
└── .env.example                     # Environment variables template
```

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18+ and npm/pnpm
- MySQL database (local or cloud)
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   gh repo clone SteveHaveIt/Nuta
   cd Nuta
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual credentials
   ```

4. **Set up the database**
   ```bash
   pnpm db:push
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## 🔐 Environment Variables

### Core Configuration
- `DATABASE_URL`: MySQL connection string
- `JWT_SECRET`: Secret key for session tokens
- `APP_URL`: Production URL of the application
- `NODE_ENV`: Environment (development/production)

### Authentication
- `VITE_APP_ID`: Manus OAuth application ID
- `OAUTH_SERVER_URL`: Manus OAuth server URL
- `VITE_OAUTH_PORTAL_URL`: Manus login portal URL
- `OWNER_OPEN_ID`: Owner's Manus OpenID
- `OWNER_NAME`: Owner's name

### Database & Storage
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

### Email & SMS
- `SMTP_SERVER`: Gmail SMTP server (smtp.gmail.com)
- `SMTP_PORT`: SMTP port (465)
- `SMTP_USERNAME`: Gmail address
- `SMTP_PASSWORD`: Gmail app password
- `TWILIO_ACCOUNT_SID`: Twilio account ID
- `TWILIO_AUTH_TOKEN`: Twilio auth token
- `TWILIO_PHONE_NUMBER`: Twilio phone number
- `WHATSAPP_API_TOKEN`: WhatsApp API token

### Payment Gateways
- `MPESA_CONSUMER_KEY`: M-PESA consumer key
- `MPESA_CONSUMER_SECRET`: M-PESA consumer secret
- `MPESA_SHORTCODE`: M-PESA business shortcode
- `MPESA_PASSKEY`: M-PESA passkey
- `PAYPAL_CLIENT_ID`: PayPal client ID
- `PAYPAL_SECRET`: PayPal secret

### Storage
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name

### AI Services
- `AI_ENGINE`: AI engine type (Ollama/DeepSeek/OpenAI)
- `AI_MODEL`: Model name (llama3/deepseek-coder)
- `AI_API_KEY`: AI API key
- `AI_API_URL`: AI API endpoint

See `.env.example` for complete list of variables.

## 📊 Database Schema

### Core Tables

**users**
- User authentication and profile information
- Manus OAuth integration
- Role-based access control (user/admin)

**products**
- Product catalog with pricing and inventory
- Category and featured product flags
- Image storage references

**orders**
- Customer orders with status tracking
- Support for guest and registered users
- Payment method and status tracking

**orderItems**
- Individual items in orders
- Price snapshot at time of purchase

**loyaltyPoints**
- User loyalty points balance
- Points earned and redeemed tracking

**affiliates**
- Affiliate registration and management
- Commission tracking and rank system
- Referral code generation

**supportTickets**
- Customer support request management
- Ticket status and priority tracking

**returns**
- Return request processing
- Refund amount tracking

**guestOrders**
- Guest order tracking via PIN
- Phone-based order lookup

See `drizzle/schema.ts` for complete schema definition.

## 🔌 API Documentation

### Authentication
- `auth.me` - Get current user
- `auth.logout` - Logout user

### Products
- `products.list` - List all products
- `products.getById` - Get product details
- `products.search` - Search products
- `products.byCategory` - Filter by category
- `products.create` - Create product (admin)
- `products.update` - Update product (admin)

### Orders
- `orders.create` - Create new order
- `orders.getById` - Get order details
- `orders.getByNumber` - Get order by number
- `orders.myOrders` - Get user's orders
- `orders.updateStatus` - Update order status (admin)
- `orders.trackByPin` - Track guest order by PIN

### Payments
- `payments.initiateMpesa` - Initiate M-PESA payment
- `payments.mpesaCallback` - M-PESA callback handler
- `payments.initiatePaypal` - Initiate PayPal payment
- `payments.paypalCallback` - PayPal callback handler

### Loyalty
- `loyalty.getPoints` - Get user's loyalty points
- `loyalty.addPoints` - Add points to order (admin)
- `loyalty.redeem` - Redeem points for discount
- `loyalty.history` - Get points history

### Spin Wheel
- `spinWheel.checkEligibility` - Check spin eligibility
- `spinWheel.spin` - Spin the wheel

### Affiliates
- `affiliates.register` - Register as affiliate
- `affiliates.getStatus` - Get affiliate status
- `affiliates.getEarnings` - Get earnings summary
- `affiliates.approve` - Approve affiliate (admin)

### Support
- `support.createTicket` - Create support ticket
- `support.getTicket` - Get ticket details
- `support.myTickets` - Get user's tickets
- `support.addMessage` - Add message to ticket
- `support.allTickets` - Get all tickets (admin)

### Returns
- `returns.create` - Create return request
- `returns.myReturns` - Get user's returns

### Admin
- `admin.dashboard` - Get dashboard stats
- `admin.allOrders` - Get all orders
- `admin.allTickets` - Get all support tickets

## 🌐 Deployment

### Vercel (Frontend)

1. **Connect GitHub repository**
   ```bash
   vercel link
   ```

2. **Set environment variables**
   ```bash
   vercel env add VITE_APP_ID
   vercel env add OAUTH_SERVER_URL
   # ... add all VITE_* variables
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Render (Backend)

1. **Create new Web Service**
   - Connect GitHub repository
   - Set build command: `pnpm install && pnpm build`
   - Set start command: `pnpm start`

2. **Add environment variables**
   - Add all non-VITE_ variables from .env

3. **Deploy**
   - Render will automatically deploy on push to main

### Database (Supabase)

1. **Create Supabase project**
2. **Get connection string**
3. **Set DATABASE_URL** in environment
4. **Run migrations**
   ```bash
   pnpm db:push
   ```

## ⚙️ Configuration Guide

### M-PESA Integration

1. **Get credentials from Safaricom**
   - Consumer Key
   - Consumer Secret
   - Business Shortcode
   - Passkey

2. **Configure in .env**
   ```
   MPESA_CONSUMER_KEY=your_key
   MPESA_CONSUMER_SECRET=your_secret
   MPESA_SHORTCODE=your_shortcode
   MPESA_PASSKEY=your_passkey
   ```

3. **Test in sandbox**
   - Use test phone numbers
   - Verify callback handling

### PayPal Integration

1. **Create PayPal Business account**
2. **Get API credentials**
3. **Configure in .env**
   ```
   PAYPAL_CLIENT_ID=your_client_id
   PAYPAL_SECRET=your_secret
   ```

### Email Configuration

1. **Enable Gmail App Password**
   - Enable 2FA on Google account
   - Generate app password
   - Use as SMTP_PASSWORD

2. **Configure Twilio**
   - Create Twilio account
   - Get Account SID and Auth Token
   - Verify phone number

### AI Setup

1. **Option 1: Local Ollama**
   ```bash
   # Install Ollama from ollama.ai
   ollama pull llama3
   ollama serve
   ```

2. **Option 2: Cloud AI Service**
   - Use DeepInfra or Hugging Face Spaces
   - Get API key
   - Set AI_API_URL and AI_API_KEY

## 📝 Implementation Phases

### Phase 1 (MVP) - Complete ✅
- Guest checkout with phone OTP
- M-PESA payment integration
- Guest order tracking via PIN
- Basic customer dashboard
- Admin guest verification queue

### Phase 2 (In Progress)
- Registered user accounts with loyalty points
- Saved addresses and email receipts
- WhatsApp/SMS notifications
- Live chat support

### Phase 3 (Planned)
- Advanced fraud detection
- AI customer support agent
- Subscription orders
- Advanced analytics
- Multi-currency support

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📄 License

© 2025 Steve Have It Enterprise. All rights reserved.

## 📞 Support

For issues and questions:
- Create a support ticket at `/support`
- Email: support@stevehaveit.info
- WhatsApp: [Business WhatsApp link]

## 🔗 Resources

- [Blueprint Documentation](./BLUEPRINT_EXTRACTION.md)
- [Implementation Checklist](./todo.md)
- [tRPC Documentation](https://trpc.io)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Tailwind CSS Documentation](https://tailwindcss.com)

---

**Built with ❤️ by Manus AI for Steve Have It Enterprise**
