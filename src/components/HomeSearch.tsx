"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PRODUCT_ORDER, PRODUCTS } from "@/lib/catalog";
import { Icon } from "./Icon";

export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const term = query.trim().toLowerCase();
  const hits = term
    ? PRODUCT_ORDER.filter((slug) =>
        `${PRODUCTS[slug].name} ${PRODUCTS[slug].pub} ${slug}`.toLowerCase().includes(term),
      )
    : [];

  const openFirst = () => {
    if (hits.length) router.push(`/topup?g=${hits[0]}`);
    else router.push("/game");
  };

  return (
    <>
      <form
        className="card mt-6 flex items-center gap-3 p-3"
        onSubmit={(event) => {
          event.preventDefault();
          openFirst();
        }}
      >
        <span className="pl-2" aria-hidden="true">
          <Icon name="search" />
        </span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="min-w-0 flex-1 bg-transparent py-2 text-base font-semibold outline-none sm:text-lg"
          placeholder="Cari game atau layanan… (contoh: mobile legends)"
          autoComplete="off"
          aria-label="Cari game atau layanan"
        />
        <button
          type="submit"
          className="btn btn-ink hidden min-h-[44px] px-5 py-2 sm:inline-flex"
        >
          Cari
        </button>
      </form>

      {term && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {hits.length ? (
            hits.map((slug) => {
              const product = PRODUCTS[slug];
              return (
                <Link
                  key={slug}
                  href={`/topup?g=${slug}`}
                  className="card flex items-center gap-3 p-3 shadow-none hover:bg-[var(--sky2)]"
                >
                  <span
                    className="dsp grid h-11 w-11 place-items-center rounded-xl text-white"
                    style={{
                      background: product.bg,
                      border: "2.5px solid var(--ink)",
                      WebkitTextStroke: "1.5px var(--ink)",
                      paintOrder: "stroke fill",
                    }}
                  >
                    {product.lt}
                  </span>
                  <span className="flex-1 font-bold">{product.name}</span>
                  <Icon name="arrow" />
                </Link>
              );
            })
          ) : (
            <div className="card p-4 font-semibold shadow-none sm:col-span-2 lg:col-span-3">
              Belum ada &quot;{query}&quot;. Coba: ml, free fire, pulsa.
            </div>
          )}
        </div>
      )}
    </>
  );
}
