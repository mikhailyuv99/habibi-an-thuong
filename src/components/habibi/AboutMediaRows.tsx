"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ABOUT_MEDIA_ROWS } from "@/data/about-media";

type MediaItem = { src: string; alt: string };

type RowProps = {
  direction: "ltr" | "rtl";
  items: MediaItem[];
  priority?: boolean;
};

const TILE_WIDTH = 232;
const TILE_HEIGHT = 172;
const FALLBACK_PHOTO = "/photos/photo-2.jpg";

/** Wide enough track for seamless -50% loop; duplicate set for CSS animation. */
function buildSeamlessLoop(items: MediaItem[]): MediaItem[] {
  if (items.length === 0) return [];
  let unit = [...items];
  while (unit.length < 8) {
    unit = [...unit, ...items];
  }
  return [...unit, ...unit];
}

export function getAboutMediaRows() {
  return ABOUT_MEDIA_ROWS;
}

/** @deprecated Use getAboutMediaRows() */
export function getAboutMediaRowPhotos() {
  return {
    row1: ABOUT_MEDIA_ROWS[0].items.map((item) => item.src),
    row2: ABOUT_MEDIA_ROWS[1].items.map((item) => item.src),
    row3: ABOUT_MEDIA_ROWS[2].items.map((item) => item.src),
  };
}

function CarouselTile({
  item,
  index,
  priority,
}: {
  item: MediaItem;
  index: number;
  priority: boolean;
}) {
  const [src, setSrc] = useState(item.src);

  return (
    <figure className="habibi-media-row__item">
      <Image
        src={src}
        alt={item.alt}
        width={TILE_WIDTH}
        height={TILE_HEIGHT}
        quality={88}
        sizes="(max-width: 767px) 212px, 232px"
        loading="eager"
        fetchPriority={priority && index < 4 ? "high" : undefined}
        className="habibi-media-row__photo"
        onError={() => {
          if (src !== FALLBACK_PHOTO) setSrc(FALLBACK_PHOTO);
        }}
      />
    </figure>
  );
}

/** Preload every unique carousel photo as soon as the about section mounts. */
export function AboutCarouselPreload() {
  const urls = useMemo(
    () => [
      ...new Set(ABOUT_MEDIA_ROWS.flatMap((row) => row.items.map((item) => item.src))),
    ],
    [],
  );

  useEffect(() => {
    urls.forEach((src) => {
      const img = new window.Image();
      img.decoding = "async";
      img.src = src;
    });
  }, [urls]);

  return null;
}

export function AboutMediaRow({ direction, items, priority = false }: RowProps) {
  const loop = buildSeamlessLoop(items);
  const half = loop.length / 2;
  if (loop.length === 0) return null;

  return (
    <div className={`habibi-media-row habibi-media-row--${direction}`}>
      <div className="habibi-media-row__track">
        {loop.map((item, i) => (
          <div
            key={`${item.src}-${i}`}
            className="habibi-media-row__cell"
            aria-hidden={i >= half || undefined}
          >
            <CarouselTile item={item} index={i} priority={priority} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** @deprecated Use AboutMediaRow inside AboutSection story blocks */
export function AboutMediaRows() {
  return (
    <>
      <AboutCarouselPreload />
      <section className="habibi-media-rows" aria-label="Photos from the restaurant">
        <AboutMediaRow direction="ltr" items={ABOUT_MEDIA_ROWS[0].items} priority />
        <AboutMediaRow direction="rtl" items={ABOUT_MEDIA_ROWS[1].items} />
        <AboutMediaRow direction="ltr" items={ABOUT_MEDIA_ROWS[2].items} />
      </section>
    </>
  );
}
