"use client";

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type Ref,
} from "react";
import { MENU_GROUPS, MENU_CATEGORIES, type MenuCategory } from "@/data/menu-categories";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const GROUP_LABELS: Record<string, "groupToStart" | "groupSlavic" | "groupArabic" | "groupQuick"> = {
  "To start": "groupToStart",
  Slavic: "groupSlavic",
  Arabic: "groupArabic",
  "Quick & drinks": "groupQuick",
};

const CAT_LABELS: Record<
  string,
  | "catAppetizers"
  | "catColdPlates"
  | "catSalads"
  | "catSoups"
  | "catGeorgian"
  | "catSlavicFood"
  | "catSlavicSnacks"
  | "catMandi"
  | "catArabicGrill"
  | "catKebabs"
  | "catWraps"
  | "catDrinks"
> = {
  appetizers: "catAppetizers",
  "cold-plates": "catColdPlates",
  salads: "catSalads",
  soups: "catSoups",
  georgian: "catGeorgian",
  slavic: "catSlavicFood",
  "slavic-snacks": "catSlavicSnacks",
  mandi: "catMandi",
  "arabic-grill": "catArabicGrill",
  kebabs: "catKebabs",
  "fast-bites": "catWraps",
  drinks: "catDrinks",
};

function boardsFor(category: MenuCategory): string[] {
  return category.boards?.length ? category.boards : [category.board];
}

export function MenuSection() {
  const { t, lang } = useLanguage();
  const categories = useMemo(() => MENU_CATEGORIES, []);
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "appetizers");
  const [viewerLayout, setViewerLayout] = useState<CSSProperties>({});
  const catsRef = useRef<HTMLElement>(null);
  const firstBtnRef = useRef<HTMLButtonElement>(null);
  const lastBtnRef = useRef<HTMLButtonElement>(null);
  const viewerRef = useRef<HTMLElement>(null);
  const active = categories.find((c) => c.id === activeId) ?? categories[0];
  const activeBoards = active ? boardsFor(active) : [];
  const activeLabel = active ? t.menu[CAT_LABELS[active.id] ?? "catAppetizers"] : "";

  const syncViewerLayout = useCallback(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) {
      setViewerLayout({});
      return;
    }
    const nav = catsRef.current;
    const first = firstBtnRef.current;
    const last = lastBtnRef.current;
    if (!nav || !first || !last) return;

    const navTop = nav.getBoundingClientRect().top;
    const firstTop = first.getBoundingClientRect().top - navTop;
    const lastBottom = last.getBoundingClientRect().bottom - navTop;

    setViewerLayout({
      marginTop: `${firstTop}px`,
      height: `${lastBottom - firstTop}px`,
    });
  }, []);

  useLayoutEffect(() => {
    syncViewerLayout();
    window.addEventListener("resize", syncViewerLayout);
    return () => window.removeEventListener("resize", syncViewerLayout);
  }, [syncViewerLayout, lang, activeId]);

  const scrollToViewer = useCallback(() => {
    if (typeof window === "undefined" || window.innerWidth >= 768) return;
    requestAnimationFrame(() => {
      viewerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const selectCategory = useCallback(
    (id: string) => {
      setActiveId(id);
      scrollToViewer();
    },
    [scrollToViewer],
  );

  return (
    <section className="habibi-menu-section" id="menu" aria-labelledby="menu-heading">
      <div className="habibi-page__inner habibi-page__inner--menu-wide">
        <header className="habibi-page__header">
          <p className="habibi-page__eyebrow">{t.menu.eyebrow}</p>
          <h2 id="menu-heading" className="habibi-page__title">
            {t.menu.title}
          </h2>
          <p className="habibi-page__lead">{t.menu.lead}</p>
        </header>

        <div className="habibi-menu-browser">
          <nav ref={catsRef} className="habibi-menu-cats" aria-label="Menu categories">
            {MENU_GROUPS.map((group) => {
              const groupKey = GROUP_LABELS[group.label];
              const groupLabel = groupKey ? t.menu[groupKey] : group.label;
              return (
                <div key={group.label} className="habibi-menu-cats__group">
                  <p className="habibi-menu-cats__label">{groupLabel}</p>
                  <ul className="habibi-menu-cats__list">
                    {group.categories.map((cat) => (
                      <li key={cat.id}>
                        <CategoryButton
                          category={cat}
                          label={t.menu[CAT_LABELS[cat.id] ?? "catAppetizers"]}
                          active={cat.id === activeId}
                          onSelect={() => selectCategory(cat.id)}
                          buttonRef={
                            cat.id === "appetizers"
                              ? firstBtnRef
                              : cat.id === "drinks"
                                ? lastBtnRef
                                : undefined
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>

          {active && (
            <figure
              ref={viewerRef}
              className="habibi-menu-viewer"
              id="menu-viewer"
              aria-labelledby="menu-viewer-title"
              style={viewerLayout}
            >
              <figcaption className="habibi-menu-viewer__title" id="menu-viewer-title">
                {activeLabel}
              </figcaption>
              <div
                className={`habibi-menu-viewer__frame${
                  activeBoards.length > 1 ? " habibi-menu-viewer__frame--stack" : ""
                }`}
              >
                {activeBoards.map((board, index) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={board}
                    src={board}
                    alt={
                      activeBoards.length > 1
                        ? `${activeLabel} (${index + 1}/${activeBoards.length})`
                        : activeLabel
                    }
                    className="habibi-menu-viewer__img"
                    decoding="async"
                  />
                ))}
              </div>
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}

function CategoryButton({
  category,
  label,
  active,
  onSelect,
  buttonRef,
}: {
  category: MenuCategory;
  label: string;
  active: boolean;
  onSelect: () => void;
  buttonRef?: Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className={`habibi-menu-cats__btn${active ? " habibi-menu-cats__btn--active" : ""}`}
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
    >
      {label}
    </button>
  );
}

/** @deprecated Use MenuSection on homepage */
export const MenuPageClient = MenuSection;
