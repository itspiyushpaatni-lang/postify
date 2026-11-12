import { LegalPage } from '@gitroom/frontend/components/marketing/site.chrome';
import { brand } from '@gitroom/helpers/utils/brand';

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <p className="rounded-[10px] border border-[#C8F560]/30 bg-[#C8F560]/[0.06] p-[14px] text-[#E4F7B0]">
        Template only. Replace this page with a policy reviewed for your
        business and jurisdiction. Meta, LinkedIn, TikTok and Google require a
        public privacy policy URL before they approve an OAuth app.
      </p>
      <h2>What we store</h2>
      <p>
        Your account email, the access tokens for the social accounts you
        connect, the posts and media you create, and the analytics the
        platforms return for your accounts.
      </p>
      <h2>How it is used</h2>
      <p>
        Only to publish the posts you schedule and show you their results.
        Access tokens are never shared, and you can disconnect a channel or
        delete your account at any time.
      </p>
      <h2>Third parties</h2>
      <p>
        Stripe processes payments. If AI features are enabled, the text you
        ask the AI to work on is sent to the configured AI provider.
      </p>
      <h2>Contact</h2>
      <p>{brand.supportEmail}</p>
    </LegalPage>
  );
}
