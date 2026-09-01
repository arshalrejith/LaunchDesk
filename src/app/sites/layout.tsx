import { Fraunces, Inter, Cormorant_Garamond, Karla, Barlow_Condensed, Barlow } from "next/font/google";
import { SITE_SHARED_CSS, SITE_REVEAL_SCRIPT } from "@/lib/siteSharedStyles";

// Scoped to /sites/* only — the dashboard and admin keep the app's default
// Geist typeface. Three font pairings load here, one per structural template
// (Editorial / Boutique / Conversion), so whichever one a client has active
// picks up its own type without any other route paying for it.
//
// SITE_SHARED_CSS (the button/card/band "atoms" every template relies on)
// lives in @/lib/siteSharedStyles so the static-file exporter can render the
// exact same primitives without this file ever drifting out of sync with it.
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: "variable", axes: ["opsz"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500", "600"] });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"] });
const karla = Karla({ variable: "--font-karla", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const barlowCondensed = Barlow_Condensed({ variable: "--font-barlow-condensed", subsets: ["latin"], weight: ["600", "700", "800"] });
const barlow = Barlow({ variable: "--font-barlow", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const FONT_VARS = [fraunces, inter, cormorant, karla, barlowCondensed, barlow].map((f) => f.variable).join(" ");

export default function SitesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={FONT_VARS}>
      <style>{SITE_SHARED_CSS}</style>
      {children}
      {/* eslint-disable-next-line react/no-danger */}
      <script dangerouslySetInnerHTML={{ __html: SITE_REVEAL_SCRIPT }} />
    </div>
  );
}
