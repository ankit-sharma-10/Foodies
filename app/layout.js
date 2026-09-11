import { Quicksand, Montserrat } from 'next/font/google';
import './globals.css';
import MainHeader from '@/components/main-header/main-header';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-body',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-heading',
});

export const metadata = {
  title: {
    default: 'NextLevel Food',
    template: '%s | NextLevel Food',
  },
  description: 'Delicious meals, shared by a food-loving community.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${quicksand.variable} ${montserrat.variable}`}>
      <body>
        <MainHeader />
        {children}
      </body>
    </html>
  );
}
