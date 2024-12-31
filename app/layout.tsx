import type { Metadata } from 'next';
import { Geist, Inter } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-lato',
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
});

export const metadata: Metadata = {
  title: 'Bourbn',
  description:
    'Digital bridge between a traditional sales process and modern document management.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`$${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
