# Nuta E-commerce Backend API

This is the backend API for the Nuta e-commerce website, built with Node.js, Express, and SQLite.

## Features

- RESTful API for products, orders, and users
- JWT-based authentication
- Product management (CRUD operations)
- Order management
- Marketing features:
  - Spin Wheel system
  - Flash Sales
  - Giveaways
  - Social Media Contests
  - Affiliate Program
  - Discount Codes
- Admin dashboard (static HTML)
- SQLite database for data persistence

## Prerequisites

- Node.js 18+
- npm

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your configuration:
   ```
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=your_secure_jwt_secret
   CORS_ORIGIN=http://localhost:5173
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. The API will be available at `http://localhost:3001`
6. Admin dashboard: `http://localhost:3001/admin`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products?featured=true` - Get featured products
- `GET /api/products?category=butter` - Filter by category
- `GET /api/products/:slug` - Get product by slug
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Orders
- `POST /api/orders` - Create order (requires authentication)
- `GET /api/orders/user/:userId` - Get user orders (requires authentication)
- `GET /api/orders/:id` - Get order details (requires authentication)
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

### Marketing
- `GET /api/marketing/spin-wheel-config` - Get spin wheel configuration
- `POST /api/marketing/spin-wheel-spin` - Record a spin and get prize
- `GET /api/marketing/campaigns` - Get active marketing campaigns
- `GET /api/marketing/flash-sales` - Get active flash sales
- `GET /api/marketing/giveaways` - Get active giveaways
- `POST /api/marketing/giveaways/enter` - Enter a giveaway
- `GET /api/marketing/social-contests` - Get active social contests
- `POST /api/marketing/social-contests/enter` - Enter a social contest
- `GET /api/marketing/affiliates` - Get affiliate program details
- `POST /api/marketing/affiliates/register` - Register as an affiliate
- `GET /api/marketing/discounts` - Get available discount codes

## Deploy to Render

### Option 1: Render Dashboard

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" and select "Web Service"
3. Connect your Git repository or upload the backend folder
4. Configure the service:
   - **Name**: nuta-backend (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or your preferred tier)

5. Add environment variables:
   - `PORT`: 3001 (Render will override this with their own port)
   - `NODE_ENV`: production
   - `JWT_SECRET`: Your secure JWT secret (generate a random string)
   - `CORS_ORIGIN`: Your frontend URL (e.g., `https://your-frontend.vercel.app`)

6. Click "Create Web Service"

7. Once deployed, copy the service URL (e.g., `https://nuta-backend.onrender.com`)

8. Update your frontend's `VITE_API_URL` environment variable with this URL

### Option 2: Render CLI

1. Install Render CLI (if available) or use Git deployment

2. Push your code to a Git repository

3. Follow the dashboard instructions above

## Environment Variables

Required:
- `PORT`: Server port (default: 3001, Render will override)
- `NODE_ENV`: Environment (development/production)
- `JWT_SECRET`: Secret key for JWT tokens (must be secure in production)
- `CORS_ORIGIN`: Frontend URL for CORS (e.g., `https://your-frontend.vercel.app`)

Optional (for future enhancements):
- Email configuration for notifications
- WhatsApp API for notifications
- Payment gateway credentials (M-Pesa, PayPal)

## Database

The application uses SQLite for data persistence. The database file (`nuta.db`) is automatically created in the `data/` directory on first run.

For production, consider migrating to PostgreSQL or MySQL for better performance and scalability.

## Sample Data

The application automatically seeds sample data on first run:
- 6 sample products
- 1 giveaway
- 1 social media contest
- 1 flash sale
- 3 discount codes
- Spin wheel configuration

## Tech Stack

- Node.js
- Express.js
- SQLite3
- JWT (jsonwebtoken)
- bcryptjs
- cors
- dotenv

## Project Structure

```
src/
├── config/
│   ├── database.js              # Main database setup
│   ├── marketingDatabase.js     # Marketing tables setup
│   └── seedMarketingData.js     # Sample marketing data
├── controllers/
│   ├── productController.js
│   ├── orderController.js
│   ├── authController.js
│   ├── spinWheelController.js
│   ├── marketingController.js
│   ├── giveawayController.js
│   └── affiliateController.js
├── middleware/
│   └── authMiddleware.js
├── routes/
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── authRoutes.js
│   └── marketingRoutes.js
├── app.js                       # Express app configuration
└── server.js                    # Server entry point
public/
└── admin/
    └── index.html              # Admin dashboard
data/
└── nuta.db                     # SQLite database (auto-generated)
```

## Admin Dashboard

Access the admin dashboard at `/admin` (e.g., `http://localhost:3001/admin` or `https://your-backend.onrender.com/admin`)

Features:
- Product management
- Order management
- Inventory tracking
- Analytics

Note: The admin dashboard currently has basic authentication. Implement proper admin login for production use.

## License

Proprietary - Steve Have It Enterprise Hub

