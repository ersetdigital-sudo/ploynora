"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { ProductArt } from "@/components/ProductArt";
import { formatRp } from "@/lib/catalog";
import {
  WA_LINK,
  formatDateTime,
  loadOrders,
  type Order,
} from "@/lib/store";

export function LacakClient() {
  const search = useSearchParams();
  const idParam = (search.get("id") ?? "").trim().toUpperCase();
  const [query, setQuery] = useState(idParam);
  const [active, setActive] = useState(idParam);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  const show = (value: string) => {
    const id = value.trim().toUpperCase();
    setQuery(id);
    setActive(id);
    if (id) {
      window.history.replaceState(null, "", `/lacak?id=${encodeURIComponent(id)}`);
    } else {
      window.history.replaceState(null, "", "/lacak");
    }
  };

  const select = (order: Order) => {
    show(order.id);
    document
      .getElementById("hasil")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const order = active ? orders.find((entry) => entry.id === active) : undefined;

  return (
    <main className="wrap no-foot pb-12 pt-6 sm:pt-10">
      <Breadcrumbs
        items={[
          { label: "Beranda", href: "/" },
          { label: "Cek Pesanan" },
        ]}
      />

      <div className="card card-pk relative mt-6 overflow-hidden p-6 sm:p-10">
        <h1 className="dsp relative z-10 text-[40px] sm:text-7xl">
          Pesananmu
          <br />
          <span style={{ color: "var(--sky)" }}>udah sampai mana?</span>
        </h1>
        <form
          className="relative z-10 mt-7 flex max-w-2xl flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            show(query);
          }}
        >
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="in uppercase"
            placeholder="Masukkan kode, contoh PLY-7KQ2MX"
            aria-label="Kode pesanan"
          />
          <button type="submit" className="btn btn-sky">
            Cek status <Icon name="arrow" />
          </button>
        </form>
        <div
          className="absolute -right-20 -top-20 h-72 w-72 rounded-full"
          style={{ background: "var(--sky)", opacity: 0.3 }}
        />
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_360px]">
        <div id="hasil" className="min-w-0">
          {!active ? (
            <div className="card card-sky p-8 text-center sm:p-10">
              <div className="wig inline-block text-6xl">🎮</div>
              <div className="dsp mt-3 text-4xl">Belum ada yang dicek</div>
              <p className="mt-2 font-semibold">
                Masukkan kode PLY dari halaman checkout, atau mulai top up dulu.
              </p>
              <Link href="/game" className="btn btn-pk mt-6">
                Mulai top up
              </Link>
            </div>
          ) : !order ? (
            <div className="card p-8 text-center">
              <div className="text-6xl">🔍</div>
              <div className="dsp mt-3 text-4xl">Kode nggak ketemu</div>
              <p className="mut mt-2 font-semibold">
                Cek lagi kode <b>{active}</b>. Pesanan hanya tersimpan di
                perangkat tempat kamu checkout.
              </p>
            </div>
          ) : (
            <OrderResult order={order} />
          )}
        </div>

        <aside className="card p-6">
          <div className="dsp text-3xl">Riwayat di perangkat ini</div>
          <div className="mt-4 space-y-3">
            {orders.length ? (
              orders.slice(0, 5).map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => select(entry)}
                  className="flex w-full items-center gap-3 rounded-2xl p-3 text-left hover:bg-[var(--sky2)]"
                  style={{ border: "2.5px solid var(--ink)" }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-extrabold">{entry.name}</div>
                    <div className="mut text-xs font-semibold">
                      {entry.id} · {formatDateTime(entry.createdAt)}
                    </div>
                  </div>
                  <span className="text-sm font-bold">{formatRp(entry.amount)}</span>
                </button>
              ))
            ) : (
              <p className="mut text-sm font-semibold">Belum ada transaksi.</p>
            )}
          </div>
          <div
            className="mt-5 rounded-2xl p-3 text-xs font-semibold leading-relaxed"
            style={{ background: "var(--yel)", border: "2.5px solid var(--ink)" }}
          >
            Status sedang diproses akan diperbarui lewat WhatsApp. Simpan kode PLY
            kamu.
          </div>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noreferrer"
            className="btn btn-w mt-3 w-full"
          >
            <Icon name="chat" /> Tanya status
          </a>
        </aside>
      </div>
    </main>
  );
}

function OrderResult({ order }: { order: Order }) {
  const [copied, setCopied] = useState(false);
  const steps = [
    { title: "Pesanan dibuat", detail: `checkout ${order.method}`, done: true },
    {
      title: "Pembayaran diterima",
      detail: `${formatRp(order.amount)} · dicek manual`,
      done: true,
    },
    {
      title: "Sedang diproses",
      detail: "Pesanan diteruskan ke provider",
      done: false,
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(order.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <article className="card overflow-hidden">
      <div
        className="flex flex-wrap items-center gap-5 p-6 sm:p-8"
        style={{ background: "var(--sky)", borderBottom: "3px solid var(--ink)" }}
      >
        <div
          className="w-16 flex-none overflow-hidden rounded-2xl"
          style={{ border: "3px solid var(--ink)" }}
        >
          <ProductArt slug={order.slug} small />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold">{order.id}</div>
          <div className="dsp mt-1 text-4xl leading-none">{order.name}</div>
        </div>
        <div className="basis-full sm:basis-auto">
          <span
            className="inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-extrabold"
            style={{ background: "var(--yel)", border: "2.5px solid var(--ink)" }}
          >
            ⏳ Sedang diproses
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="space-y-5">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-start gap-4">
              <span
                className="stepn"
                style={
                  step.done
                    ? { background: "var(--pk)", color: "#fff" }
                    : { background: "var(--yel)" }
                }
              >
                {step.done ? "✓" : index + 1}
              </span>
              <div>
                <div className="font-extrabold">{step.title}</div>
                <div className="mut text-sm font-semibold">{step.detail}</div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-8 grid gap-3 pt-6 text-sm font-semibold sm:grid-cols-2"
          style={{ borderTop: "3px dashed var(--ink)" }}
        >
          <div className="flex justify-between gap-4">
            <span className="mut">Item</span>
            <span className="text-right">{order.item}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="mut">Akun</span>
            <span className="break-all text-right">{order.account}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="mut">Bayar</span>
            <span>{order.method}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="mut">Waktu</span>
            <span>{formatDateTime(order.createdAt)}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mut text-xs font-bold">TOTAL</div>
            <div className="dsp text-4xl" style={{ color: "var(--pk)" }}>
              {formatRp(order.amount)}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={copy} className="btn btn-w">
              {copied ? "✓ Tersalin!" : (
                <>
                  <Icon name="copy" /> Salin kode
                </>
              )}
            </button>
            <Link href={`/topup?g=${order.slug}`} className="btn btn-pk">
              Beli lagi
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
