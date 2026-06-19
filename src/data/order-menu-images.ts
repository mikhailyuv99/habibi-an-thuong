/**
 * Order menu thumbnails — each path must match the named dish exactly.
 * Sources: owner/telegram photography, verified table shots, and crops from menu-hd boards.
 */

const DISH = (id: string) => `/photos/dishes/${id}.jpg`;

export const ORDER_ITEM_IMAGES: Record<string, string> = {
  // Appetizers
  olivier: "/photos/owner/olivier-salad.jpg",
  hummus: DISH("hummus"),
  mutabel: DISH("mutabel"),
  fattoush: DISH("fattoush"),

  // Cold plates
  "mixed-cold": DISH("mixed-cold"),
  "green-salad": DISH("green-salad"),
  tabbouleh: DISH("tabbouleh"),
  falafel: DISH("falafel"),

  // Salads & sides
  "shrimp-avocado": "/photos/telegram/dish-11.jpg",
  "seafood-salad": "/photos/owner/seafood-salad.jpg",
  "napa-cabbage": DISH("napa-cabbage"),
  "homemade-potatoes": DISH("homemade-potatoes"),
  "french-fries": DISH("french-fries"),

  // Soups
  "lamb-soup": DISH("lamb-soup"),
  "lentil-soup": DISH("lentil-soup"),
  "borscht-half": "/photos/owner/borscht.jpg",
  "borscht-full": "/photos/owner/borscht.jpg",
  "couscous-chicken": DISH("couscous-chicken"),

  // Georgian mains
  "steamed-salmon": "/photos/photo-19.jpg",
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
  "piroshki-potato": DISH("piroshki-potato"),
  "piroshki-chicken": DISH("piroshki-chicken"),
  "piroshki-cheese": DISH("piroshki-cheese"),
  "falafel-wrap": DISH("falafel-wrap"),
  "zucchini-rolls": DISH("zucchini-rolls"),

  // Mandi & kabsa
  "mandi-chicken-thigh": DISH("mandi-chicken-thigh"),
  "mandi-half-chicken": DISH("mandi-half-chicken"),
  "mandi-lamb": DISH("mandi-lamb"),

  // Arabic grill
  "mix-grill-l": "/photos/photo-14.jpg",
  "mix-grill-xl": "/photos/photo-14.jpg",
  "lamb-shashlik": "/photos/photo-2.jpg",
  "eggplant-kebab": DISH("eggplant-kebab"),

  // Kebabs & grill
  "chicken-shish": "/photos/photo-3.jpg",
  "lamb-kebab": DISH("lamb-kebab"),
  "chicken-kebab": DISH("chicken-kebab"),
  "chicken-wings": DISH("chicken-wings"),

  // Wraps & bites
  "gyros-wrap": DISH("gyros-wrap"),
  "placinta-apple": DISH("placinta-apple"),
  "placinta-potato": DISH("placinta-potato"),
  "placinta-mozzarella": DISH("placinta-mozzarella"),
  "placinta-cottage": DISH("placinta-cottage"),

  // Drinks
  "karak-chai": "/photos/photo-18.jpg",
  cappuccino: DISH("cappuccino"),
  espresso: DISH("espresso"),
};

export function getOrderItemImage(itemId: string): string | null {
  return ORDER_ITEM_IMAGES[itemId] ?? null;
}
