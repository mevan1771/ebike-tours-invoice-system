# E-Bike Tours Invoice System

A comprehensive web application for managing e-bike tour invoices, hotel accommodations, and transport options.

![E-Bike Tours Invoice System](public/images/logo.jpg)

## Features

- **Invoice Management**: Create, view, and manage customer invoices
- **Hotel Management**: Add and manage hotel accommodations for tours
- **Transport Management**: Add and manage transport options for tours
- **Rate Calculator**: Calculate total tour costs including bike rentals, accommodations, and extras
- **Tour Information**: Manage tour details and rider information
- **Multi-currency Support**: Switch between USD, EUR, GBP, and LKR

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/mevan1771/ebike-tours-invoice-system.git
   cd ebike-tours-invoice-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Create the database schema:
   - Copy the contents of `schema.sql`
   - Execute the SQL in the Supabase SQL Editor

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploying to Vercel

### Step 1: Connect your GitHub Repository

1. Sign up/Log in to [Vercel](https://vercel.com/)
2. Click "New Project"
3. Import your GitHub repository (ebike-tours-invoice-system)
4. Vercel will automatically detect that it's a Next.js project

### Step 2: Configure Environment Variables

Add the following environment variables in the Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anonymous key

### Step 3: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your application
3. Once deployed, Vercel will provide you with a production URL

### Step 4: Connect Custom Domain (Optional)

1. In your Vercel project, go to "Settings" > "Domains"
2. Add your custom domain and follow the verification steps

## Database Setup

The application uses Supabase as the database. The schema includes tables for:

- `users` - Staff/admin accounts
- `customers` - Customer information
- `products` - E-bike details
- `invoices` - Invoice records
- `invoice_items` - Line items for invoices
- `hotels` - Hotel accommodation options
- `transport` - Transport options

Run the `schema.sql` file in your Supabase SQL Editor to set up the database schema and Row Level Security policies.

## Project Structure

- `/src/app` - Next.js application routes and pages
- `/src/components` - Reusable React components
- `/src/lib` - Utilities and library configurations
- `/prisma` - Database schema and client
- `/public` - Static assets
- `/schema.sql` - Database schema for Supabase

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
