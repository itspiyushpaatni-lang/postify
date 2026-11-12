import Link from 'next/link';
import {
  SiteFooter,
  SiteHeader,
} from '@gitroom/frontend/components/marketing/site.chrome';
import { brand } from '@gitroom/helpers/utils/brand';
import {
  pricing,
  sellableTiers,
} from '@gitroom/nestjs-libraries/database/prisma/subscriptions/pricing';

// Billing is on only when Stripe keys are configured; without them the app is free.
const paid = !!process.env.STRIPE_PUBLISHABLE_KEY;
// AI copy is shown only when an AI provider key is configured.
const ai = !!process.env.OPENAI_API_KEY;

const channels = [
  'X',
  'LinkedIn',
  'Instagram',
  'Facebook',
  'Threads',
  'TikTok',
  'YouTube',
  'Pinterest',
  'Reddit',
  'Bluesky',
  'Mastodon',
  'Telegram',
  'Discord',
  'Google Business',
];

const features = [
  {
    title: 'Compose once, publish everywhere',
    text: 'Write one post, then adjust the copy, media and settings per channel without starting over.',
  },
  {
    title: 'Calendar and queue',
    text: 'Drag posts around a day, week or month view, or set posting slots and let the queue fill them.',
  },
  {
    title: 'Per-platform preview',
    text: 'See how the post will look on each network, with character limits checked before it ships.',
  },
  ai
    ? {
        title: 'A week of content from one topic',
        text: 'Give the AI a topic and get seven drafts on your calendar, or a set of variations of a single post.',
      }
    : {
        title: 'Media library',
        text: 'Upload images and video once and reuse them across posts and channels.',
      },
  {
    title: 'Drafts and approvals',
    text: 'Keep ideas as drafts, share a preview link, and invite teammates when you are ready.',
  },
  {
    title: 'Analytics per channel',
    text: 'Reach and engagement pulled straight from each platform, next to the posts that earned them.',
  },
];

const steps = [
  ['Connect', 'Sign in to your social accounts with their official OAuth flows.'],
  ['Plan', ai ? 'Write posts yourself or start from an AI-drafted week.' : 'Write your posts and place them on the calendar or in the queue.'],
  ['Publish', 'Posts go out at the scheduled time, then show up in analytics.'],
];

const faq = [
  [
    'Which networks can I connect?',
    `${channels.slice(0, 8).join(', ')} and more. Each network needs its own developer app credentials on the server, so the list you see depends on what has been configured.`,
  ],
  paid
    ? [
        'Is there a free trial?',
        'Yes. Paid plans start with a 7-day trial and you can cancel from the billing page at any time.',
      ]
    : ['What does it cost?', 'Nothing. Every feature is included for free.'],
  [
    'Do you store my passwords?',
    'No. Accounts are connected through each platform’s OAuth flow, so we only hold the access token the platform issues.',
  ],
  [
    'Can my team use it?',
    paid
      ? 'Team seats are part of the Pro plan. Each teammate gets their own login to the shared workspace.'
      : 'Yes. Invite teammates and each one gets their own login to the shared workspace.',
  ],
];

const mock: Array<[string, string, string] | null>[] = [
  [['9:00', 'LinkedIn', 'Launch recap: 3 things we learned'], null, ['17:30', 'X', 'Thread: pricing page teardown']],
  [null, ['12:00', 'Instagram', 'Behind the scenes reel'], null],
  [['8:30', 'X', 'Tip of the week'], ['13:00', 'LinkedIn', 'Customer story'], null],
  [null, ['11:00', 'Threads', 'Poll: what should we build next?'], ['18:00', 'Facebook', 'Weekend offer']],
  [['10:00', 'YouTube', 'Short: 30-second demo'], null, null],
];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const tones: Record<string, string> = {
  LinkedIn: 'bg-[#5B5BF0]/20 border-[#5B5BF0]/50',
  X: 'bg-white/[0.07] border-white/20',
  Instagram: 'bg-[#F06292]/15 border-[#F06292]/40',
  Threads: 'bg-white/[0.07] border-white/20',
  Facebook: 'bg-[#4F8EF7]/15 border-[#4F8EF7]/40',
  YouTube: 'bg-[#C8F560]/10 border-[#C8F560]/40',
};

const planLines = (name: string) => {
  const p = pricing[name];
  return [
    `${p.channel} channels`,
    'Unlimited scheduled posts',
    ai ? 'AI post variations and weekly planner' : '',
    ai ? `${p.image_generation_count} AI images a month` : '',
    p.team_members ? 'Team members' : 'Single user',
    p.public_api ? 'API and webhooks' : '',
  ].filter(Boolean);
};

