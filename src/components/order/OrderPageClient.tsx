"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ORDER_MENU,
  formatOrderPriceDisplay,
  type OrderMenuItem,
} from "@/data/order-menu";
import {
  type OrderCustomer,
  loadOrderCustomer,
  saveOrderCustomer,
} from "@/lib/order-storage";
import {
  PICKUP_OPTIONS,
  cartLinesFromMap,
  cartSubtotal,
  type PickupTime,
} from "@/lib/order-whatsapp";

type Step = "menu" | "confirm" | "success";

function QuantityControl({
  quantity,
  disabled,
  onChange,
}: {
  quantity: number;
  disabled?: boolean;
  onChange: (next: number) => void;
}) {
  return (
    <div className="habibi-order-qty">
      <button
        type="button"
        className="habibi-order-qty__btn"
        aria-label="Decrease quantity"
        disabled={disabled || quantity === 0}
        onClick={() => onChange(Math.max(0, quantity - 1))}
      >
        −
      </button>
      <span className="habibi-order-qty__value" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        className="habibi-order-qty__btn"
        aria-label="Increase quantity"
        disabled={disabled}
        onClick={() => onChange(quantity + 1)}
      >
        +
      </button>
    </div>
  );
}

function MenuItemCard({
  item,
  quantity,
  canOrder,
  onQuantityChange,
}: {
  item: OrderMenuItem;
  quantity: number;
  canOrder: boolean;
  onQuantityChange: (next: number) => void;
}) {
  return (
    <article className="habibi-order-item">
      <div className="habibi-order-item__body">
        <h3 className="habibi-order-item__name">{item.name}</h3>
        {item.description && (
          <p className="habibi-order-item__desc">{item.description}</p>
        )}
        <p className="habibi-order-item__price">{formatOrderPriceDisplay(item.priceVnd)}</p>
      </div>
      <QuantityControl
        quantity={quantity}
        disabled={!canOrder}
        onChange={onQuantityChange}
      />
    </article>
  );
}

