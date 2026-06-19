"use client";

import { useMemo } from "react";
import { client } from "@/lib/client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { AboutCarouselPreload, AboutMediaRow, getAboutMediaRows } from "./AboutMediaRows";
import { ReviewCarouselRows } from "./ReviewCarouselRows";
import { ScrollReveal } from "./ScrollReveal";

export function AboutSection() {
  const { t } = useLanguage();
  const mediaRows = useMemo(() => getAboutMediaRows(), []);

  return (
    <section className="habibi-about" id="about" aria-labelledby="about-heading">
      <div className="habibi-about__inner">
        <ScrollReveal>
          <header className="habibi-page__header">
            <p className="habibi-page__eyebrow">{t.about.eyebrow}</p>
            <h2 id="about-heading" className="habibi-page__title">
              {t.about.title}
            </h2>
            <p className="habibi-page__lead">{t.about.lead}</p>
          </header>
        </ScrollReveal>

        <AboutCarouselPreload />

        <div className="habibi-about-story">
          <ScrollReveal variant="left">
            <div className="habibi-about-story__text">
              <p>{t.about.p1}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <AboutMediaRow direction="ltr" items={mediaRows[0].items} priority />
          </ScrollReveal>

          <ScrollReveal variant="right">
            <div className="habibi-about-story__text">
              <p>{t.about.p2}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <AboutMediaRow direction="rtl" items={mediaRows[1].items} />
          </ScrollReveal>

          <ScrollReveal variant="left">
            <div className="habibi-about-story__text">
              <p>{t.about.p3}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <AboutMediaRow direction="ltr" items={mediaRows[2].items} />
          </ScrollReveal>

          <ScrollReveal>
            <div className="habibi-about-story__text habibi-about-story__text--closing">
              <p>{t.about.p4}</p>
              <p>{t.about.p5}</p>
              {client.hours?.[0] && (
                <p className="habibi-about-hours">
                  {client.hours[0]} · {client.phone}
                </p>
              )}
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className="habibi-reviews-section">
            <h3 className="habibi-section-label">{t.about.reviews}</h3>
            <ReviewCarouselRows />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
