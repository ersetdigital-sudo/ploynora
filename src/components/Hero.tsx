"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HERO_ROTATION, PRODUCTS } from "@/lib/catalog";
import { Icon } from "./Icon";

export function Hero() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const timeout = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => {
      setPhase("out");
      timeout.current = window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % HERO_ROTATION.length);
        setPhase("in");
        timeout.current = window.setTimeout(() => setPhase("idle"), 30);
      }, 320);
    }, 2600);
    return () => {
      window.clearInterval(interval);
      if (timeout.current) window.clearTimeout(timeout.current);
    };
  }, []);

  const current = HERO_ROTATION[index];
  const product = PRODUCTS[current.slug];

  return (
    <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.25fr_1fr]">
      <div>
        <span className="stk">⚡ Masuk dalam hitungan detik</span>
        <h1 className="dsp mt-6 text-[48px] sm:text-[72px] lg:text-[80px] xl:text-[96px]">
          Top up game,
          <br />
          <span className="rot-w">
            <span
              className={`rot ${phase}`}
              style={{
                color: "var(--pk)",
                WebkitTextStroke: "3px var(--ink)",
                paintOrder: "stroke fill",
              }}
            >
              {current.word}
            </span>
          </span>
        </h1>
        <p className="mt-5 max-w-lg text-lg font-medium sm:text-xl">
          Diamond, UC, sampai Robux. Plus pulsa, kuota, e-wallet, dan token
          listrik. Tanpa daftar, bayar pakai QRIS.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/game" className="btn btn-pk">
            Pilih game <Icon name="arrow" />
          </Link>
          <Link href="/lacak" className="btn btn-w">
            Cek pesanan
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold">
          <span className="flex items-center gap-2">
            <Icon name="shield" className="h-5 w-5" />
            Transaksi aman
          </span>
          <span className="flex items-center gap-2">
            <Icon name="clock" className="h-5 w-5" />
            Buka 24 jam
          </span>
          <span className="flex items-center gap-2">
            <Icon name="gem" className="h-5 w-5" />
            12 produk
          </span>
        </div>
      </div>

      <div className="relative">
        <div
          className="float mx-auto aspect-square max-w-[460px] overflow-hidden rounded-[32px]"
          style={{ border: "3px solid var(--ink)", boxShadow: "8px 8px 0 var(--ink)" }}
        >
          <img
            src="/hero.png"
            alt="Ilustrasi stik game, diamond, dan koin"
            className="h-full w-full scale-[1.05] object-cover"
            width={920}
            height={920}
          />
        </div>
        <div
          className="card wig absolute -left-2 bottom-8 hidden items-center gap-3 px-4 py-3 sm:flex"
          style={{ borderRadius: 18 }}
        >
          <span
            className="dsp grid h-10 w-10 place-items-center rounded-xl text-white"
            style={{
              background: product.bg,
              border: "2.5px solid var(--ink)",
              transition: "background .3s",
            }}
          >
            {current.lt}
          </span>
          <div>
            <div className="text-sm font-extrabold">{current.item}</div>
            <div className="text-xs font-bold" style={{ color: "#16a34a" }}>
              ✓ Terkirim · 6 dtk
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
