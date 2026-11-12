import Link from 'next/link';
import { ReactNode } from 'react';
import { LogoTextComponent } from '@gitroom/frontend/components/ui/logo-text.component';
import { brand } from '@gitroom/helpers/utils/brand';

export const SiteHeader = () => (
  <header className="sticky top-0 z-[50] backdrop-blur-md bg-[#0B0B10]/80 border-b border-white/[0.06]">
    <div className="mx-auto max-w-[1160px] px-[20px] h-[64px] flex items-center justify-between">
      <Link href="/" aria-label={brand.name}>
        <LogoTextComponent />
      </Link>
      <nav className="hidden md:flex items-center gap-[28px] text-[14px] text-[#B4B4C2]">
        <a href="/#features" className="hover:text-white">Features</a>
        <a href="/#how" className="hover:text-white">How it works</a>
        {!!process.env.STRIPE_PUBLISHABLE_KEY && (
          <a href="/#pricing" className="hover:text-white">Pricing</a>
        )}
        <a href="/#faq" className="hover:text-white">FAQ</a>
      </nav>
      <div className="flex items-center gap-[10px] text-[14px]">
        <Link href="/auth/login" className="px-[12px] h-[38px] flex items-center text-[#D6D6E0] hover:text-white">
          Sign in
        </Link>
        <Link
          href="/auth"
          className="px-[16px] h-[38px] flex items-center rounded-[10px] bg-[#5B5BF0] hover:bg-[#4a4ae0] font-[600] transition-colors"
        >
          {process.env.STRIPE_PUBLISHABLE_KEY ? 'Start free trial' : 'Get started'}
        </Link>
      </div>
    </div>
  </header>
);

export const SiteFooter = () => (
  <footer className="border-t border-white/[0.06] mt-[96px]">
    <div className="mx-auto max-w-[1160px] px-[20px] py-[36px] flex flex-col md:flex-row gap-[20px] md:items-center justify-between text-[13px] text-[#8A8A99]">
      <div className="flex flex-col gap-[8px]">
        <LogoTextComponent />
        <div>
          © {new Date().getFullYear()} {brand.name}. Built on open-source software
          licensed under AGPL-3.0.
        </div>
      </div>
      <div className="flex flex-wrap gap-[20px]">
        <Link href="/terms" className="hover:text-white">Terms</Link>
        <Link href="/privacy" className="hover:text-white">Privacy</Link>
        <a href={brand.sourceUrl} target="_blank" rel="noreferrer" className="hover:text-white">
          Source code
        </a>
        <a href={`mailto:${brand.supportEmail}`} className="hover:text-white">Contact</a>
      </div>
    </div>
  </footer>
);

export const LegalPage = ({ title, children }: { title: string; children: ReactNode }) => (
  <>
    <SiteHeader />
    <main className="mx-auto max-w-[760px] px-[20px] py-[64px]">
      <h1 className="text-[36px] font-[600] tracking-[-0.02em] mb-[24px]">{title}</h1>
      <div className="flex flex-col gap-[16px] text-[15px] leading-[1.7] text-[#C9C9D4] [&_h2]:text-white [&_h2]:text-[20px] [&_h2]:font-[600] [&_h2]:mt-[16px]">
        {children}
      </div>
    </main>
    <SiteFooter />
  </>
);
