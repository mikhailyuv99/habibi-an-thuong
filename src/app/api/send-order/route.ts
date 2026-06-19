import { NextResponse } from "next/server";
import { ORDER_MENU_BY_ID } from "@/data/order-menu";
import {
  PICKUP_OPTIONS,
  buildOrderWhatsAppMessage,
  type PickupTime,
} from "@/lib/order-whatsapp";

/** Test inbox only — never falls back to restaurant phone from client.json */
const ORDER_INBOX_PHONE = process.env.ORDER_WHATSAPP_TO ?? "33677231846";

type OrderPayload = {
  customer?: { firstName?: string; phone?: string };
  cart?: Record<string, number>;
  pickup?: PickupTime;
};

function sanitizeCart(raw: Record<string, number> | undefined): Record<string, number> {
  if (!raw || typeof raw !== "object") return {};
  const cart: Record<string, number> = {};
  for (const [id, qty] of Object.entries(raw)) {
    if (!ORDER_MENU_BY_ID.has(id)) continue;
    const quantity = Math.floor(Number(qty));
    if (quantity > 0 && quantity <= 99) cart[id] = quantity;
  }
  return cart;
}

async function sendViaCallMeBot(message: string): Promise<void> {
  const apiKey = process.env.CALLMEBOT_API_KEY;
  if (!apiKey) {
    throw new Error("CALLMEBOT_API_KEY is not configured on the server.");
  }

  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", ORDER_INBOX_PHONE);
  url.searchParams.set("text", message);
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url.toString(), { method: "GET", cache: "no-store" });
  const body = (await response.text()).trim();

  if (!response.ok) {
    throw new Error(body || "CallMeBot request failed.");
  }

  const lower = body.toLowerCase();
  if (lower.includes("error") || lower.includes("invalid") || lower.includes("not allowed")) {
    throw new Error(body);
  }
}

export async function POST(request: Request) {
  let payload: OrderPayload;

  try {
    payload = (await request.json()) as OrderPayload;
  } catch {
    return NextResponse.json({ error: "Invalid order payload." }, { status: 400 });
  }

  const firstName = payload.customer?.firstName?.trim() ?? "";
  const phone = payload.customer?.phone?.trim() ?? "";
  const pickup = payload.pickup ?? "ASAP";
  const cart = sanitizeCart(payload.cart);

  if (!firstName || !phone) {
    return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
  }

  if (!PICKUP_OPTIONS.includes(pickup)) {
    return NextResponse.json({ error: "Invalid pickup time." }, { status: 400 });
  }

  if (Object.keys(cart).length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const message = buildOrderWhatsAppMessage({ firstName, phone }, cart, pickup);

  try {
    await sendViaCallMeBot(message);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Could not send order.";
    console.error("[send-order]", detail);
    return NextResponse.json({ error: detail }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
