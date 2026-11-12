// Single place for the product name and public links.
// Run scripts/rebrand.sh to rename the product everywhere (UI strings, emails, locales).
export const brand = {
  name: 'Postify',
  tagline: 'Plan, write and publish your social content from one calendar.',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@example.com',
  termsUrl: '/terms',
  privacyUrl: '/privacy',
  // AGPL-3.0 section 13: users of the hosted app must be able to get the source.
  sourceUrl:
    process.env.NEXT_PUBLIC_SOURCE_URL ||
    'https://github.com/gitroomhq/postiz-app',
};
