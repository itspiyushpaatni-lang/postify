import '../global.scss';
import { ReactNode } from 'react';
import clsx from 'clsx';
import { Metadata } from 'next';
import { jakartaSans } from '@gitroom/frontend/fonts/plus-jakarta-sans/plus.jakarta.sans.font';
import { brand } from '@gitroom/helpers/utils/brand';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `${brand.name} — schedule social posts for every channel`,
  description: brand.tagline,
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={clsx(
          jakartaSans.className,
          'dark !bg-[#0B0B10] text-white antialiased'
        )}
      >
        {children}
      </body>
    </html>
  );
}
