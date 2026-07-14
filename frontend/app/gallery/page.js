// ─── /gallery — sab photos + videos, ek jagah ───
export const revalidate = 60;

import { getGallery } from "@/lib/gallery";
import { SITE } from "@/lib/config";
import { buildGalleryPageHtml } from "@/lib/homeMarkup";
import HomeView from "@/components/HomeView";

export const metadata = {
  title: "Humara Kaam — Puri Gallery | Indian Solar Light Centre",
  description: "Azamgarh me humare saare solar installs — asli photos aur videos.",
};

export default async function GalleryPage() {
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

  const html = buildGalleryPageHtml(items, common);

  return <HomeView html={html} />;
}
