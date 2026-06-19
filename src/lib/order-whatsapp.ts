import { formatOrderVnd, ORDER_MENU_BY_ID, type OrderMenuItem } from "@/data/order-menu";

export type PickupTime = "ASAP" | "15 min" | "30 min" | "45 min";

export const PICKUP_OPTIONS: PickupTime[] = ["ASAP", "15 min", "30 min", "45 min"];

export type CartLine = {
  item: OrderMenuItem;
  quantity: number;
};

export function cartLinesFromMap(cart: Record<string, number>): CartLine[] {
  return Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, quantity]) => {
      const item = ORDER_MENU_BY_ID.get(id);
      if (!item) return null;
      return { item, quantity };
    })
    .filter((line): line is CartLine => line !== null);
}

export function cartSubtotal(cart: Record<string, number>): number {
  return cartLinesFromMap(cart).reduce(
    (sum, { item, quantity }) => sum + item.priceVnd * quantity,
    0,
  );
}

export function buildOrderWhatsAppMessage(
  customer: { firstName: string; phone: string },
  cart: Record<string, number>,
  pickup: PickupTime,
): string {
  const lines = cartLinesFromMap(cart);
  const total = cartSubtotal(cart);

  const itemLines = lines
    .map(
      ({ item, quantity }) =>
        `- ${item.name} x${quantity} — ${formatOrderVnd(item.priceVnd * quantity)}`,
    )
    .join("\n");

  return [
    "🧾 NEW ORDER — Habibi Direct",
    "",
    `👤 Customer: ${customer.firstName}`,
    `📞 Phone: ${customer.phone}`,
    `⏱ Pickup: ${pickup}`,
    "",
    "🍽 Order:",
    itemLines,
    "",
    `💰 TOTAL: ${formatOrderVnd(total)}`,
    "",
    "⚡ Sent via Habibi Direct (not Grab)",
  ].join("\n");
}
