"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { ProductTile } from "@/components/ProductTile";
import {
  GAME_KEYS,
  PPOB_KEYS,
  PRODUCT_ORDER,
  PRODUCTS,
  type Category,
} from "@/lib/catalog";

type Tab = "all" | Category;

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "game", label: "🎮 Game" },
  { key: "ppob", label: "📱 Pulsa & tagihan" },
];

export function GameCatalog() {
  const search = useSearchParams();
  const initial = search.get("c");
  const [cat, setCat] = useState<Tab>(initial === "game" || initial === "ppob" ? initial : "all");
  const [query, setQuery] = useState("");

  const term = query.trim().toLowerCase();
  const list = PRODUCT_ORDER.filter((slug) => {
    if (cat !== "all" && PRODUCTS[slug].cat !== cat) return false;
    if (!term) return true;
    return `${PRODUCTS[slug].name} ${PRODUCTS[slug].pub} ${slug}`
      .toLowerCase()
      .includes(term);
  });

  const countFor = (tab: Tab) =>
    tab === "all"
      ? PRODUCT_ORDER.length
      : (tab === "game" ? GAME_KEYS : PPOB_KEYS).length;

  return (
    <>
      <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h1 className="dsp text-[52px] sm:text-7xl">
          Mau top up
          <br />
          <span style={{ color: "var(--pk)" }}>apa hari ini?</span>
        </h1>
        <div className="relative md:w-[380px]">
          <span className="absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true">
            <Icon name="search" />
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="in pl-12"
            placeholder="Cari game atau layanan…"
            aria-label="Cari game atau layanan"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setCat(tab.key)}
            className={`chip ${cat === tab.key ? "on" : ""}`}
          >
            {tab.label} <span className="opacity-60">{countFor(tab.key)}</span>
          </button>
        ))}
      </div>

      <div className="mb-4 mt-4 flex items-center justify-between">
        <span className="mut text-sm font-bold">{list.length} produk</span>
        <span className="mut text-xs font-semibold">Harga masih contoh</span>
      </div>

      {list.length ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {list.map((slug) => (
            <ProductTile key={slug} slug={slug} />
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <div className="dsp text-4xl">Yah, nggak ketemu 😢</div>
          <p className="mut mt-2">
            Coba kata kunci lain, misalnya &quot;ml&quot; atau &quot;pulsa&quot;.
          </p>
        </div>
      )}
    </>
  );
}
