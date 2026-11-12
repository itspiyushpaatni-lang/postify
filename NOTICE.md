# Notice

This product is a modified version of [Postiz](https://github.com/gitroomhq/postiz-app)
by Gitroom / the Postiz contributors, used under the GNU Affero General Public
License v3.0 (see `LICENSE`). It is not affiliated with or endorsed by Postiz.

Changes made in this fork (November 2026):

- Product name, logo, favicon and marketing copy replaced; upstream testimonials,
  affiliate, extension-store and directory links removed.
- Public landing page, terms and privacy templates added (`apps/frontend/src/app/(marketing)`).
- AI week planner and post variations added (`/posts/generator/week`,
  `/posts/generator/variations`, `/posts/generator/week/draft`).
- Plans offered for sale limited to two tiers (`sellableTiers` in `pricing.ts`).
- Social sign-in buttons shown only when configured; analytics/tracking domains
  made configurable.
- Lean Docker Compose file and rebrand script added.

Because the licence is AGPL-3.0, anyone who uses a hosted copy of this software
must be offered its complete corresponding source code, including your changes.
The footer "Source code" link (`NEXT_PUBLIC_SOURCE_URL`) is there for that.
