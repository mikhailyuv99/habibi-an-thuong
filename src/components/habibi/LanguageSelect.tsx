"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Lang } from "@/lib/i18n/translations";

const OPTIONS: { value: Lang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "vi", label: "Tiếng Việt" },
  { value: "fr", label: "Français" },
  { value: "ru", label: "Русский" },
];

export function LanguageSelect() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const current = OPTIONS.find((o) => o.value === lang) ?? OPTIONS[0];

  return (
    <div className="habibi-lang" ref={rootRef}>
      <button
        type="button"
        className="habibi-lang__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="habibi-lang__code">{current.value.toUpperCase()}</span>
        <span className="habibi-lang__label">{current.label}</span>
        <span className="habibi-lang__chev" aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <ul className="habibi-lang__menu" role="listbox" aria-label="Language">
          {OPTIONS.map((opt) => (
            <li key={opt.value} role="option" aria-selected={opt.value === lang}>
              <button
                type="button"
                className={`habibi-lang__option${opt.value === lang ? " habibi-lang__option--active" : ""}`}
                onClick={() => {
                  setLang(opt.value);
                  setOpen(false);
                }}
              >
                <span className="habibi-lang__code">{opt.value.toUpperCase()}</span>
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
