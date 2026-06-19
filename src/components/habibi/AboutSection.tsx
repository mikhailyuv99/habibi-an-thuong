"use client";

import { useMemo } from "react";
import { client } from "@/lib/client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { AboutMediaRow, getAboutMediaRowPhotos } from "./AboutMediaRows";
import { ReviewCarouselRows } from "./ReviewCarouselRows";

export function AboutSection() {
  const { t } = useLanguage();
  const mediaRows = useMemo(() => getAboutMediaRowPhotos(), []);

  return (
    <section className="habibi-about" id="about" aria-labelledby="about-heading">
      <div className="habibi-about__inner">
        <header className="habibi-page__header">
          <p className="habibi-page__eyebrow">{t.about.eyebrow}</p>
          <h2 id="about-heading" className="habibi-page__title">
            {t.about.title}
          </h2>
          <p className="habibi-page__lead">{t.about.lead}</p>
        </header>

        <div className="habibi-about-story">
          <div className="habibi-about-story__text">
            <p>{t.about.p1}</p>
          </div>
          <AboutMediaRow direction="ltr" photos={mediaRows.row1} priority />

          <div className="habibi-about-story__text">
            <p>{t.about.p2}</p>
          </div>
          <AboutMediaRow direction="rtl" photos={mediaRows.row2} />

          <div className="habibi-about-story__text">
            <p>{t.about.p3}</p>
          </div>
          <AboutMediaRow direction="ltr" photos={mediaRows.row3} />

          <div className="habibi-about-story__text habibi-about-story__text--closing">
            <p>{t.about.p4}</p>
            <p>{t.about.p5}</p>
            {client.hours?.[0] && (
              <p className="habibi-about-hours">
                {client.hours[0]} · {client.phone}
              </p>
            )}
          </div>
        </div>

        <div className="habibi-reviews-section">
          <h3 className="habibi-section-label">{t.about.reviews}</h3>
          <ReviewCarouselRows />
        </div>
      </div>
    </section>
  );
}
