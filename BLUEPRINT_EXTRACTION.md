# Nuta Website Master Blueprint - Extraction Summary

## Project Overview
- **Brand**: Nuta (Steve Have It Enterprise)
- **Purpose**: African-made peanut products e-commerce platform with advanced loyalty, affiliate, AI, and payment integrations
- **Target Markets**: Kenya (primary), East Africa, Diaspora, Global
- **Core Philosophy**: Simplicity, Storytelling, Scalability

## Core Features to Implement

### 1. E-Commerce Hub
- **Product Catalog**: Browse, filter, and search peanut products
- **Shopping Cart**: Add/remove items, view totals
- **Checkout Flow**: Guest and registered user checkout
- **Payment Methods**: M-PESA (STK Push), PayPal, Debit/Credit Cards
- **Order Tracking**: Real-time delivery status with PIN-based guest tracking
- **Inventory Management**: Real-time stock updates, auto-alerts for low stock

### 2. Customer Authentication & Accounts
- **Guest Checkout**: Phone OTP verification, PIN-based order tracking
- **User Registration**: Email/phone signup with Manus OAuth
- **User Dashboard**: 
  - Active orders and delivery status
  - Loyalty points overview
  - Saved addresses
  - Order history
  - Referral/affiliate status

### 3. Loyalty & Rewards System
- **Loyalty Points**: 
  - KES 500 spent = 9 points
  - 1 point = KES 3 redeemable
  - Points tracking and redemption
- **Spin Wheel Promotions**: 
  - Eligibility: 5, 10, 20, 30+ purchases
  - Rewards: KES 100, 200, 500, 1000
  - Festive mode: +15% bonus during peak seasons
- **Giveaways & Contests**: Auto-mode with email alerts

### 4. Affiliate & Referral System
- **Affiliate Commission**: 5% base commission on total sale value
- **Rank Bonuses**: Top affiliates (Gold/Platinum) get +2% extra
- **Affiliate Dashboard**: 
  - Referral link generation
  - Earnings summary
  - Performance tracking
  - Payout history
- **Monthly Payouts**: Processed on 1st of each month (KES)
- **Admin Approval**: Required for new affiliates

### 5. Customer Support & AI Assistance
- **Support Tickets**: Open from dashboard for issues/complaints
- **Knowledge Base**: FAQs, shipping, returns, product info
- **AI Chatbot**: 
  - Answers FAQs automatically
  - Escalates complex issues to human support
  - Canned replies for common questions
- **CS Metrics**: Response time, resolution time, CSAT score, refund rate

### 6. Returns & Refunds
- **Return Process**:
  1. Customer opens return request in dashboard
  2. System requests reason + photos (if damage)
  3. Admin verifies and issues Return Authorization (RA) number
  4. Customer ships item (or ops collects)
  5. Admin verifies condition and processes refund
  6. Refund via original payment method or store credit
- **Refund Notifications**: WhatsApp/SMS updates

### 7. Admin Console & Dashboard
- **Dashboard Home**: Sales overview, metrics, alerts
- **Product Management**: Add/edit/delete products, inventory
- **Order Management**: View, process, track orders
- **Customer Management**: User profiles, segments, communication
- **Analytics & Reports**: Sales, traffic, customer behavior
- **Marketing Tools**: Campaign management, popup configuration
- **Affiliate Management**: Approve, track, pay affiliates
- **AI Assistant**: Smart recommendations, fraud detection, automation

### 8. AI-Driven Features
- **Fraud Detection**: Detect suspicious orders, payment mismatches
- **Product Recommendations**: Personalized suggestions based on behavior
- **Marketing Automation**: AI suggests campaigns, tracks performance
- **Affiliate Ranking**: Auto-ranks top performers, triggers bonuses
- **Email/SMS Automation**: Transactional and marketing messages
- **Performance Monitoring**: System health, error detection, alerts

