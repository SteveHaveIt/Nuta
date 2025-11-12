# Nuta Website - Complete Company Profile & Specifications

## Company Information

**Parent Organization:** Steve Have It Enterprise Hub
**Founder & CEO:** Stephen M. Ngari (Steve Have It)
**Location:** Embakasi, Nairobi, Kenya
**Website:** www.stevehaveit.info
**Email:** info.stevehaveit@gmail.com
**Copyright:** © 2025 Steve Have It. All rights reserved.

## Brand Mission & Vision

**Mission Statement:**
To inspire and empower communities by creating opportunities, fostering entrepreneurship, and building innovative businesses that drive growth, uplift lives, and leave a lasting impact for generations to come.

**Vision Statement:**
To build a world-class, African-made peanut products brand that inspires health, community growth, and innovation—powered by digital commerce and storytelling under the Steve Have It brand.

**Core Philosophy:**
1. **Simplicity** – Easy for anyone to navigate, buy, or learn
2. **Storytelling** – Every page tells a piece of the Nuta journey
3. **Scalability** – Built on systems that can grow into a global platform

**Core Values:**
- **Authenticity:** Real ingredients, real stories, real impact
- **Innovation:** Smart technology, simple processes, AI-driven experience
- **Community:** Collaboration with farmers, youth, and local creators
- **Quality:** Every product and interaction reflects trust and excellence

## Nuta Brand Profile

**Brand Name:** Nuta
**Tagline:** "The taste of real Kenyan peanuts. Healthy. Honest. Homegrown."
**Brand Story:** Nuta is more than a peanut brand—it's the beginning of a dream to build something greater from the smallest seed. It represents a journey from humble beginnings in Embakasi, Nairobi, to the creation of a digital business ecosystem designed to inspire a new generation of entrepreneurs.

**Purpose:**
1. **Sell Products Online** – Offer peanut butter, roasted peanuts, and future peanut-based products for local and international buyers
2. **Tell the Nuta Story** – Share the brand's journey from humble beginnings to a growing enterprise
3. **Educate & Engage** – Feature health benefits, recipe ideas, and blog content
4. **Promote Community Impact** – Showcase Nuta's mission to empower small farmers and create jobs
5. **Drive Brand Growth** – Integrate marketing campaigns, affiliate programs, and loyalty systems

## Target Audience

### Primary Target Markets:
1. **Health-Conscious Consumers** – Individuals and families seeking natural, protein-rich, affordable peanut products
2. **Retailers & Distributors** – Local supermarkets, mini-marts, and health food stores
3. **Youth & Digital Consumers** – Young people active on social media, engaged in challenges and giveaways
4. **Export Market** – Kenyans abroad and international buyers attracted to African organic products

### Market Positioning:
- **Core Market:** Kenya and East Africa (Nairobi, Mombasa, Kisumu first)
- **Expansion Plan:** Regional (East African) online distribution, then global via international shipping
- **Positioning:** Premium yet affordable, authentic, health-focused peanut products

## Social Media & Contact Channels

| Channel | Link | Purpose |
|---------|------|---------|
| WhatsApp | https://wa.me/254742101089 | Customer support, inquiries |
| TikTok | https://tiktok.com/@Steve_have_it | Brand storytelling, challenges, viral content |
| YouTube | https://www.youtube.com/channel/UCdtGEQH1HZrBcdW8ZHt6ejQ | Product demos, recipes, brand story |
| Telegram | https://t.me/Steve_Have_It | Community updates, announcements |
| Website | www.stevehaveit.info | Main hub |
| Email | info.stevehaveit@gmail.com | Official inquiries |

## Website Pages & Structure

### Main Pages:
1. **Home** – Hero section, featured products, brand story intro, loyalty/affiliate CTAs
2. **Shop** – Product catalog with filters, search, categories
3. **Product Details** – Full product info, pricing, reviews, add to cart
4. **About** – Company profile, founder story, mission, team, impact metrics
5. **Blog/Vlog** – Articles, recipes, health tips, brand updates
6. **Contact** – Contact form, email, WhatsApp, social links
7. **Policies** – Terms & Conditions, Privacy Policy, Return Policy, Delivery Policy

### Admin Pages:
1. **Admin Dashboard** – Overview, metrics, alerts
2. **Product Management** – CRUD operations, inventory
3. **Order Management** – Order tracking, status updates
4. **Customer Management** – CRM, customer profiles, communication
5. **Marketing** – Campaigns, spin wheel, coupons, affiliate management
6. **Analytics** – Traffic, revenue, conversions, customer insights
7. **Settings** – Website config, payment setup, shipping, maintenance

## Products

### Current Product Line:
1. **Peanut Butter** – Natural, protein-rich
2. **Roasted Peanuts** – Salted and unsalted varieties
3. **Future Products** – Peanut-based snacks and supplements (planned)

### Product Attributes:
- **Price Range:** KES 300 - KES 2,500 (subject to product type)
- **Packaging:** Eco-friendly, branded
- **Availability:** Local (Kenya) and international shipping
- **Certifications:** Natural, no additives/preservatives

## Technical Stack

### Frontend:
- React 19 + Tailwind CSS 4
- Responsive, mobile-first design
- SEO-optimized
- Social media integration

### Backend:
- Express.js + tRPC
- Node.js runtime
- Secure authentication

### Database:
- Supabase (PostgreSQL)
- Real-time capabilities
- Backup & security

