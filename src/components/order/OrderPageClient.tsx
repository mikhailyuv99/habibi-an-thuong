"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  onIncrease,
  onDecrease,
}: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <div className="habibi-order-qty">
      <button
        type="button"
        className="habibi-order-qty__btn"
        aria-label="Decrease quantity"
        disabled={quantity === 0}
        onClick={onDecrease}
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
        onClick={onIncrease}
      >
        +
      </button>
    </div>
  );
}

function MenuItemCard({
  item,
  quantity,
  onIncrease,
  onDecrease,
}: {
  item: OrderMenuItem;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <article className="habibi-order-item">
      <div className="habibi-order-item__media">
        <Image
          src={item.image}
          alt=""
          width={88}
          height={88}
          sizes="88px"
          className="habibi-order-item__img"
          loading="lazy"
        />
      </div>
      <div className="habibi-order-item__content">
        <div className="habibi-order-item__head">
          <h3 className="habibi-order-item__name">{item.name}</h3>
          <p className="habibi-order-item__price">{formatOrderPriceDisplay(item.priceVnd)}</p>
        </div>
        {item.description && (
          <p className="habibi-order-item__desc">{item.description}</p>
        )}
        <div className="habibi-order-item__actions">
          <QuantityControl
            quantity={quantity}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
          />
        </div>
      </div>
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
  const [identErrors, setIdentErrors] = useState({ name: false, phone: false });
  const identRef = useRef<HTMLElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

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

  const ensureCustomerForOrder = useCallback((): boolean => {
    if (customer?.firstName && customer?.phone) return true;

    const firstName = draftName.trim();
    const phone = draftPhone.trim();
    const nameMissing = !firstName;
    const phoneMissing = !phone;

    if (nameMissing || phoneMissing) {
      setIdentErrors({ name: nameMissing, phone: phoneMissing });
      identRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (nameMissing) {
        nameInputRef.current?.focus();
      }
      return false;
    }

    const next = { firstName, phone };
    saveOrderCustomer(next);
    setCustomer(next);
    setIdentErrors({ name: false, phone: false });
    return true;
  }, [customer, draftName, draftPhone]);

  const increaseItem = useCallback(
    (id: string) => {
      if (!ensureCustomerForOrder()) return;
      setItemQuantity(id, (cart[id] ?? 0) + 1);
    },
    [cart, ensureCustomerForOrder, setItemQuantity],
  );

  const decreaseItem = useCallback(
    (id: string) => {
      setItemQuantity(id, Math.max(0, (cart[id] ?? 0) - 1));
    },
    [cart, setItemQuantity],
  );

  function saveCustomer(e: React.FormEvent) {
    e.preventDefault();
    const firstName = draftName.trim();
    const phone = draftPhone.trim();
    if (!firstName || !phone) {
      setIdentErrors({ name: !firstName, phone: !phone });
      return;
    }
    const next = { firstName, phone };
    saveOrderCustomer(next);
    setCustomer(next);
    setIdentErrors({ name: false, phone: false });
  }

  function openConfirm() {
    if (itemCount === 0) return;
    if (!ensureCustomerForOrder()) return;
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
            width={300}
            height={300}
            priority
            className="habibi-order-header__logo"
          />
        </header>
        <main className="habibi-order-success">
          <p className="habibi-order-success__eyebrow">Habibi Direct</p>
          <h1 className="habibi-order-success__title">Your order has been sent!</h1>
          <p className="habibi-order-success__lead">
            The team has your order and will confirm shortly.
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
            width={300}
            height={300}
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
          width={300}
          height={300}
          priority
          className="habibi-order-header__logo"
        />
        <h1 className="habibi-order-header__tagline">Order directly &amp; skip the queue</h1>
        <p className="habibi-order-header__trust">
          No app needed · Pickup only · Pay on arrival
        </p>
      </header>

      <section
        ref={identRef}
        id="order-ident"
        className={`habibi-order-ident${identErrors.name || identErrors.phone ? " habibi-order-ident--alert" : ""}`}
        aria-labelledby="order-ident-heading"
      >
        <h2 id="order-ident-heading" className="habibi-order-panel__title">
          {canOrder ? "Your details" : "Before you order"}
        </h2>
        {!canOrder && (
          <p className="habibi-order-ident__required">
            First name and phone are <strong>required</strong> before you can add items.
          </p>
        )}
        <form className="habibi-order-ident__form" onSubmit={saveCustomer}>
          <label
            className={`habibi-order-field${identErrors.name ? " habibi-order-field--error" : ""}`}
          >
            <span>First name *</span>
            <input
              ref={nameInputRef}
              type="text"
              name="firstName"
              autoComplete="given-name"
              required
              aria-invalid={identErrors.name}
              aria-describedby={identErrors.name ? "order-name-error" : undefined}
              value={draftName}
              onChange={(e) => {
                setDraftName(e.target.value);
                if (e.target.value.trim()) {
                  setIdentErrors((prev) => ({ ...prev, name: false }));
                }
              }}
            />
            {identErrors.name && (
              <span id="order-name-error" className="habibi-order-field__error" role="alert">
                Enter your first name to order.
              </span>
            )}
          </label>
          <label
            className={`habibi-order-field${identErrors.phone ? " habibi-order-field--error" : ""}`}
          >
            <span>Phone (WhatsApp preferred) *</span>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              required
              aria-invalid={identErrors.phone}
              aria-describedby={identErrors.phone ? "order-phone-error" : undefined}
              value={draftPhone}
              onChange={(e) => {
                setDraftPhone(e.target.value);
                if (e.target.value.trim()) {
                  setIdentErrors((prev) => ({ ...prev, phone: false }));
                }
              }}
            />
            {identErrors.phone && (
              <span id="order-phone-error" className="habibi-order-field__error" role="alert">
                Enter your phone so we can confirm your order.
              </span>
            )}
          </label>
          <button type="submit" className="habibi-order-btn habibi-order-btn--secondary">
            {canOrder ? "Update details" : "Save & start ordering"}
          </button>
        </form>
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
                    onIncrease={() => increaseItem(item.id)}
                    onDecrease={() => decreaseItem(item.id)}
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
              disabled={itemCount === 0}
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
            disabled={itemCount === 0}
            onClick={openConfirm}
          >
            Place order
          </button>
        </div>
      )}
    </div>
  );
}