### 9. Notifications & Communications
- **Email**: Order confirmations, receipts, marketing campaigns
- **SMS/WhatsApp**: OTP, order updates, delivery notifications
- **Push Notifications**: Browser/app notifications for orders
- **In-App Notifications**: Dashboard alerts

### 10. Brand Storytelling & Content
- **Landing Page**: Hero section, value proposition, CTAs
- **Blog/Articles**: Health benefits, recipes, brand story
- **Video Content**: Product making, testimonials, vlogs
- **About Page**: Nuta journey, team, impact story
- **Social Integration**: Links to social media channels

### 11. Legal & Compliance
- **Terms & Conditions**: https://nuta.stevehaveit.info/terms
- **Privacy Policy**: https://nuta.stevehaveit.info/privacy
- **Return Policy**: https://nuta.stevehaveit.info/return-policy
- **Delivery Policy**: https://nuta.stevehaveit.info/delivery-policy
- **Data Protection**: GDPR compliant, encrypted sensitive data
- **Cookie Policy**: Consent management

## Database Schema (Key Tables)

```
users
├── id (PK)
├── openId (OAuth)
├── name
├── email
├── phone
├── role (user/admin)
├── createdAt
└── updatedAt

products
├── id (PK)
├── name
├── description
├── price (KES)
├── quantity (stock)
├── category
├── image_url
├── createdAt
└── updatedAt

orders
├── id (PK)
├── userId (FK)
├── orderNumber
├── status (pending/confirmed/shipped/delivered)
├── totalAmount
├── paymentMethod
├── deliveryAddress
├── createdAt
└── updatedAt

order_items
├── id (PK)
├── orderId (FK)
├── productId (FK)
├── quantity
└── price

loyalty_points
├── id (PK)
├── userId (FK)
├── points
├── redeemed_points
├── lastUpdated
└── expiresAt

affiliates
├── id (PK)
├── userId (FK)
├── referralCode
├── totalEarnings
├── monthlyEarnings
├── rank (Bronze/Silver/Gold/Platinum)
├── status (pending/approved/suspended)
├── createdAt
└── updatedAt

affiliate_commissions
├── id (PK)
├── affiliateId (FK)
├── orderId (FK)
├── commissionAmount
├── status (pending/paid)
├── payoutDate
└── createdAt

support_tickets
├── id (PK)
├── userId (FK)
├── subject
├── description
├── status (open/in-progress/resolved)
├── priority (low/medium/high)
├── createdAt
└── updatedAt

guest_orders
├── id (PK)
├── phone
├── email
├── orderPin
├── orderNumber
├── status
├── createdAt
└── expiresAt (for PIN validity)
```

## Environment Variables (.env Configuration)

### Database & Core
```
DATABASE_URL=postgres://user:password@host:port/nuta
JWT_SECRET=your_jwt_secret_key
APP_URL=https://nuta.stevehaveit.info
OTP_PROVIDER=twilio
```

### Supabase (Storage & Auth)
```
SUPABASE_URL=https://eoaxnqmesecvvmypkbby.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Email & SMS
```
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=465
SMTP_USERNAME=info.stevehaveit@gmail.com
SMTP_PASSWORD=your_app_password

TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1XXXX

WHATSAPP_API_URL=https://api.whatsapp.com/...
WHATSAPP_API_TOKEN=your_whatsapp_token
```

### Payment Gateways
```
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://nuta.stevehaveit.info/api/payments/mpesa-callback

PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
```

### Storage & Media
```
CLOUDINARY_URL=cloudinary://key:secret@cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### AI Engine
```
AI_ENGINE=Ollama
AI_MODEL=llama3
AI_MODE=auto
AI_API_KEY=your_ai_api_key
AI_MONITOR_INTERVAL=15min
AI_DEBUG=true
AI_MARKETING_ENABLED=true
AI_SUGGESTION_INTERVAL_HOURS=24
AI_TRACK_AFFILIATE_PERFORMANCE=true
AI_AUTO_RANK_UP=true
AI_DETECT_FRAUD=true
AI_SEND_REPORTS=true
AI_ERROR_DETECTION=true
```

