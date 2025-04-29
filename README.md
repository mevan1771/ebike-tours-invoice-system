# E-Bike Tours Invoice System

A comprehensive invoice management system designed specifically for e-bike tour operators. Streamline your tour booking process, manage customer information, handle pricing, and generate professional invoices all in one place.

## Features

- **Tour Management**: Create and manage tours with detailed information
- **Customer Management**: Store and retrieve customer details
- **Dynamic Pricing**: Configure accommodation, bike rental, transport, and additional services
- **Invoice Generation**: Create professional invoices with detailed breakdowns
- **Invoice Tracking**: Track invoice status (pending, paid, cancelled)
- **Hotel Management**: Manage your network of partner hotels
- **Transport Management**: Organize different transport options
- **Custom Settings**: Configure company details, currency, and invoice templates

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ebike-inv-system.git
   cd ebike-inv-system
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Initialize the database:
   - Run the SQL commands in `schema.sql` in your Supabase SQL editor

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Creating a Tour Invoice

1. Go to "New Tour" in the sidebar
2. Enter tour details (name, dates, invoice number)
3. Add rider/group information
4. Configure rates and pricing (accommodation, bike rentals, transport, services)
5. Preview the invoice
6. Finalize to save the invoice

### Managing Invoices

- View all invoices on the "All Invoices" page
- Track payment status and update invoice status
- Print or download invoices

### Configuring Settings

- Update company information
- Set default currency
- Configure VAT/tax settings

## Project Structure

- `/src/app` - Main application components and pages
- `/src/app/api` - API routes for data handling
- `/src/components` - Reusable UI components
- `/schema.sql` - Database schema definition

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
