# Food Order Platform

A modern food delivery platform built with Next.js, TypeScript, Tailwind CSS, Supabase, and Prisma.

## Features

- 🛒 Browse and order food from various categories
- 🛍️ Shopping cart with persistent storage
- 🔐 User authentication with Supabase
- 💳 Payment integration with Chapa
- 📱 Responsive design
- 👨‍💼 Admin panel for managing foods and orders
- 📊 Order tracking and history

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Payment**: Chapa
- **State Management**: Zustand
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Chapa account (for payments)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd food-order-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database URLs (for Prisma)
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url

# App URL (required for payment callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Chapa Secret Key (required for payment processing)
CHAPA_SECRET_KEY=your_chapa_secret_key
```

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with sample data
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main tables:
- `profiles` - User profiles (extends auth.users)
- `categories` - Food categories
- `foods` - Food items
- `orders` - Customer orders
- `addresses` - Delivery addresses
- `reviews` - Food reviews

## API Routes

- `GET /api/foods` - Get all foods (with filtering)
- `POST /api/foods` - Create new food (admin only)
- `POST /api/pay` - Initialize payment with Chapa
- `POST /api/verify` - Verify payment callback

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── cart/              # Cart page
│   ├── checkout/          # Checkout page
│   └── ...
├── components/            # React components
│   ├── ui/               # UI components
│   ├── food/             # Food-related components
│   └── ...
├── lib/                  # Utility libraries
├── store/                # Zustand stores
├── types/                # TypeScript types
└── prisma/               # Database schema and seeds
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## Deployment

### Vercel

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Other Platforms

Make sure to:
- Set all environment variables
- Run database migrations
- Configure payment callbacks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.# food-delivery