### Loyalty & Rewards
```
LOYALTY_POINTS_PER_KES=0.018
LOYALTY_POINT_VALUE_KES=3
SPIN_ENABLED=true
SPIN_REWARD_TIERS=5:100,10:200,20:500,30:1000
SPIN_FESTIVE_MODE=true
SPIN_FESTIVE_BONUS_PERCENT=15
GIVEAWAY_AUTO_MODE=true
GIVEAWAY_EMAIL_ALERTS=true
```

### Affiliate System
```
AFFILIATE_ENABLED=true
AFFILIATE_BASE_PERCENT=5
AFFILIATE_RANK_BONUS=2
AFFILIATE_PAYOUT_DAY=1
AFFILIATE_EMAIL_NOTIFICATIONS=true
AFFILIATE_ADMIN_APPROVAL_REQUIRED=true
```

### Marketing & UI
```
POPUP_ENABLED=true
POPUP_DISPLAY_FREQUENCY=7
BANNER_ROTATION_INTERVAL=10
AFFILIATE_PROMO_MESSAGE=Earn 5% on every referral you bring!
LOYALTY_PROMO_MESSAGE=Spend 500 KES and get 9 loyalty points!
```

### Admin & Management
```
ADMIN_EMAIL=admin@stevehaveit.info
ADMIN_AI_ASSISTANT=true
ADMIN_AUTO_BACKUP=true
ADMIN_BACKUP_INTERVAL_DAYS=7
ADMIN_REPORT_EMAIL=admin_reports@stevehaveit.info
CRM_ENABLED=true
CMS_ENABLED=true
INVENTORY_AUTO_ALERTS=true
ORDER_STATUS_UPDATES=true
```

### Security & Compliance
```
DATA_ENCRYPTION_ENABLED=true
GDPR_COMPLIANT=true
ANTI_FRAUD_MONITORING=true
CUSTOMER_DATA_PROTECTION=true
RETURN_POLICY_LINK=https://nuta.stevehaveit.info/return-policy
TERMS_AND_CONDITIONS_LINK=https://nuta.stevehaveit.info/terms
PRIVACY_POLICY_LINK=https://nuta.stevehaveit.info/privacy
DELIVERY_POLICY_LINK=https://nuta.stevehaveit.info/delivery-policy
```

### Currency & Exchange
```
EXCHANGE_API_ENABLED=true
EXCHANGE_API_KEY=free_currency_api_key
EXCHANGE_UPDATE_INTERVAL_HOURS=12
```

## Frontend Pages & Routes

1. **Landing Page** (`/`)
   - Hero section with brand story
   - Featured products
   - Value proposition
   - CTA buttons (Shop, Learn More)

2. **Product Catalog** (`/products`)
   - Product grid with filters
   - Search functionality
   - Product categories
   - Sorting options

3. **Product Details** (`/products/:id`)
   - Product images
   - Description, price, stock
   - Add to cart
   - Reviews/testimonials
   - Related products

4. **Shopping Cart** (`/cart`)
   - Cart items with quantities
   - Price summary
   - Proceed to checkout button

5. **Checkout** (`/checkout`)
   - Guest or registered flow
   - Shipping address
   - Payment method selection
   - Order review and confirmation

6. **User Dashboard** (`/dashboard`)
   - Welcome banner
   - Active orders
   - Loyalty points overview
   - Order history
   - Saved addresses
   - Affiliate status (if registered)

7. **My Orders** (`/dashboard/orders`)
   - Order list with status
   - Real-time tracking
   - Return request option

8. **Loyalty Points** (`/dashboard/loyalty`)
   - Points balance
   - Points history
   - Redemption options
   - Spin wheel access

