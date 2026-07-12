// Custom web HTML shell (Expo Router renders this only for web builds).
// Exists to carry the share/OG metadata; the styles mirror what the default
// shell emits (ScrollViewStyleReset is that reset as a component).
import { ScrollViewStyleReset } from "expo-router/html";

const TITLE = "Kratt — who's really talking in the comments?";
const DESCRIPTION =
  "Paste a YouTube link and Kratt estimates how much of the comment section " +
  "is bot activity — shown with the evidence, so you learn to spot " +
  "manufactured consensus yourself.";

// Absolute, not "/og-image.png": link-preview crawlers (WhatsApp, Discord,
// Slack, X) fetch the image out of band and won't resolve a relative path.
// Fill in the deployed origin once Vercel gives us one.
const SITE_URL = "https://kratt.vercel.app"; // TODO: ganti ke domain final
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export default function Root({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Kratt" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* summary_large_image, not summary: the asset is 1200x630 (1.91:1),
            made for the wide card — the small square card would crop it. */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
