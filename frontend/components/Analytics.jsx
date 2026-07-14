// ─── Google Analytics (GA4) — visitors ka hisaab-kitaab 📊 ───
// .env me GA_ID daalo (jaise GA_ID=G-XXXXXXXXXX) — khali ho to kuch load nahi hota.
import Script from "next/script";

export default function Analytics() {
  const id = process.env.GA_ID;
  if (!id) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${id}');
      `}</Script>
    </>
  );
}
