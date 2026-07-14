// ─── Site settings — non-secret text. Secrets live in root .env ───
export const SITE = {
  name: "Indian Solar Light Centre",
  whatsapp: (process.env.WHATSAPP_NUMBER || "").replace(/\D/g, ""),
  phone1: process.env.PHONE_1 || "+91 63925 54283",
  phone2: process.env.PHONE_2 || "+91 87267 90180",
  email: process.env.EMAIL || "info@solarlc.com",
  address: process.env.ADDRESS || "Saraihazi, Sonwara Mod, Rani ki Sarai, Azamgarh, Uttar Pradesh 276207",
};
