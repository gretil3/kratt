// Custom web HTML shell (Expo Router renders this only for web builds).
// Exists to carry the share/OG metadata; the styles mirror what the default
// shell emits (ScrollViewStyleReset is that reset as a component).
import { ScrollViewStyleReset } from "expo-router/html";

const TITLE = "Kratt — who's really talking in the comments?";
const DESCRIPTION =
  "Paste a YouTube link and Kratt estimates how much of the comment section " +
  "is bot activity — shown with the evidence, so you learn to spot " +
  "manufactured consensus yourself.";

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
        {/* og:image intentionally omitted until a real share asset exists —
            a broken image reference looks worse in link previews than none.
            When one lands in public/, add:
            <meta property="og:image" content="/og-image.png" /> */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
