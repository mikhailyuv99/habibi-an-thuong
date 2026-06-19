"use client";

import { client } from "@/lib/client";
import { GOOGLE_WRITE_REVIEW_URL } from "@/lib/google-reviews";
import { social } from "@/lib/social";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { InstagramIcon, SocialLink, WhatsAppIcon, ZaloIcon } from "./SocialIcons";

const LOGO = "/brand/logo.png";

export function HeroClient() {
  const { t } = useLanguage();
  const rating = client.rating?.toFixed(1) ?? "4.6";
  const reviewCount = (client.review_count ?? 189).toLocaleString();
  const stars = "★".repeat(Math.round(client.rating ?? 4.6));

  return (
    <section className="habibi-hero habibi-hero--classic">
      <div className="habibi-hero__stack">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO}
          alt="Habibi Restaurant, Since 2022"
          width={560}
          height={840}
          className="habibi-hero__logo"
        />
        <p className="habibi-hero__kicker">{t.hero.kicker}</p>
        <h1 className="habibi-hero__title">{t.hero.title}</h1>
        <p className="habibi-hero__headline">{client.headline}</p>
        <p className="habibi-hero__meta">
          <span className="habibi-hero__stars" aria-label={`${rating} out of 5`}>
            {stars}
          </span>
          <span>{t.hero.meta(rating, reviewCount)}</span>
        </p>
        <a
          href={GOOGLE_WRITE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="habibi-hero__review-link"
        >
          {t.hero.leaveReview}
        </a>
        <p className="habibi-hero__address">{client.address}</p>

        <div className="habibi-hero__actions habibi-hero__actions--pair">
          <a
            href={social.reserve}
            target="_blank"
            rel="noopener noreferrer"
            className="habibi-hero__btn habibi-hero__btn--primary"
          >
            {t.hero.reserve}
          </a>
          <a href="/#menu-viewer" className="habibi-hero__btn habibi-hero__btn--secondary">
            {t.hero.menu}
          </a>
        </div>

        <div className="habibi-hero__social">
          <SocialLink href={social.whatsapp} label="WhatsApp">
            <WhatsAppIcon />
          </SocialLink>
          <SocialLink href={social.zalo} label="Zalo">
            <ZaloIcon />
          </SocialLink>
          <SocialLink href={social.instagram ?? undefined} label="Instagram">
            <InstagramIcon />
          </SocialLink>
        </div>
      </div>
    </section>
  );
}
