"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSelect } from "./LanguageSelect";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { social } from "@/lib/social";

export function SiteNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const links = [
    { href: "/", label: t.nav.home, match: () => pathname === "/" },
    { href: "/#about", label: t.nav.about, match: () => pathname === "/" },
    { href: "/#menu", label: t.nav.menu, match: () => pathname === "/" },
    { href: "/#find-us", label: t.nav.findUs, match: () => pathname === "/" },
    { href: "/order", label: t.nav.order, match: () => pathname === "/order" },
  ] as const;

  return (
    <header className="habibi-nav">
      <div className="habibi-nav__inner">
        <nav className="habibi-nav__links" aria-label="Main">
          {links.map(({ href, label, match }) => (
            <Link
              key={href}
              href={href}
              className={`habibi-nav__link${match() ? " habibi-nav__link--active" : ""}`}
            >
              {label}
            </Link>
          ))}
          <a
            href={social.reserve}
            target="_blank"
            rel="noopener noreferrer"
            className="habibi-nav__link habibi-nav__link--cta"
          >
            {t.nav.reserve}
          </a>
        </nav>
        <LanguageSelect />
      </div>
    </header>
  );
}
