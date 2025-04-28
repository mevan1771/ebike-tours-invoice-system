'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            {children}
          </main>
          <Toaster position="top-right" />
        </div>
      </body>
    </html>
  );
}
