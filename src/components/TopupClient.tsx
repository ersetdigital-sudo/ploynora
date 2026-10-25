"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { ProductArt } from "@/components/ProductArt";
import { formatRp, isSlug, PRODUCTS, type Item } from "@/lib/catalog";
import { newOrderId, saveOrder, type Order } from "@/lib/store";

export function TopupClient() {
  const search = useSearchParams();
  const raw = search.get("g");
  const slug = raw && isSlug(raw) ? raw : "ml";
  const prefill = search.get("n") ?? "";

  return <TopupForm key={`${slug}:${prefill}`} slug={slug} prefill={prefill} />;
}

function TopupForm({ slug, prefill }: { slug: string; prefill: string }) {
  const router = useRouter();
  const product = PRODUCTS[slug];

  const [uid, setUid] = useState(prefill);
  const [zone, setZone] = useState(product.server ? product.server[0] : "");
  const [provider, setProvider] = useState<string | null>(null);
  const [item, setItem] = useState<Item | null>(null);

  const zoneRequired = !!product.zone || !!product.server;
  const ready =
    !!item &&
    uid.trim().length >= 4 &&
    (!zoneRequired || zone.trim().length >= 2) &&
    (!product.providers || !!provider);
  const account = product.providers
    ? [provider, uid.trim()].filter(Boolean).join(" · ")
    : `${uid.trim()}${zone ? ` (${zone})` : ""}`;
  const total = item?.p ?? 0;

  const create = () => {
    if (!ready || !item) return;
    const id = newOrderId();
    const order: Order = {
      id,
      slug,
      name: product.name,
      item: item.n,
      account,
      amount: item.p,
      method: "QRIS",
      status: "processing",
      createdAt: Date.now(),
    };
    saveOrder(order);
    router.push(`/bayar?id=${id}`);
  };

  return (
    <>
      <main className="wrap no-chrome pb-focus pt-6 sm:pt-10">
        <Breadcrumbs
          items={[
            { label: "Beranda", href: "/" },
            { label: "Game", href: "/game" },
            { label: product.name },
          ]}
        />

        <div className="card card-sky mt-6 flex items-center gap-5 p-5 sm:p-7">
          <div
            className="w-20 flex-none overflow-hidden rounded-2xl sm:w-24"
            style={{ border: "3px solid var(--ink)" }}
          >
            <ProductArt slug={slug} small />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold">{product.pub}</div>
            <h1 className="dsp mt-1 text-4xl leading-none sm:text-6xl">{product.name}</h1>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
              <span className="chip px-3 py-1 text-xs">⚡ Proses otomatis</span>
              <span className="chip px-3 py-1 text-xs">🛡️ Aman</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0 space-y-6">
            <section className="card p-5 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="stepn">1</span>
                <h2 className="dsp text-3xl">Data akun</h2>
              </div>

              {product.providers && (
                <div className="mt-5">
                  <div className="mut mb-2 text-xs font-extrabold uppercase tracking-wide">
                    Pilih e-wallet
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.providers.map((wallet) => (
                      <button
                        key={wallet}
                        type="button"
                        onClick={() => setProvider(wallet)}
                        className={`chip ${provider === wallet ? "on" : ""}`}
                      >
                        {wallet}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div
                className={`mt-5 grid gap-3 ${zoneRequired ? "sm:grid-cols-2" : ""}`}
              >
                <input
                  value={uid}
                  onChange={(event) => setUid(event.target.value)}
                  className="in"
                  placeholder={`${product.f}: ${product.ph}`}
                  inputMode={product.phone ? "tel" : "text"}
                  aria-label={product.f}
                />
                {product.zone && (
                  <input
                    value={zone}
                    onChange={(event) => setZone(event.target.value)}
                    className="in"
                    placeholder="Zone ID: 1234"
                    inputMode="numeric"
                    aria-label="Zone ID"
                  />
                )}
                {product.server && (
                  <select
                    value={zone}
                    onChange={(event) => setZone(event.target.value)}
                    className="in"
                    aria-label="Server"
                  >
                    {product.server.map((server) => (
                      <option key={server} value={server}>
                        {server}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <p className="mut mt-3 text-sm font-semibold">
                {product.cat === "game"
                  ? `Cek ${product.f} di profil game kamu. Salah ID = item bisa nyasar.`
                  : product.providers
                    ? "Pilih e-wallet, lalu masukkan nomor yang terdaftar di aplikasi itu."
                    : "Pastikan nomor sudah benar sebelum bayar."}
              </p>
            </section>

            <section className="card p-5 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="stepn">2</span>
                <h2 className="dsp text-3xl">Pilih nominal</h2>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
                {product.items.map((option) => (
                  <button
                    key={option.n}
                    type="button"
                    onClick={() => setItem(option)}
                    className={`sel ${item?.n === option.n ? "on" : ""}`}
                  >
                    {option.h && <span className="tag">TERLARIS</span>}
                    <div className="font-extrabold leading-tight">{option.n}</div>
                    <div className="mt-2 text-sm font-bold opacity-80">
                      {formatRp(option.p)}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="card p-5 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="stepn">3</span>
                <h2 className="dsp text-3xl">Bayar pakai QRIS</h2>
              </div>
              <div className="mt-6">
                <div className="sel on flex items-start gap-3">
                  <span
                    className="grid h-11 w-11 flex-none place-items-center rounded-xl"
                    style={{
                      background: "var(--sky)",
                      color: "var(--ink)",
                      border: "2.5px solid var(--ink)",
                    }}
                  >
                    <Icon name="qr" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-lg font-extrabold">QRIS</span>
                      <span className="text-xs font-bold">Gratis</span>
                    </div>
                    <div className="mt-1 text-xs font-semibold opacity-85">
                      Semua bank, e-wallet, dan m-banking. Satu kode untuk semuanya.
                    </div>
                  </div>
                </div>
                <p className="mut mt-4 text-sm font-semibold">
                  Setelah pesanan dibuat, kode QRIS muncul di halaman pembayaran.
                  Simpan kode PLY untuk cek status.
                </p>
              </div>
            </section>
          </div>

          <aside className="sticky top-24 hidden lg:block">
            <div className="card p-6">
              <div className="dsp text-3xl">Ringkasan</div>
              <div className="mt-5 space-y-3">
                <div className="sum-line">
                  <span className="mut">Produk</span>
                  <span>{product.name}</span>
                </div>
                <div className="sum-line">
                  <span className="mut">{product.providers ? "E-wallet" : product.f}</span>
                  <span>{account || "—"}</span>
                </div>
                <div className="sum-line">
                  <span className="mut">Item</span>
                  <span>{item?.n ?? "—"}</span>
                </div>
                <div className="sum-line">
                  <span className="mut">Harga</span>
                  <span>{item ? formatRp(item.p) : "—"}</span>
                </div>
                <div className="sum-line">
                  <span className="mut">Metode</span>
                  <span>QRIS · gratis</span>
                </div>
              </div>
              <div
                className="mt-5 flex items-end justify-between pt-5"
                style={{ borderTop: "3px dashed var(--ink)" }}
              >
                <span className="font-bold">Total</span>
                <span className="dsp text-4xl" style={{ color: "var(--pk)" }}>
                  {item ? formatRp(total) : "Rp0"}
                </span>
              </div>
              <button
                type="button"
                onClick={create}
                disabled={!ready}
                className="btn btn-pk mt-5 w-full"
              >
                Bayar sekarang <Icon name="arrow" />
              </button>
              <p className="mut mt-3 text-center text-xs font-semibold">
                {ready
                  ? "Kamu akan dapat kode PLY untuk cek status."
                  : "Isi data akun & pilih nominal dulu ya."}
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-6">
          <Link href="/game" className="mut text-sm font-bold underline">
            ← Kembali pilih game lain
          </Link>
        </div>
      </main>

      <div className="buybar lg:hidden">
        <div className="min-w-0 flex-1">
          <div className="mut truncate text-xs font-bold">
            {item?.n ?? "Belum pilih nominal"}
          </div>
          <div className="dsp text-2xl" style={{ color: "var(--pk)" }}>
            {item ? formatRp(total) : "Rp0"}
          </div>
        </div>
        <button type="button" onClick={create} disabled={!ready} className="btn btn-pk">
          Bayar
        </button>
      </div>
    </>
  );
}
