import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Clawsco' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
