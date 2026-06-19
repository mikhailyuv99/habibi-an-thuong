import { client, phoneHref } from "./client";

/** E.164 without + for wa.me / zalo.me */
const phoneDigits = phoneHref.replace(/\D/g, "");

const reservationMessage = encodeURIComponent(
  "Hello, I would like to make a reservation at Habibi."
);

export const social = {
  whatsapp: `https://wa.me/${phoneDigits}?text=${reservationMessage}`,
  zalo: `https://zalo.me/${phoneDigits}`,
  instagram: client.instagram_url ?? client.social_url,
  facebook: client.facebook_url,
  tiktok: client.tiktok_url,
  phone: `tel:${phoneHref}`,
  reserve: `https://wa.me/${phoneDigits}?text=${reservationMessage}`,
} as const;
