import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { siteConfig } from '@/lib/data';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Personal Site', template: '%s | Personal Site' },
  description: 'Projects, travel, music, and blog.',
  openGraph: { type: 'website' },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = siteConfig.get();
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans min-h-screen flex flex-col">
        <Header config={config.header} />
        <main className="flex-1">{children}</main>
        <Footer config={config.footer} />
        <BackToTop />
      </body>
    </html>
  );
}
