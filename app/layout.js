import { Analytics } from '@vercel/analytics/react'; // Impor Analytics
import { SpeedInsights } from "@vercel/speed-insights/next";  // Impor SpeedInsights
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata = {
  title: 'OnLasdan',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics /> {/* Tambahkan Analytics di sini */}
        <SpeedInsights /> {/* Tambahkan SpeedInsights di sini */}
      </body>
    </html>
  );
}