export default function Welcome() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(91,91,240,0.28)_0%,rgba(11,11,16,0)_70%)]" />
          <div className="relative mx-auto max-w-[1160px] px-[20px] pt-[72px] md:pt-[104px] text-center">
            <div className="inline-flex items-center gap-[8px] rounded-full border border-white/10 bg-white/[0.04] px-[12px] h-[30px] text-[12px] text-[#C9C9D4]">
              <span className="w-[6px] h-[6px] rounded-full bg-[#C8F560]" />
              {ai
                ? 'Social scheduling with an AI planner built in'
                : 'Social scheduling for every channel you post to'}
            </div>
            <h1 className="mx-auto mt-[22px] max-w-[820px] text-[40px] leading-[1.08] md:text-[64px] font-[600] tracking-[-0.035em]">
              Plan a week of social posts in one sitting.
            </h1>
            <p className="mx-auto mt-[20px] max-w-[600px] text-[17px] leading-[1.6] text-[#B4B4C2]">
              {brand.name} connects your channels,{' '}
              {ai ? 'drafts the content with you,' : 'keeps every post on one calendar,'}{' '}
              and publishes it on schedule — so posting stops being a daily
              chore.
            </p>
            <div className="mt-[30px] flex flex-col sm:flex-row items-center justify-center gap-[12px]">
              <Link
                href="/auth"
                className="w-full sm:w-auto px-[22px] h-[48px] flex items-center justify-center rounded-[12px] bg-[#5B5BF0] hover:bg-[#4a4ae0] font-[600] transition-colors"
              >
                {paid ? 'Start 7-day free trial' : 'Get started free'}
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-[22px] h-[48px] flex items-center justify-center rounded-[12px] border border-white/15 hover:bg-white/[0.05] font-[600] transition-colors"
              >
                See what it does
              </a>
            </div>

            <div className="mt-[56px] rounded-[18px] border border-white/10 bg-[#13131B] p-[10px] md:p-[16px] text-start shadow-[0_40px_120px_-40px_rgba(91,91,240,0.55)]">
              <div className="flex items-center justify-between px-[6px] pb-[12px]">
                <div className="text-[14px] font-[600]">This week</div>
                <div className="flex gap-[6px] text-[11px] text-[#8A8A99]">
                  <span className="rounded-[6px] bg-white/[0.06] px-[8px] py-[3px]">Day</span>
                  <span className="rounded-[6px] bg-white text-black px-[8px] py-[3px]">Week</span>
                  <span className="rounded-[6px] bg-white/[0.06] px-[8px] py-[3px]">Month</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-[8px]">
                {mock.map((col, i) => (
                  <div
                    key={days[i]}
                    className={`flex-col gap-[8px] ${i > 1 ? 'hidden sm:flex' : 'flex'} ${i > 2 ? '!hidden md:!flex' : ''}`}
                  >
                    <div className="rounded-[8px] bg-white/[0.04] py-[8px] text-center text-[12px] text-[#B4B4C2]">
                      {days[i]}
                    </div>
                    {col.map((slot, j) =>
                      slot ? (
                        <div
                          key={j}
                          className={`min-h-[84px] rounded-[10px] border p-[10px] ${tones[slot[1]]}`}
                        >
                          <div className="flex justify-between text-[11px] text-[#B4B4C2]">
                            <span>{slot[1]}</span>
                            <span>{slot[0]}</span>
                          </div>
                          <div className="mt-[6px] text-[13px] leading-[1.35]">{slot[2]}</div>
                        </div>
                      ) : (
                        <div
                          key={j}
                          className="min-h-[84px] rounded-[10px] border border-dashed border-white/[0.08]"
                        />
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1160px] px-[20px] pt-[56px]">
          <div className="text-center text-[13px] text-[#8A8A99]">Publishes to</div>
          <div className="mt-[14px] flex flex-wrap justify-center gap-[8px]">
            {channels.map((c) => (
              <span
                key={c}
                className="rounded-full border border-white/10 bg-white/[0.03] px-[14px] py-[6px] text-[13px] text-[#D6D6E0]"
              >
                {c}
              </span>
            ))}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-[1160px] px-[20px] pt-[96px] scroll-mt-[80px]">
          <h2 className="max-w-[620px] text-[32px] md:text-[40px] leading-[1.15] font-[600] tracking-[-0.025em]">
            Everything between the idea and the published post.
          </h2>
          <div className="mt-[36px] grid gap-[14px] sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-[16px] border border-white/[0.08] bg-[#13131B] p-[24px]"
              >
                <div className="w-[28px] h-[4px] rounded-full bg-[#C8F560]" />
                <div className="mt-[18px] text-[18px] font-[600]">{f.title}</div>
                <div className="mt-[8px] text-[15px] leading-[1.6] text-[#B4B4C2]">{f.text}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="how" className="mx-auto max-w-[1160px] px-[20px] pt-[96px] scroll-mt-[80px]">
          <h2 className="text-[32px] md:text-[40px] font-[600] tracking-[-0.025em]">How it works</h2>
          <div className="mt-[32px] grid gap-[14px] md:grid-cols-3">
            {steps.map(([title, text], i) => (
              <div key={title} className="rounded-[16px] border border-white/[0.08] p-[24px]">
                <div className="text-[13px] text-[#8A8A99]">Step {i + 1}</div>
                <div className="mt-[6px] text-[22px] font-[600]">{title}</div>
                <div className="mt-[8px] text-[15px] leading-[1.6] text-[#B4B4C2]">{text}</div>
              </div>
            ))}
          </div>
        </section>

        {paid && (
        <section id="pricing" className="mx-auto max-w-[1160px] px-[20px] pt-[96px] scroll-mt-[80px]">
          <h2 className="text-[32px] md:text-[40px] font-[600] tracking-[-0.025em]">Simple pricing</h2>
          <p className="mt-[10px] text-[16px] text-[#B4B4C2]">
            Every plan starts with a 7-day free trial. Cancel any time.
          </p>
          <div className="mt-[32px] grid gap-[14px] md:grid-cols-2 max-w-[820px]">
            {sellableTiers.map((name, i) => (
              <div
                key={name}
                className={`rounded-[18px] border p-[28px] ${
                  i === sellableTiers.length - 1
                    ? 'border-[#5B5BF0] bg-[#5B5BF0]/[0.08]'
                    : 'border-white/[0.08] bg-[#13131B]'
                }`}
              >
                <div className="text-[15px] font-[600] capitalize">{name.toLowerCase()}</div>
                <div className="mt-[10px] flex items-end gap-[6px]">
                  <span className="text-[44px] leading-none font-[600] tracking-[-0.03em]">
                    ${pricing[name].month_price}
                  </span>
                  <span className="pb-[6px] text-[14px] text-[#8A8A99]">/ month</span>
                </div>
                <div className="mt-[4px] text-[13px] text-[#8A8A99]">
                  or ${pricing[name].year_price} billed yearly
                </div>
                <ul className="mt-[20px] flex flex-col gap-[10px] text-[15px] text-[#D6D6E0]">
                  {planLines(name).map((l) => (
                    <li key={l} className="flex gap-[10px]">
                      <span className="mt-[8px] w-[6px] h-[6px] min-w-[6px] rounded-full bg-[#C8F560]" />
                      {l}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth"
                  className="mt-[24px] h-[46px] flex items-center justify-center rounded-[12px] bg-white text-black font-[600] hover:bg-[#E9E9F2] transition-colors"
                >
                  Start free trial
                </Link>
              </div>
            ))}
          </div>
        </section>
        )}

        <section id="faq" className="mx-auto max-w-[820px] px-[20px] pt-[96px] scroll-mt-[80px]">
          <h2 className="text-[32px] md:text-[40px] font-[600] tracking-[-0.025em]">Questions</h2>
          <div className="mt-[24px] flex flex-col">
            {faq.map(([q, a]) => (
              <details key={q} className="group border-b border-white/[0.08] py-[18px]">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[17px] font-[600]">
                  {q}
                  <span className="text-[#8A8A99] transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-[10px] text-[15px] leading-[1.65] text-[#B4B4C2]">{a}</div>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1160px] px-[20px] pt-[96px]">
          <div className="rounded-[22px] border border-white/10 bg-[radial-gradient(90%_140%_at_0%_0%,#2a2a78_0%,#13131B_60%)] px-[24px] py-[48px] md:px-[56px] flex flex-col md:flex-row md:items-center justify-between gap-[24px]">
            <div className="text-[28px] md:text-[34px] leading-[1.15] font-[600] tracking-[-0.025em] max-w-[520px]">
              {ai
                ? 'Your next week of posts is one topic away.'
                : 'Get your next week of posts on the calendar.'}
            </div>
            <Link
              href="/auth"
              className="px-[24px] h-[50px] flex items-center justify-center rounded-[12px] bg-[#C8F560] text-black font-[600] hover:bg-[#b9ea4b] transition-colors"
            >
              Create your account
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
