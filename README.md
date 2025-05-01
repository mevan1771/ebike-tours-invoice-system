# E-Bike Tours Invoice System

A comprehensive tour management system for e-bike tour companies, allowing for the management of tours, invoices, hotels, transportation, and pricing.

## Features

- Tour management
- Customer information tracking
- Hotel management
- Transport options
- Rate calculation
- Invoice generation

## Live Demo

You can view the live demo at: [https://ebike-inv-system.vercel.app](https://ebike-inv-system.vercel.app)

## Tech Stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **UI Components:** Headless UI, React Hook Form
- **State Management:** React Hooks (useState, useEffect)
- **Notifications:** React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ebike-inv-system.git
   cd ebike-inv-system
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ebike-inv-system/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js app router
│   │   ├── api/        # API routes
│   │   ├── hotels/     # Hotels management page
│   │   ├── transport/  # Transport management page
│   │   ├── rates/      # Rates configuration page
│   │   ├── new-invoice/ # New tour creation page
│   │   ├── rider-info/ # Rider information page
│   │   └── test/       # Test page (demonstrates mock data)
│   ├── components/     # Reusable components
│   └── lib/            # Utility functions and data
│       ├── mockData.ts # Mock data for Vercel deployment
└── package.json        # Project dependencies
```

## Deployment

### Deploying to Vercel

This project is configured for easy deployment to Vercel.

1. Fork this repository
2. Create a new project on [Vercel](https://vercel.com)
3. Import your fork from GitHub
4. Deploy!

The project is currently set up to use mock data so it can run without any external dependencies.

### Database Setup (Future)

When you're ready to connect to a real database:

1. Create a Supabase project
2. Run the schema.sql script to set up your tables and security policies
3. Update the environment variables with your Supabase credentials
4. Uncomment the Supabase client in src/lib/supabase.ts

## Environment Variables

For local development, create a `.env.local` file with these variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
