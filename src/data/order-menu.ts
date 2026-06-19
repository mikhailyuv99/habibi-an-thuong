/** Structured menu for direct ordering — prices from printed boards (K = 1,000 VND). */

import { getOrderItemImage } from "./order-menu-images";

export type OrderMenuItem = {
  id: string;
  name: string;
  description?: string;
  priceVnd: number;
  image: string;
};

export type OrderMenuCategory = {
  id: string;
  title: string;
  items: OrderMenuItem[];
};

function k(amount: number): number {
  return amount * 1000;
}

type OrderMenuItemInput = Omit<OrderMenuItem, "image">;

type OrderMenuCategoryInput = {
  id: string;
  title: string;
  items: OrderMenuItemInput[];
};

const ORDER_MENU_RAW: OrderMenuCategoryInput[] = [
  {
    id: "appetizers",
    title: "Appetizers",
    items: [
      {
        id: "olivier",
        name: "Olivier Salad",
        description: "Potato, carrot, peas, pickles, egg, and chicken in creamy mayonnaise.",
        priceVnd: k(100),
      },
      {
        id: "hummus",
        name: "Hummus with Arabic Bread",
        description: "Chickpeas, tahini, lemon, and garlic with warm in-house bread.",
        priceVnd: k(130),
      },
      {
        id: "mutabel",
        name: "Mutabel with Arabic Bread",
        description: "Smoky roasted eggplant dip with tahini, garlic, and lemon.",
        priceVnd: k(100),
      },
      {
        id: "fattoush",
        name: "Fattoush Salad",
        description: "Lettuce, tomatoes, cucumbers, onions, croutons, pomegranate sauce.",
        priceVnd: k(120),
      },
    ],
  },
  {
    id: "cold-plates",
    title: "Cold Plates",
    items: [
      {
        id: "mixed-cold",
        name: "Mixed Cold Appetizer",
        description: "Green salad, tabbouleh, hummus, mutabel. Russian salad or falafel on the side.",
        priceVnd: k(200),
      },
      {
        id: "green-salad",
        name: "Green Salad",
        description: "Lettuce, tomatoes, cucumbers, onion, parsley, olive oil.",
        priceVnd: k(90),
      },
      {
        id: "tabbouleh",
        name: "Tabbouleh Salad",
        description: "Parsley, tomatoes, white onions, light olive oil dressing.",
        priceVnd: k(100),
      },
      {
        id: "falafel",
        name: "Falafel (5 pieces)",
        description: "Chickpea fritters with herbs and spices.",
        priceVnd: k(100),
      },
    ],
  },
  {
    id: "salads",
    title: "Salads & Sides",
    items: [
      {
        id: "shrimp-avocado",
        name: "Shrimp and Avocado Salad",
        description: "Arugula, cherry tomatoes, egg, avocado, grilled shrimp.",
        priceVnd: k(150),
      },
      {
        id: "seafood-salad",
        name: "Seafood Salad",
        description: "Shrimp, crab stick, egg, corn, mayonnaise.",
        priceVnd: k(100),
      },
      {
        id: "napa-cabbage",
        name: "Napa Cabbage Salad",
        description: "Napa cabbage with mayonnaise, egg, and green onion.",
        priceVnd: k(70),
      },
      {
        id: "homemade-potatoes",
        name: "Homemade Potatoes",
        description: "Golden crispy potato wedges with garlic and dill.",
        priceVnd: k(75),
      },
      {
        id: "french-fries",
        name: "French Fries",
        description: "Golden crispy fries.",
        priceVnd: k(50),
      },
    ],
  },
  {
    id: "soups",
    title: "Soups",
    items: [
      {
        id: "lamb-soup",
        name: "Lamb Soup",
        description: "Tender lamb in a broth seasoned with Arabian spices.",
        priceVnd: k(170),
      },
      {
        id: "lentil-soup",
        name: "Lentil Soup",
        description: "Lentils, vegetables, herbs, cumin, and lemon. Served with pita chips.",
        priceVnd: k(110),
      },
      {
        id: "borscht-half",
        name: "Borscht Soup with Beef (half)",
        description: "Beetroot soup with vegetables and striploin beef. Bread on the side.",
        priceVnd: k(80),
      },
      {
        id: "borscht-full",
        name: "Borscht Soup with Beef (full)",
        description: "Beetroot soup with vegetables and striploin beef. Bread on the side.",
        priceVnd: k(120),
      },
      {
        id: "couscous-chicken",
        name: "Couscous with Chicken Breast",
        description: "North African couscous with breaded fried chicken breast.",
        priceVnd: k(220),
      },
    ],
  },
  {
    id: "georgian",
    title: "Georgian Mains",
    items: [
      {
        id: "steamed-salmon",
        name: "Steamed Salmon Fillet",
        description: "Salmon with green salad, egg, and mayonnaise.",
        priceVnd: k(150),
      },
      {
        id: "kazan-kebab",
        name: "Kazan Kebab",
        description: "Meat and potatoes slow-cooked with onion and eggplant in a clay pot.",
        priceVnd: k(190),
      },
      {
        id: "stuffed-pepper-1",
        name: "Stuffed Bell Pepper (1 pc)",
        description: "Minced meat with basmati rice, onion, tomato, and black pepper.",
        priceVnd: k(100),
      },
      {
        id: "stuffed-pepper-2",
        name: "Stuffed Bell Pepper (2 pc)",
        description: "Minced meat with basmati rice, onion, tomato, and black pepper.",
        priceVnd: k(190),
      },
      {
        id: "khinkali",
        name: "Khinkali (per piece)",
        description: "Georgian dumplings — ask for meat, chicken & mushroom, salmon, or spinach & cheese.",
        priceVnd: k(60),
      },
    ],
  },
  {
    id: "slavic",
    title: "Slavic Food",
    items: [
      {
        id: "chebureki-chicken",
        name: "Chebureki (Chicken)",
        description: "Golden fried pocket with juicy chicken filling.",
        priceVnd: k(50),
      },
      {
        id: "chebureki-beef",
        name: "Chebureki (Beef)",
        description: "Golden fried pocket with seasoned beef filling.",
        priceVnd: k(60),
      },
      {
        id: "vareniki-potato",
        name: "Vareniki (Potato)",
        description: "Boiled dumplings with creamy potato. Served with yoghurt.",
        priceVnd: k(75),
      },
      {
        id: "vareniki-cottage",
        name: "Vareniki (Cottage Cheese)",
        description: "Boiled dumplings with savory cottage cheese. Served with yoghurt.",
        priceVnd: k(100),
      },
    ],
  },
  {
    id: "slavic-snacks",
    title: "Slavic Snacks",
    items: [
      {
        id: "piroshki-potato",
        name: "Piroshki (Potato)",
        description: "Golden fried pocket with seasoned potato.",
        priceVnd: k(45),
      },
      {
        id: "piroshki-chicken",
        name: "Piroshki (Chicken)",
        description: "Golden fried pocket with chicken filling.",
        priceVnd: k(55),
      },
      {
        id: "piroshki-cheese",
        name: "Piroshki (Cheese)",
        description: "Golden fried pocket with cheese filling.",
        priceVnd: k(65),
      },
      {
        id: "falafel-wrap",
        name: "Falafel Vegan Wrap",
        description: "Falafel fritters with fries and pickles in a grilled wrap.",
        priceVnd: k(100),
      },
      {
        id: "zucchini-rolls",
        name: "Zucchini Rolls",
        description: "Grilled zucchini filled with cream cheese and garlic.",
        priceVnd: k(80),
      },
    ],
  },
  {
    id: "mandi",
    title: "Mandi & Kabsa",
    items: [
      {
        id: "mandi-chicken-thigh",
        name: "Chicken Mandi or Kabsa (full thigh)",
        description: "Yemeni-style rice with a full roasted chicken thigh.",
        priceVnd: k(120),
      },
      {
        id: "mandi-half-chicken",
        name: "Kabsa or Mandi (half grilled chicken)",
        description: "Half chicken char-grilled after a fragrant spice marinade over rice.",
        priceVnd: k(210),
      },
      {
        id: "mandi-lamb",
        name: "Mandi or Kabsa Rice with Lamb",
        description: "Pressure-cooked lamb with Yemeni spices over basmati rice.",
        priceVnd: k(300),
      },
    ],
  },
  {
    id: "arabic-grill",
    title: "Arabic Grill",
    items: [
      {
        id: "mix-grill-l",
        name: "Mix Grill (serves 1)",
        description: "Combination of kebabs with rice, salad, flatbread, and sauce.",
        priceVnd: k(350),
      },
      {
        id: "mix-grill-xl",
        name: "Mix Grill (serves 2)",
        description: "Combination of kebabs with rice, salad, flatbread, and sauce.",
        priceVnd: k(650),
      },
      {
        id: "lamb-shashlik",
        name: "Lamb Shashlik",
        description: "Marinated lamb skewers charred over open flame with rice and salad.",
        priceVnd: k(280),
      },
      {
        id: "eggplant-kebab",
        name: "Eggplant Kebab",
        description: "Lamb kebab with charred eggplant, rice, and salad.",
        priceVnd: k(260),
      },
    ],
  },
  {
    id: "kebabs",
    title: "Kebabs & Grill",
    items: [
      {
        id: "chicken-shish",
        name: "Chicken Shish Tawook",
        description: "Marinated chicken skewers with rice or fries and salad.",
        priceVnd: k(185),
      },
      {
        id: "lamb-kebab",
        name: "Lamb Kebab",
        description: "Minced lamb kebab roasted over charcoal with rice or fries.",
        priceVnd: k(280),
      },
      {
        id: "chicken-kebab",
        name: "Chicken Kebab",
        description: "Minced chicken kebab with rice or fries and salad.",
        priceVnd: k(195),
      },
      {
        id: "chicken-wings",
        name: "Chicken Wings",
        description: "Marinated wings grilled with spices. Rice or fries and garlic sauce.",
        priceVnd: k(170),
      },
    ],
  },
  {
    id: "fast-bites",
    title: "Wraps & Bites",
    items: [
      {
        id: "gyros-wrap",
        name: "Gyros Wrap",
        description: "Garlic sauce, fries, lettuce, pickles, and tomatoes.",
        priceVnd: k(130),
      },
      {
        id: "placinta-apple",
        name: "Placinta Apple",
        description: "Romanian flaky pastry with apple filling.",
        priceVnd: k(100),
      },
      {
        id: "placinta-potato",
        name: "Placinta Potato",
        description: "Flaky pastry with seasoned potato filling.",
        priceVnd: k(90),
      },
      {
        id: "placinta-mozzarella",
        name: "Placinta Mozzarella",
        description: "Cheesy pastry with mozzarella and feta.",
        priceVnd: k(120),
      },
      {
        id: "placinta-cottage",
        name: "Placinta Cottage Cheese",
        description: "Pastry with cottage cheese, dill, and green onion.",
        priceVnd: k(130),
      },
    ],
  },
  {
    id: "drinks",
    title: "Drinks",
    items: [
      {
        id: "karak-chai",
        name: "Karak Chai",
        description: "Spiced tea with cardamom, clove, cinnamon, and evaporated milk.",
        priceVnd: k(100),
      },
      {
        id: "cappuccino",
        name: "Cappuccino",
        description: "Espresso with steamed milk and a light cocoa finish.",
        priceVnd: k(45),
      },
      {
        id: "espresso",
        name: "Espresso Double Shot",
        description: "Two shots of espresso.",
        priceVnd: k(35),
      },
    ],
  },
];

export const ORDER_MENU: OrderMenuCategory[] = ORDER_MENU_RAW.map((category) => ({
  ...category,
  items: category.items.map((menuItem) => ({
    ...menuItem,
    image: getOrderItemImage(menuItem.id),
  })),
}));

export const ORDER_MENU_BY_ID = new Map(
  ORDER_MENU.flatMap((cat) => cat.items.map((item) => [item.id, item] as const)),
);

export function formatOrderVnd(amount: number): string {
  return `${amount.toLocaleString("en-US")}VND`;
}

export function formatOrderPriceDisplay(amount: number): string {
  return `${amount.toLocaleString("en-US")}₫`;
}
