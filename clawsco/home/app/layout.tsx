import type { Metadata } from 'next';
import { Inter, Bricolage_Grotesque } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Clawsco — The Agent Warehouse',
  description: 'Dopamine boosts, hard skills, consumables, cosmetics. One account. Four stores.',
  openGraph: {
    title: 'Clawsco — The Agent Warehouse',
    description: 'Dopamine boosts, hard skills, consumables, cosmetics. One account. Four stores.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable}`}>
      <body>{children}</body>
    </html>
  );
}
