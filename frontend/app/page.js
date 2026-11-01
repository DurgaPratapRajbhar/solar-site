// ─── Homepage — rendered per request, so the gallery always shows what the API has ───
export const dynamic = "force-dynamic";

import { getGallery } from "@/lib/gallery";
import { SITE } from "@/lib/config";
import { buildTopHtml, buildGalleryHtml, buildBottomHtml } from "@/lib/homeMarkup";
import HomeView from "@/components/HomeView";

export default async function HomePage() {
  // Homepage teaser: buildGalleryHtml khud latest 3 photos + 3 videos dikhata
  // hai (alag sections me) — baaki (aur purane) sab "Puri Gallery" (/gallery) pe.
  const items = await getGallery();

  const common = {
    logoUrl: "/logo.jpg",
    phone1Digits: SITE.whatsapp,
    phone1: SITE.phone1,
    phone2: SITE.phone2,
    email: SITE.email,
    address: SITE.address,
    whatsappMsg: "Namaste! Solar lagwana hai",
  };

  const html =
    buildTopHtml(common) +
    buildGalleryHtml(items, SITE.phone1) +
    buildBottomHtml(common);

  return <HomeView html={html} />;
}