9. **Affiliate Program** (`/dashboard/affiliate`)
   - Referral link
   - Earnings summary
   - Performance metrics
   - Payout history

10. **Support** (`/support`)
    - Contact form
    - Support ticket creation
    - FAQ section
    - Live chat (AI-powered)

11. **Admin Dashboard** (`/admin`)
    - Sales overview
    - Order management
    - Product management
    - Customer management
    - Analytics & reports
    - AI assistant panel

12. **Blog** (`/blog`)
    - Article list
    - Article details
    - Category filtering

13. **About** (`/about`)
    - Brand story
    - Team
    - Impact/mission

14. **Policies** (`/policies`)
    - Terms & Conditions
    - Privacy Policy
    - Return Policy
    - Delivery Policy

## API Endpoints (Backend)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/otp-request` - Request OTP for guest checkout
- `POST /api/auth/otp-verify` - Verify OTP

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order (admin)
- `GET /api/orders/:id/track` - Track order

### Payments
- `POST /api/payments/mpesa` - Initiate M-PESA payment
- `POST /api/payments/mpesa-callback` - M-PESA callback
- `POST /api/payments/paypal` - Initiate PayPal payment
- `POST /api/payments/paypal-callback` - PayPal callback

### Loyalty
- `GET /api/loyalty/points` - Get user loyalty points
- `POST /api/loyalty/redeem` - Redeem points
- `GET /api/loyalty/spin-wheel` - Get spin wheel eligibility
- `POST /api/loyalty/spin` - Spin the wheel

### Affiliates
- `POST /api/affiliates/register` - Register as affiliate
- `GET /api/affiliates/dashboard` - Get affiliate stats
- `GET /api/affiliates/earnings` - Get earnings summary
- `POST /api/affiliates/payout-request` - Request payout

### Support
- `POST /api/support/tickets` - Create support ticket
- `GET /api/support/tickets` - List user tickets
- `GET /api/support/tickets/:id` - Get ticket details
- `POST /api/support/chat` - Send chat message (AI)

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/customers` - List all customers
- `GET /api/admin/orders` - List all orders
- `GET /api/admin/analytics` - Analytics data
- `POST /api/admin/ai-assistant` - AI assistant commands

## Implementation Phases

### Phase 1 (MVP)
- Guest checkout with phone OTP
- M-PESA payment integration
- Guest order tracking via PIN
- Admin guest verification queue
- Basic customer dashboard

### Phase 2
- Registered user accounts
- Loyalty points system
- Saved addresses
- Email receipts
- WhatsApp notifications
- Live chat support

### Phase 3
- Advanced fraud detection
- AI customer support agent
- Subscription orders
- Advanced analytics
- Multi-currency support
- Affiliate system enhancements

## Key Integration Points

1. **Manus OAuth**: User authentication
2. **Supabase**: Database, storage, realtime
3. **M-PESA**: Payment processing (STK Push)
4. **PayPal**: International payments
5. **Twilio**: SMS/WhatsApp notifications
6. **Gmail API**: Email notifications
7. **Cloudinary**: Image storage and optimization
8. **Ollama/DeepSeek**: AI engine for recommendations and fraud detection
9. **Vercel/Render**: Deployment and hosting

## Design Principles

- **Simplicity**: Easy navigation, clear CTAs
- **Storytelling**: Brand narrative throughout
- **Scalability**: Modular architecture for growth
- **Mobile-First**: Responsive design for all devices
- **Accessibility**: WCAG compliance
- **Performance**: Fast load times, optimized images
- **Security**: Encrypted data, HTTPS, CSRF protection
- **Localization**: Support for KES currency, local payment methods

## Success Metrics

- Conversion rate (cart to order)
- Average order value
- Customer retention rate
- Loyalty program engagement
- Affiliate program growth
- Support ticket resolution time
- Website uptime and performance
- Customer satisfaction (CSAT)
