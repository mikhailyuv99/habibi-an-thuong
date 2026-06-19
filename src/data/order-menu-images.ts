/** Real Habibi photography for order menu tiles — owner, maps, and telegram dish shots. */

export const ORDER_ITEM_IMAGES: Record<string, string> = {
  // Appetizers
  olivier: "/photos/owner/olivier-salad.jpg",
  hummus: "/photos/owner/meze-platter.jpg",
  mutabel: "/photos/telegram/dish-02.jpg",
  fattoush: "/photos/telegram/dish-03.jpg",

  // Cold plates
  "mixed-cold": "/photos/owner/meze-platter.jpg",
  "green-salad": "/photos/photo-7.jpg",
  tabbouleh: "/photos/telegram/dish-04.jpg",
  falafel: "/photos/telegram/dish-05.jpg",

  // Salads & sides
  "shrimp-avocado": "/photos/photo-3.jpg",
  "seafood-salad": "/photos/owner/seafood-salad.jpg",
  "napa-cabbage": "/photos/telegram/dish-06.jpg",
  "homemade-potatoes": "/photos/photo-5.jpg",
  "french-fries": "/photos/telegram/dish-07.jpg",

  // Soups
  "lamb-soup": "/photos/maps/photo-61.jpg",
  "lentil-soup": "/photos/telegram/dish-08.jpg",
  "borscht-half": "/photos/owner/borscht.jpg",
  "borscht-full": "/photos/owner/borscht.jpg",
  "couscous-chicken": "/photos/maps/photo-68.jpg",

  // Georgian mains
  "steamed-salmon": "/photos/maps/photo-52.jpg",
  "kazan-kebab": "/photos/owner/kazan-chicken.jpg",
  "stuffed-pepper-1": "/photos/owner/stuffed-pepper.jpg",
  "stuffed-pepper-2": "/photos/owner/stuffed-pepper.jpg",
  khinkali: "/photos/owner/khinkali.jpg",

  // Slavic food
  "chebureki-chicken": "/photos/owner/cheburek.jpg",
  "chebureki-beef": "/photos/owner/cheburek.jpg",
  "vareniki-potato": "/photos/owner/pelmeni.jpg",
  "vareniki-cottage": "/photos/owner/pelmeni.jpg",

  // Slavic snacks
  "piroshki-potato": "/photos/telegram/dish-09.jpg",
  "piroshki-chicken": "/photos/telegram/dish-10.jpg",
  "piroshki-cheese": "/photos/telegram/dish-11.jpg",
  "falafel-wrap": "/photos/owner/shawarma.jpg",
  "zucchini-rolls": "/photos/telegram/dish-12.jpg",

  // Mandi & kabsa
  "mandi-chicken-thigh": "/photos/maps/photo-73.jpg",
  "mandi-half-chicken": "/photos/maps/photo-91.jpg",
  "mandi-lamb": "/photos/maps/photo-110.jpg",

  // Arabic grill
  "mix-grill-l": "/photos/photo-2.jpg",
  "mix-grill-xl": "/photos/photo-2.jpg",
  "lamb-shashlik": "/photos/photo-2.jpg",
  "eggplant-kebab": "/photos/maps/photo-74.jpg",

  // Kebabs & grill
  "chicken-shish": "/photos/owner/chicken-kebab.jpg",
  "lamb-kebab": "/photos/maps/photo-47.jpg",
  "chicken-kebab": "/photos/owner/chicken-kebab.jpg",
  "chicken-wings": "/photos/maps/photo-45.jpg",

  // Wraps & bites
  "gyros-wrap": "/photos/owner/shawarma.jpg",
  "placinta-apple": "/photos/owner/khachapuri.jpg",
  "placinta-potato": "/photos/telegram/dish-13.jpg",
  "placinta-mozzarella": "/photos/owner/khachapuri.jpg",
  "placinta-cottage": "/photos/telegram/dish-14.jpg",

  // Drinks
  "karak-chai": "/photos/maps/photo-25.jpg",
  cappuccino: "/photos/maps/photo-116.jpg",
  espresso: "/photos/maps/photo-121.jpg",
};

export const ORDER_ITEM_IMAGE_FALLBACK = "/photos/photo-6.jpg";

export function getOrderItemImage(itemId: string): string {
  return ORDER_ITEM_IMAGES[itemId] ?? ORDER_ITEM_IMAGE_FALLBACK;
}
