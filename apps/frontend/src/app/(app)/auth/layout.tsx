import { getT } from '@gitroom/react/translation/get.translation.service.backend';

export const dynamic = 'force-dynamic';
import { ReactNode } from 'react';
import loadDynamic from 'next/dynamic';
import { brand } from '@gitroom/helpers/utils/brand';
import { AttributionComponent } from '@gitroom/frontend/components/auth/attribution.component';
import { LogoTextComponent } from '@gitroom/frontend/components/ui/logo-text.component';
import { MantineWrapper } from '@gitroom/react/helpers/mantine.wrapper';
import { Toaster } from '@gitroom/react/toaster/toaster';
const ReturnUrlComponent = loadDynamic(() => import('./return.url.component'));
export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t = await getT();

  return (
    <MantineWrapper>
      <Toaster />
      <div className="bg-[#0E0E0E] flex flex-1 p-[12px] gap-[12px] min-h-screen w-screen text-white">
        {/*<style>{`html, body {overflow-x: hidden;}`}</style>*/}
        <ReturnUrlComponent />
        <AttributionComponent />
        <div className="flex flex-col py-[40px] px-[20px] flex-1 lg:w-[600px] lg:flex-none rounded-[12px] text-white p-[12px] bg-[#1A1919]">
          <div className="w-full max-w-[440px] mx-auto justify-center gap-[20px] h-full flex flex-col text-white">
            <LogoTextComponent />
            <div className="flex">{children}</div>
          </div>
        </div>
        <div className="flex-1 hidden lg:flex flex-col justify-center px-[64px] gap-[40px] rounded-[12px] bg-[radial-gradient(120%_90%_at_100%_0%,#23235a_0%,#111118_55%,#0E0E0E_100%)]">
          <div className="text-[44px] leading-[1.1] font-[600] tracking-[-0.03em] max-w-[560px]">
            One calendar for every channel you post to.
          </div>
          <div className="flex flex-col gap-[22px] max-w-[520px] text-[16px] text-[#C9C9D4]">
            {[
              ['Compose once', 'Write a post, tailor it per platform, and preview each one before it goes out.'],
              ['Queue the week', 'Drop posts on the calendar or let the queue fill your posting slots.'],
              ...(process.env.OPENAI_API_KEY
                ? [['AI when you want it', 'Turn a topic into a week of drafts or a handful of variations.']]
                : [['Drafts', 'Park ideas as drafts and schedule them when they are ready.']]),
              ['See what worked', 'Reach and engagement per channel, pulled from the platforms.'],
            ].map(([title, text]) => (
              <div key={title} className="flex gap-[14px]">
                <div className="mt-[7px] w-[8px] h-[8px] min-w-[8px] rounded-full bg-[#C8F560]" />
                <div>
                  <div className="text-white font-[600]">{title}</div>
                  <div>{text}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-[13px] text-[#8A8A99]">{brand.tagline}</div>
        </div>
      </div>
    </MantineWrapper>
  );
}
