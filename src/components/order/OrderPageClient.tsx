"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OrderPageHeader } from "@/components/order/OrderPageHeader";
import { OrderSocialLinks } from "@/components/order/OrderSocialLinks";
import {
  formatOrderPriceDisplay,
  type OrderMenuItem,
} from "@/data/order-menu";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getLocalizedOrderMenu } from "@/lib/order-menu-localized";
import {
  type OrderCustomer,
  loadOrderCustomer,
  saveOrderCustomer,
} from "@/lib/order-storage";
import {
  PICKUP_OPTIONS,
  cartSubtotal,
  type PickupTime,
} from "@/lib/order-whatsapp";

type Step = "menu" | "confirm" | "success";

type CartLine = { item: OrderMenuItem; quantity: number };

function cartLinesFromMenu(cart: Record<string, number>, menuById: Map<string, OrderMenuItem>): CartLine[] {
  return Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, quantity]) => {
      const item = menuById.get(id);
      if (!item) return null;
      return { item, quantity };
    })
    .filter((line): line is CartLine => line !== null);
}

function QtyIcon({ kind }: { kind: "plus" | "minus" }) {
  return (
    <svg className="habibi-order-qty__icon" viewBox="0 0 16 16" aria-hidden="true">
      {kind === "minus" ? (
        <path d="M3.5 8h9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      ) : (
        <>
          <path d="M8 3.5v9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M3.5 8h9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  decreaseLabel,
  increaseLabel,
}: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  decreaseLabel: string;
  increaseLabel: string;
}) {
  return (
    <div className="habibi-order-qty">
      <button
        type="button"
        className="habibi-order-qty__btn"
        aria-label={decreaseLabel}
        disabled={quantity === 0}
        onClick={onDecrease}
      >
        <QtyIcon kind="minus" />
      </button>
      <span className="habibi-order-qty__value" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        className="habibi-order-qty__btn"
        aria-label={increaseLabel}
        onClick={onIncrease}
      >
        <QtyIcon kind="plus" />
      </button>
    </div>
  );
}

function MenuItemCard({
  item,
  quantity,
  onIncrease,
  onDecrease,
  decreaseLabel,
  increaseLabel,
}: {
  item: OrderMenuItem;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  decreaseLabel: string;
  increaseLabel: string;
}) {
  return (
    <article className="habibi-order-item">
      {item.image ? (
        <div className="habibi-order-item__media">
          <Image
            src={item.image}
            alt={item.name}
            width={96}
            height={96}
            sizes="96px"
            className="habibi-order-item__img"
            loading="lazy"
            quality={90}
          />
        </div>
      ) : null}
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
            decreaseLabel={decreaseLabel}
            increaseLabel={increaseLabel}
          />
        </div>
      </div>
    </article>
  );
}

export function OrderPageClient() {
  const { t, lang } = useLanguage();
  const o = t.order;

  const orderMenu = useMemo(() => getLocalizedOrderMenu(lang, t), [lang, t]);
  const menuById = useMemo(
    () => new Map(orderMenu.flatMap((cat) => cat.items.map((item) => [item.id, item] as const))),
    [orderMenu],
  );

  const [hydrated, setHydrated] = useState(false);
  const [customer, setCustomer] = useState<OrderCustomer | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftPhone, setDraftPhone] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [step, setStep] = useState<Step>("menu");
  const [pickup, setPickup] = useState<PickupTime>("ASAP");
  const [activeCategory, setActiveCategory] = useState(orderMenu[0]?.id ?? "");
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

  useEffect(() => {
    if (orderMenu[0]?.id) {
      setActiveCategory((prev) => (orderMenu.some((c) => c.id === prev) ? prev : orderMenu[0].id));
    }
  }, [orderMenu]);

  const canOrder = Boolean(customer?.firstName && customer?.phone);
  const lines = useMemo(() => cartLinesFromMenu(cart, menuById), [cart, menuById]);
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
        throw new Error(data.error ?? o.sendError);
      }

      setStep("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSendError(error instanceof Error ? error.message : o.sendError);
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
        <OrderPageHeader showSocial={false} />
        <main className="habibi-order-success">
          <p className="habibi-order-success__eyebrow">{o.successEyebrow}</p>
          <h1 className="habibi-order-success__title">{o.successTitle}</h1>
          <p className="habibi-order-success__lead">{o.successLead}</p>
          <p className="habibi-order-success__social-lead">{o.followSocial}</p>
          <OrderSocialLinks className="habibi-order-social--success" />
          <div className="habibi-order-success__actions">
            <Link href="/" className="habibi-order-btn habibi-order-btn--primary">
              {o.visitSite}
            </Link>
            <button type="button" className="habibi-order-btn habibi-order-btn--ghost" onClick={orderAgain}>
              {o.orderAgain}
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="habibi-order">
        <OrderPageHeader tagline={o.reviewTagline} taglineAs="p" />

        <main className="habibi-order-confirm">
          <section className="habibi-order-panel">
            <h2 className="habibi-order-panel__title">{o.customer}</h2>
            <p className="habibi-order-confirm__line">
              {customer?.firstName} · {customer?.phone}
            </p>
          </section>

          <section className="habibi-order-panel">
            <h2 className="habibi-order-panel__title">{o.pickupTime}</h2>
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
            <h2 className="habibi-order-panel__title">{o.yourOrder}</h2>
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
              {o.subtotal} <strong>{formatOrderPriceDisplay(subtotal)}</strong>
            </p>
            <button
              type="button"
              className="habibi-order-btn habibi-order-btn--secondary habibi-order-confirm__add-more"
              disabled={sending}
              onClick={() => setStep("menu")}
            >
              {o.addMoreItems}
            </button>
          </section>

          <div className="habibi-order-confirm__actions">
            {sendError && (
              <p className="habibi-order-confirm__error" role="alert">
                {sendError}
              </p>
            )}
            <button
              type="button"
              className="habibi-order-btn habibi-order-btn--primary"
              disabled={sending}
              onClick={sendOrder}
            >
              {sending ? o.sending : o.confirmOrder}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="habibi-order">
      <OrderPageHeader tagline={o.tagline} trust={o.trust} />

      <div className="habibi-order-body">
      <section
        ref={identRef}
        id="order-ident"
        className={`habibi-order-ident${identErrors.name || identErrors.phone ? " habibi-order-ident--alert" : ""}`}
        aria-labelledby="order-ident-heading"
      >
        <h2 id="order-ident-heading" className="habibi-order-panel__title">
          {canOrder ? o.yourDetails : o.beforeOrder}
        </h2>
        {!canOrder && (
          <p className="habibi-order-ident__required">{o.requiredHint}</p>
        )}
        <form className="habibi-order-ident__form" onSubmit={saveCustomer}>
          <label
            className={`habibi-order-field${identErrors.name ? " habibi-order-field--error" : ""}`}
          >
            <span>{o.firstName}</span>
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
                {o.nameError}
              </span>
            )}
          </label>
          <label
            className={`habibi-order-field${identErrors.phone ? " habibi-order-field--error" : ""}`}
          >
            <span>{o.phone}</span>
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
                {o.phoneError}
              </span>
            )}
          </label>
          <button type="submit" className="habibi-order-btn habibi-order-btn--secondary">
            {canOrder ? o.updateDetails : o.saveStart}
          </button>
        </form>
      </section>

      <div className="habibi-order-layout">
        <div className="habibi-order-menu">
          <div className="habibi-order-cats-wrap">
          <nav className="habibi-order-cats" aria-label={o.menuCategories}>
            {orderMenu.map((cat) => (
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
          </div>

          {orderMenu.map((cat) => (
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
                    decreaseLabel={o.decreaseQty}
                    increaseLabel={o.increaseQty}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="habibi-order-cart" aria-label={o.cartLabel}>
          <div className="habibi-order-cart__panel">
            <h2 className="habibi-order-cart__title">{o.yourOrder}</h2>
            {lines.length === 0 ? (
              <p className="habibi-order-cart__empty">{o.addItems}</p>
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
              {o.subtotal}{" "}
              <strong>{itemCount > 0 ? formatOrderPriceDisplay(subtotal) : formatOrderPriceDisplay(0)}</strong>
            </p>
            <button
              type="button"
              className="habibi-order-btn habibi-order-btn--primary habibi-order-cart__cta"
              disabled={itemCount === 0}
              onClick={openConfirm}
            >
              {o.placeOrder}
            </button>
          </div>
        </aside>
      </div>
      </div>

      {itemCount > 0 && (
        <div className="habibi-order-cart-bar" aria-hidden={false}>
          <div className="habibi-order-cart-bar__meta">
            <span className="habibi-order-cart-bar__count">{o.items(itemCount)}</span>
            <span className="habibi-order-cart-bar__total">{formatOrderPriceDisplay(subtotal)}</span>
          </div>
          <button
            type="button"
            className="habibi-order-btn habibi-order-btn--primary"
            disabled={itemCount === 0}
            onClick={openConfirm}
          >
            {o.placeOrder}
          </button>
        </div>
      )}
    </div>
  );
}