### Integrations:
- **Payments:** M-PESA (STK Push), PayPal
- **Email:** Gmail SMTP
- **SMS/WhatsApp:** Twilio
- **AI:** Ollama/DeepSeek for recommendations and fraud detection
- **Storage:** Cloudinary for product images
- **Analytics:** Built-in dashboard

## Key Features

### E-Commerce:
- Product catalog with search and filters
- Shopping cart and checkout (guest and registered)
- Order tracking with PIN verification for guests
- Multiple payment methods (M-PESA, PayPal)

### Loyalty & Rewards:
- Loyalty points system (KES 500 = 9 points)
- Spin wheel for rewards (KES 100, 200, 500, 1000)
- Festive mode with +15% bonus
- Giveaway auto-mode

### Affiliate Program:
- 5% base commission
- Rank bonuses (Gold/Platinum +2%)
- Monthly payouts (1st of month)
- Affiliate dashboard and earnings tracking

### Marketing Automation:
- Flash sales and promotions
- Email and WhatsApp campaigns
- AI-driven recommendations
- Fraud detection
- Marketing synchronization

### CRM & Support:
- Customer management system
- Support ticket system
- AI chatbot for FAQs
- Live chat interface
- Communication tracking

### Admin Console:
- Comprehensive dashboard
- AI-powered insights and suggestions
- Automated error detection
- Inventory alerts
- Performance monitoring

## Environment Variables (.env)

### Core Configuration:
```
APP_NAME=NUTA
APP_ENV=production
APP_URL=https://nuta.stevehaveit.info
APP_DEBUG=false
```

### Database:
```
DB_CONNECTION=postgresql
DB_HOST=supabase_host_url
DB_PORT=5432
DB_DATABASE=nuta_db
DB_USERNAME=nuta_admin
DB_PASSWORD=secure_password_here
```

### Authentication:
```
JWT_SECRET=generate_a_strong_secret_key
SESSION_EXPIRY_HOURS=48
ALLOW_GUEST_CHECKOUT=true
GUEST_CHECKOUT_LIMIT=2
```

### Loyalty & Rewards:
```
LOYALTY_ENABLED=true
LOYALTY_POINTS_PER_500KES=9
LOYALTY_POINT_VALUE=3
LOYALTY_WITHDRAWAL_PERIOD_DAYS=3
LOYALTY_NOTIFICATION_EMAIL=info.stevehaveit@gmail.com
```

### Spin Wheel & Giveaways:
```
SPIN_ENABLED=true
SPIN_REWARD_TIERS=5:100,10:200,20:500,30:1000
SPIN_FESTIVE_MODE=true
SPIN_FESTIVE_BONUS_PERCENT=15
GIVEAWAY_AUTO_MODE=true
GIVEAWAY_EMAIL_ALERTS=true
```

### Affiliate System:
```
AFFILIATE_ENABLED=true
AFFILIATE_BASE_PERCENT=5
AFFILIATE_RANK_BONUS=2
AFFILIATE_PAYOUT_DAY=1
AFFILIATE_EMAIL_NOTIFICATIONS=true
AFFILIATE_ADMIN_APPROVAL_REQUIRED=true
```

### AI Marketing Automation:
```
AI_MARKETING_ENABLED=true
AI_MODEL=ollama/llama3
AI_SUGGESTION_INTERVAL_HOURS=24
AI_TRACK_AFFILIATE_PERFORMANCE=true
AI_AUTO_RANK_UP=true
AI_DETECT_FRAUD=true
AI_SEND_REPORTS=true
```

### Marketing & UI Popups:
```
POPUP_ENABLED=true
POPUP_DISPLAY_FREQUENCY=7
BANNER_ROTATION_INTERVAL=10
AFFILIATE_PROMO_MESSAGE="Earn 5% on every referral you bring!"
LOYALTY_PROMO_MESSAGE="Spend 500 KES and get 9 loyalty points!"
```

### Payments:
```
PAYMENT_MPESA_ENABLED=true
PAYMENT_MPESA_API_KEY=your_mpesa_api_key
PAYMENT_MPESA_SHORTCODE=your_short_code
PAYMENT_PAYPAL_ENABLED=true
PAYMENT_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYMENT_PAYPAL_SECRET=your_paypal_secret
```

### Currency & Exchange:
```
DEFAULT_CURRENCY=KES
DEFAULT_CURRENCY_SYMBOL=KSh
CURRENCY_FORMAT=0,0.00
TIMEZONE=Africa/Nairobi
LANGUAGE=en
EXCHANGE_API_ENABLED=true
EXCHANGE_API_KEY=free_currency_api_key
EXCHANGE_UPDATE_INTERVAL_HOURS=12
```

### Admin & Management:
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
AI_ERROR_DETECTION=true
```

### Security & Compliance:
```
DATA_ENCRYPTION_ENABLED=true
GDPR_COMPLIANT=true
ANTI_FRAUD_MONITORING=true
CUSTOMER_DATA_PROTECTION=true
RETURN_POLICY_LINK=https://nuta.stevehaveit.info/return-policy
TERMS_AND_CONDITIONS_LINK=https://nuta.stevehaveit.info/terms
```

## Deployment Targets

- **Frontend:** Vercel (https://nuta-frontend.vercel.app)
- **Backend:** Render (https://nuta-backend.render.com)
- **Database:** Supabase (Managed PostgreSQL)
- **Repository:** GitHub (SteveHaveIt/Nuta)

## Success Metrics

- User registration and engagement
- Product sales and revenue
- Customer retention and loyalty points usage
- Affiliate program performance
- Marketing campaign ROI
- Customer satisfaction and support metrics
- Website traffic and SEO rankings
