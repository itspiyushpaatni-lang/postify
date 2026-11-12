import { LegalPage } from '@gitroom/frontend/components/marketing/site.chrome';
import { brand } from '@gitroom/helpers/utils/brand';

export default function Terms() {
  return (
    <LegalPage title="Terms of Service">
      <p className="rounded-[10px] border border-[#C8F560]/30 bg-[#C8F560]/[0.06] p-[14px] text-[#E4F7B0]">
        Template only. Replace this page with terms reviewed for your business
        and jurisdiction before you accept paying customers.
      </p>
      <h2>1. The service</h2>
      <p>
        {brand.name} lets you connect social media accounts, schedule and
        publish posts, and view analytics for those accounts.
      </p>
      <h2>2. Your accounts and content</h2>
      <p>
        You keep ownership of the content you publish. You are responsible for
        following the rules of each platform you connect and for the content
        you post through the service.
      </p>
      <h2>3. Subscriptions and billing</h2>
      <p>
        Paid plans renew automatically until cancelled. Payments are processed
        by Stripe. You can cancel at any time from the billing page.
      </p>
      <h2>4. Contact</h2>
      <p>Questions about these terms: {brand.supportEmail}</p>
    </LegalPage>
  );
}
