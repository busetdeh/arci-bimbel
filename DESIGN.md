# DESIGN.md — ARCI Bimbel

## Product context

ARCI Bimbel is a trusted Indonesian tutoring institution for students and parents. The product includes a public marketing website, an internal operations dashboard, and an optional student/parent portal.

## Design goals

- Make parents feel confident, informed, and safe.
- Make students feel motivated rather than pressured.
- Make tutors and staff able to complete frequent tasks quickly on mobile.
- Keep the visual system consistent across public website, dashboard, and portal.
- Prioritize clarity, trust, accessibility, and conversion over decorative effects.

## Visual direction

Use a warm, modern, trustworthy education aesthetic. The interface should feel professional, approachable, organized, and optimistic. Avoid childish cartoon styling, excessive gradients, glassmorphism, noisy backgrounds, overly dense tables, and generic stock-photo layouts.

## Brand tokens

These are starting tokens. Replace the brand name, logo, and colors when the institution provides final brand assets.

- Primary: deep indigo `#243B7A`
- Primary dark: `#172653`
- Accent: warm yellow `#F6C453`
- Success: `#218739`
- Warning: `#B7791F`
- Danger: `#C53030`
- Ink: `#18212F`
- Muted text: `#64748B`
- Surface: `#FFFFFF`
- Soft surface: `#F6F8FC`
- Border: `#E2E8F0`

Use the primary color for the main CTA, navigation emphasis, and important links. Use the accent sparingly for highlights, badges, illustrations, or a secondary callout.

## Typography

- Use a clean sans-serif such as Plus Jakarta Sans or Inter.
- Use a strong but friendly heading hierarchy.
- Public website H1: large and concise; maximum two lines on mobile.
- Body copy: comfortable line height and readable measure.
- Dashboard labels: compact but never smaller than accessible body text.
- Use Indonesian labels and realistic Indonesian copy.

## Spacing and shape

- Use a 4px base spacing unit and generous section spacing.
- Public website: 12–20px card radius, soft shadows, generous whitespace.
- Dashboard: 10–14px radius, restrained shadows, clear borders.
- Use 44px minimum touch target for buttons and controls.
- Keep content inside a centered max-width container on desktop.

## Layout rules

- Design mobile first at 390px width, then adapt to 768px tablet and 1440px desktop.
- Public website mobile uses a compact header with logo, menu, and a visible primary CTA.
- Public website desktop uses a max-width content container and a clear two-column hero when appropriate.
- Dashboard desktop uses a left sidebar and top utility bar.
- Dashboard mobile collapses the sidebar into a drawer or bottom navigation and turns dense tables into cards or controlled horizontal scroll.
- Never introduce accidental horizontal page scrolling.

## Component rules

Include consistent states for buttons, inputs, cards, tabs, badges, tables, dropdowns, modals, alerts, empty states, loading skeletons, and error messages.

Every form must include:

- Visible label.
- Helpful placeholder only when needed.
- Required/optional indication.
- Inline validation message.
- Disabled/loading state.
- Success confirmation.

Every data-heavy screen must include loading, empty, error, and success states.

## Content rules

- Use short, specific CTA labels: “Konsultasi Gratis”, “Lihat Program”, “Daftar Trial”, “Simpan Perubahan”.
- Avoid vague CTA labels such as “Submit” or “Learn More”.
- Use Indonesian Rupiah formatting: `Rp850.000`.
- Use Indonesian dates and times.
- Use realistic names, classes, subjects, and statuses; do not use lorem ipsum.
- Do not invent testimonials, awards, or statistics as factual claims. Mark them as sample content when necessary.

## Accessibility rules

- Maintain strong text/background contrast.
- Do not communicate status by color alone.
- Provide visible focus states.
- Use semantic headings and labels.
- Make interactive elements keyboard accessible.
- Keep text readable at larger browser font sizes.

## Image rules

- Use authentic education imagery: tutor explaining, student learning, small group discussion, classroom details.
- Prefer bright natural light, diverse Indonesian students, and non-staged expressions.
- Avoid identifiable children in public marketing screens unless the image is explicitly marked as placeholder.
- Use image placeholders with a clear aspect ratio when final assets are unavailable.

## Stitch generation rules

- Generate a screen or a closely related screen group at a time.
- Always specify product area, user, viewport, purpose, hierarchy, content, actions, and states.
- Keep the same design system across every prompt.
- Ask for responsive behavior explicitly; do not assume desktop behavior will translate to mobile.
- After generating a screen, iterate with small focused prompts instead of redesigning everything.
- Preserve existing navigation, terminology, color tokens, and component shapes when revising.