export function OrderPageClient() {
  const [hydrated, setHydrated] = useState(false);
  const [customer, setCustomer] = useState<OrderCustomer | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftPhone, setDraftPhone] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [step, setStep] = useState<Step>("menu");
  const [pickup, setPickup] = useState<PickupTime>("ASAP");
  const [activeCategory, setActiveCategory] = useState(ORDER_MENU[0]?.id ?? "");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadOrderCustomer();
    if (saved) {
      setCustomer(saved);
      setDraftName(saved.firstName);
      setDraftPhone(saved.phone);
    }
    setHydrated(true);
  }, []);

  const canOrder = Boolean(customer?.firstName && customer?.phone);
  const lines = useMemo(() => cartLinesFromMap(cart), [cart]);
  const subtotal = useMemo(() => cartSubtotal(cart), [cart]);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  const setItemQuantity = useCallback((id: string, next: number) => {
    setCart((prev) => {
      const copy = { ...prev };
      if (next <= 0) {
        delete copy[id];
      } else {
        copy[id] = next;
      }
      return copy;
    });
  }, []);

  function saveCustomer(e: React.FormEvent) {
    e.preventDefault();
    const firstName = draftName.trim();
    const phone = draftPhone.trim();
    if (!firstName || !phone) return;
    const next = { firstName, phone };
    saveOrderCustomer(next);
    setCustomer(next);
  }

  function openConfirm() {
    if (!canOrder || itemCount === 0) return;
    setStep("confirm");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function sendOrder() {
    if (!customer || itemCount === 0 || sending) return;
    setSending(true);
    setSendError(null);

    try {
      const response = await fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, cart, pickup }),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Could not send your order. Please try again.");
      }

      setStep("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSendError(
        error instanceof Error ? error.message : "Could not send your order. Please try again.",
      );
    } finally {
      setSending(false);
    }
  }

  function orderAgain() {
    setCart({});
    setPickup("ASAP");
    setStep("menu");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!hydrated) {
    return <div className="habibi-order habibi-order--loading" aria-busy="true" />;
  }

  if (step === "success") {
    return (
      <div className="habibi-order">
        <header className="habibi-order-header">
          <Image
            src="/brand/logo.png"
            alt="Habibi Restaurant"
            width={120}
            height={120}
            priority
            className="habibi-order-header__logo"
          />
        </header>
        <main className="habibi-order-success">
          <p className="habibi-order-success__eyebrow">Habibi Direct</p>
          <h1 className="habibi-order-success__title">Your order has been sent!</h1>
          <p className="habibi-order-success__lead">
            The team will confirm via WhatsApp shortly.
          </p>
          <button type="button" className="habibi-order-btn habibi-order-btn--primary" onClick={orderAgain}>
            Order again
          </button>
        </main>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="habibi-order">
        <header className="habibi-order-header">
          <Image
            src="/brand/logo.png"
            alt="Habibi Restaurant"
            width={120}
            height={120}
            priority
            className="habibi-order-header__logo"
          />
          <p className="habibi-order-header__tagline">Review your order</p>
        </header>

        <main className="habibi-order-confirm">
          <section className="habibi-order-panel">
            <h2 className="habibi-order-panel__title">Customer</h2>
            <p className="habibi-order-confirm__line">
              {customer?.firstName} · {customer?.phone}
            </p>
          </section>

          <section className="habibi-order-panel">
            <h2 className="habibi-order-panel__title">Pickup time</h2>
            <div className="habibi-order-pickup">
              {PICKUP_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`habibi-order-pickup__btn${pickup === option ? " habibi-order-pickup__btn--active" : ""}`}
                  onClick={() => setPickup(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </section>

          <section className="habibi-order-panel">
            <h2 className="habibi-order-panel__title">Your order</h2>
            <ul className="habibi-order-cart-list">
              {lines.map(({ item, quantity }) => (
                <li key={item.id} className="habibi-order-cart-list__row">
                  <span>
                    {item.name} ×{quantity}
                  </span>
                  <span>{formatOrderPriceDisplay(item.priceVnd * quantity)}</span>
                </li>
              ))}
            </ul>
            <p className="habibi-order-cart-total">
              Total <strong>{formatOrderPriceDisplay(subtotal)}</strong>
            </p>
          </section>

          <div className="habibi-order-confirm__actions">
            {sendError && (
              <p className="habibi-order-confirm__error" role="alert">
                {sendError}
              </p>
            )}
            <button
              type="button"
              className="habibi-order-btn habibi-order-btn--ghost"
              disabled={sending}
              onClick={() => setStep("menu")}
            >
              Back to menu
            </button>
            <button
              type="button"
              className="habibi-order-btn habibi-order-btn--primary"
              disabled={sending}
              onClick={sendOrder}
            >
              {sending ? "Sending order…" : "Confirm order"}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="habibi-order">
      <header className="habibi-order-header">
        <Image
          src="/brand/logo.png"
          alt="Habibi Restaurant"
          width={120}
          height={120}
          priority
          className="habibi-order-header__logo"
        />
        <h1 className="habibi-order-header__tagline">Order directly &amp; skip the queue</h1>
        <p className="habibi-order-header__trust">
          No app needed · Pickup only · Pay on arrival
        </p>
      </header>

      <section className="habibi-order-ident" aria-labelledby="order-ident-heading">
        <h2 id="order-ident-heading" className="habibi-order-panel__title">
          {canOrder ? "Your details" : "Before you order"}
        </h2>
        <form className="habibi-order-ident__form" onSubmit={saveCustomer}>
          <label className="habibi-order-field">
            <span>First name</span>
            <input
              type="text"
              name="firstName"
              autoComplete="given-name"
              required
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
            />
          </label>
          <label className="habibi-order-field">
            <span>Phone (WhatsApp preferred)</span>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              required
              value={draftPhone}
              onChange={(e) => setDraftPhone(e.target.value)}
            />
          </label>
          <button type="submit" className="habibi-order-btn habibi-order-btn--secondary">
            {canOrder ? "Update details" : "Continue to menu"}
          </button>
        </form>
        {!canOrder && (
          <p className="habibi-order-ident__hint">Add your name and phone to start ordering.</p>
        )}
      </section>

      <div className="habibi-order-layout">
        <div className="habibi-order-menu">
          <nav className="habibi-order-cats" aria-label="Menu categories">
            {ORDER_MENU.map((cat) => (
              <a
                key={cat.id}
                href={`#order-cat-${cat.id}`}
                className={`habibi-order-cats__link${activeCategory === cat.id ? " habibi-order-cats__link--active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.title}
              </a>
            ))}
          </nav>

          {ORDER_MENU.map((cat) => (
            <section
              key={cat.id}
              id={`order-cat-${cat.id}`}
              className="habibi-order-category"
              onMouseEnter={() => setActiveCategory(cat.id)}
            >
              <h2 className="habibi-order-category__title">{cat.title}</h2>
              <div className="habibi-order-category__items">
                {cat.items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    quantity={cart[item.id] ?? 0}
                    canOrder={canOrder}
                    onQuantityChange={(next) => setItemQuantity(item.id, next)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="habibi-order-cart" aria-label="Your cart">
          <div className="habibi-order-cart__panel">
            <h2 className="habibi-order-cart__title">Your order</h2>
            {lines.length === 0 ? (
              <p className="habibi-order-cart__empty">Add items from the menu.</p>
            ) : (
              <ul className="habibi-order-cart-list">
                {lines.map(({ item, quantity }) => (
                  <li key={item.id} className="habibi-order-cart-list__row">
                    <span>
                      {item.name} ×{quantity}
                    </span>
                    <span>{formatOrderPriceDisplay(item.priceVnd * quantity)}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="habibi-order-cart-total">
              Subtotal{" "}
              <strong>{itemCount > 0 ? formatOrderPriceDisplay(subtotal) : "—"}</strong>
            </p>
            <button
              type="button"
              className="habibi-order-btn habibi-order-btn--primary habibi-order-cart__cta"
              disabled={!canOrder || itemCount === 0}
              onClick={openConfirm}
            >
              Place order
            </button>
          </div>
        </aside>
      </div>

      {itemCount > 0 && (
        <div className="habibi-order-cart-bar" aria-hidden={false}>
          <div className="habibi-order-cart-bar__meta">
            <span className="habibi-order-cart-bar__count">{itemCount} items</span>
            <span className="habibi-order-cart-bar__total">{formatOrderPriceDisplay(subtotal)}</span>
          </div>
          <button
            type="button"
            className="habibi-order-btn habibi-order-btn--primary"
            disabled={!canOrder}
            onClick={openConfirm}
          >
            Place order
          </button>
        </div>
      )}
    </div>
  );
}
