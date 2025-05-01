# E-Bike Tours Invoice System

A comprehensive management system for e-bike tour companies to handle tour bookings, customer tracking, hotel accommodation, transport options, rate calculations, and invoice generation.

## Features

- **Tour Management**: Create and manage e-bike tours with flexible date ranges
- **Customer Tracking**: Maintain a database of customers and their information
- **Hotel Management**: Store hotel details including rates, location, and star ratings
- **Transport Options**: Manage various transport modes for tour logistics
- **Rate Calculation**: Auto-calculate tour rates based on accommodations, transport, and equipment
- **Invoice Generation**: Create professional invoices for tours

## Demo

Check out the live demo of the application [here](https://ebike-tours-invoice-system.vercel.app/) (available after deployment).

## Tech Stack

- **Frontend Framework**: Next.js 15 with App Router
- **UI Library**: React 18
- **Programming Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Mock data (ready for Supabase integration)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mevan1771/ebike-tours-invoice-system.git
   cd ebike-tours-invoice-system
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

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/public`: Static assets like images and icons
- `/src`: Source code
  - `/app`: Next.js 15 App Router files and API routes
  - `/components`: Reusable React components
  - `/lib`: Utility functions and shared code
  - `/styles`: Global CSS styles

## Deployment

### Deploying to Vercel

The easiest way to deploy the application is through Vercel:

1. Fork this repository to your GitHub account
2. Create a new project on [Vercel](https://vercel.com)
3. Import your GitHub repository
4. No environment variables are required for initial deployment as the app uses mock data
5. Click "Deploy"

### Data Storage

The application currently uses mock data that persists during the user session but resets on page refresh. This approach allows for easy deployment without database setup.

#### Future Database Setup

To connect the application to a real database (Supabase):

1. Create a Supabase account and project
2. Execute the SQL commands from `schema.sql` to set up your tables
3. Update the `src/lib/supabase.ts` file to use your Supabase credentials
4. Configure environment variables in your Vercel project:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Local Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

## Testing

To verify the mock data system is working correctly, visit the `/test` page after deployment.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.