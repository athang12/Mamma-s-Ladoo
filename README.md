# 🎨 Custom Acrylic E-Commerce Platform

A modern, full-stack e-commerce platform for selling custom acrylic products with **automated UPI payment verification** using SMS - perfect for personal savings accounts!

## ✨ Key Highlights

### 💳 Revolutionary Payment System (NEW!)
- **UPI SMS Payments** - Works with personal savings account! ⭐
- Auto-verification via Android SMS (2-5 seconds)
- **Zero transaction fees** - Save ₹10,000+ annually!
- All UPI apps supported (GPay, PhonePe, Paytm, etc.)
- 100% automated with real-time confirmation

## 🎯 Features

### 🛍️ E-Commerce
- Multi-theme product catalog (Anime, Motivation, Aesthetic, Valentine)
- Product filtering and search
- Shopping cart with persistence
- Custom image upload and overlay
- Order tracking
- Admin panel for products and orders
- **Product Customization**: Support for customizable products
- **Responsive**: Mobile-first design that works on all devices
- **Performance**: Built with Next.js 14 App Router for optimal performance

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistent storage
- **Database**: Prisma with PostgreSQL (schema included)
- **Icons**: Lucide React
- **Payment**: Stripe integration ready

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL (for production)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   - Database URL (PostgreSQL)
   - Stripe API keys (for payment processing)

3. **Initialize the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗂️ Project Structure

```
├── app/                    # Next.js 14 App Router pages
│   ├── layout.tsx         # Root layout with header/footer
│   ├── page.tsx           # Homepage
│   ├── products/          # Product listing and details
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   ├── about/             # About page
│   └── contact/           # Contact page
├── components/            # Reusable React components
│   ├── Header.tsx        # Navigation header
│   ├── Footer.tsx        # Site footer
│   ├── Hero.tsx          # Homepage hero section
│   ├── ProductCard.tsx   # Product display card
│   └── ...
├── lib/                   # Utilities and configurations
│   ├── store.ts          # Zustand cart store
│   └── data.ts           # Sample product data
├── prisma/               # Database schema
│   └── schema.prisma
└── public/               # Static assets

```

## 🎯 Key Features Explained

### Shopping Cart
- Persistent storage using Zustand with localStorage
- Add/remove items, update quantities
- Automatic total calculation
- Free shipping on orders $50+

### Product Customization
- Optional customization text for eligible products
- Custom notes saved with cart items
- Displayed in cart and checkout

### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly interface
- Hamburger menu on mobile

### Categories
- Acrylic Stands
- Wall Frames
- Fridge Magnets

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 🔧 Customization

### Adding Products
Edit `lib/data.ts` to add more products or connect to a real database using the Prisma schema.

### Styling
- Colors are defined in `tailwind.config.ts`
- Global styles in `app/globals.css`
- Component-specific styles use Tailwind utility classes

### Payment Integration
The Stripe integration is ready to be connected. Add your Stripe keys to `.env` and implement the payment API routes.

## 📝 Todo

- [ ] Implement Stripe payment processing
- [ ] Add user authentication
- [ ] Create admin dashboard for product management
- [ ] Add product reviews and ratings
- [ ] Implement search functionality
- [ ] Add wishlist feature
- [ ] Email notifications for orders

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 💬 Support

For questions or support, please contact hello@acrylicdecor.com

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
