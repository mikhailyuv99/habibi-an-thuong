"use client";

import telegramMedia from "@/data/telegram-media.json";

type RowProps = {
  direction: "ltr" | "rtl";
  photos: string[];
  priority?: boolean;
};

/** Build a track wide enough to fill the viewport, then double for seamless -50% loop. */
function buildSeamlessLoop(photos: string[]): string[] {
  if (photos.length === 0) return [];
  let unit = [...photos];
  while (unit.length < 10) {
    unit = [...unit, ...photos];
  }
  return [...unit, ...unit];
}

export function getAboutMediaRowPhotos() {
  const photos = telegramMedia.photos;
  const third = Math.ceil(photos.length / 3);
  return {
    row1: photos.slice(0, third),
    row2: photos.slice(third, third * 2),
    row3: photos.slice(third * 2),
  };
}

export function AboutMediaRow({ direction, photos, priority = false }: RowProps) {
  const loop = buildSeamlessLoop(photos);
  const half = loop.length / 2;
  if (loop.length === 0) return null;

  return (
    <div
      className={`habibi-media-row habibi-media-row--${direction}`}
      aria-hidden={false}
    >
      <div className="habibi-media-row__track">
        {loop.map((src, i) => {
          const isLead = priority && i < Math.min(6, half);
          return (
            <figure
              key={`${src}-${i}`}
              className="habibi-media-row__item"
              aria-hidden={i >= half || undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                loading={isLead ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={isLead ? "high" : undefined}
              />
            </figure>
          );
        })}
      </div>
    </div>
  );
}

/** @deprecated Use AboutMediaRow inside AboutSection story blocks */
export function AboutMediaRows() {
  const { row1, row2, row3 } = getAboutMediaRowPhotos();
  return (
    <section className="habibi-media-rows" aria-label="Photos from the restaurant">
      <AboutMediaRow direction="ltr" photos={row1} priority />
      <AboutMediaRow direction="rtl" photos={row2} />
      <AboutMediaRow direction="ltr" photos={row3} />
    </section>
  );
}
