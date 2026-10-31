"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { ProductArt } from "@/components/ProductArt";
import { formatRp, PRODUCTS } from "@/lib/catalog";
import {
  WA_LINK,
  formatDateTime,
  loadInvoices,
  type RecentInvoice,
} from "@/lib/store";

type PublicStatus = "success" | "processing" | "pending" | "expired";

type ApiOrder = {
  inv: string;
  status: PublicStatus;
  service: string;
  product: string;
  lines: [string, string][];
  method: string;
  total: number;
  sn: string;
  label: string;
  created: number;
  updated: number;
  paidAt?: number;
  qris: string | null;
};

const statusText: Record<PublicStatus, string> = {
  pending: "MENUNGGU PEMBAYARAN",
  processing: "SEDANG DIPROSES",
  success: "SELESAI",
  expired: "DIBATALKAN",
};

function slugOf(name: string) {
  const entry = Object.entries(PRODUCTS).find(([, product]) => product.name === name);
  return entry ? entry[0] : "ml";
}

export function LacakClient() {
  const search = useSearchParams();
  const idParam = (search.get("id") ?? "").trim().toUpperCase();
  const [query, setQuery] = useState(idParam);
  const [active, setActive] = useState(idParam);
  const [result, setResult] = useState<ApiOrder | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<RecentInvoice[]>([]);

  useEffect(() => {
    setInvoices(loadInvoices());
  }, []);

  const lookup = useCallback(async (code: string) => {
    if (!code) {
      setResult(undefined);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(code)}`, {
        cache: "no-store",
      });
      setResult(response.ok ? ((await response.json()) as ApiOrder) : null);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (idParam) void lookup(idParam);
  }, [idParam, lookup]);

  const show = (value: string) => {
    const id = value.trim().toUpperCase();
    setQuery(id);
    setActive(id);
    void lookup(id);
    if (id) {
      window.history.replaceState(null, "", `/lacak?id=${encodeURIComponent(id)}`);
    } else {
      window.history.replaceState(null, "", "/lacak");
    }
  };

  const select = (entry: RecentInvoice) => {
    show(entry.ref);
    document
      .getElementById("hasil")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
            placeholder="Masukkan kode PLY-XXXXXX"
            aria-label="Kode pesanan"
          />
          <button type="submit" className="btn btn-sky" disabled={loading}>
            {loading ? "Mencari…" : (
              <>
                Cek status <Icon name="arrow" />
              </>
            )}
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
          ) : loading ? (
            <div className="card p-8 text-center">
              <div className="dsp text-4xl">Mencari pesanan…</div>
            </div>
          ) : result ? (
            <OrderResult order={result} />
          ) : (
            <div className="card p-8 text-center">
              <div className="text-6xl">🔍</div>
              <div className="dsp mt-3 text-4xl">Kode nggak ketemu</div>
              <p className="mut mt-2 font-semibold">
                Cek lagi kode <b>{active}</b>. Pastikan kode sesuai dengan pesanan
                yang sudah dibuat.
              </p>
            </div>
          )}
        </div>

        <aside className="card p-6">
          <div className="dsp text-3xl">Riwayat di perangkat ini</div>
          <div className="mt-4 space-y-3">
            {invoices.length ? (
              invoices.slice(0, 5).map((entry) => (
                <button
                  key={entry.ref}
                  type="button"
                  onClick={() => select(entry)}
                  className="flex w-full items-center gap-3 rounded-2xl p-3 text-left hover:bg-[var(--sky2)]"
                  style={{ border: "2.5px solid var(--ink)" }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-extrabold">{entry.name}</div>
                    <div className="mut text-xs font-semibold">
                      {entry.ref} · {formatDateTime(entry.createdAt)}
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
            Status diambil langsung dari server. Log lokal cuma menyimpan kode
            invoice di browser ini.
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

function OrderResult({ order }: { order: ApiOrder }) {
  const [copied, setCopied] = useState(false);
  const target =
    order.lines.find(([label]) => /tujuan/i.test(label))?.[1] ?? "-";
  const paidDone = order.status === "processing" || order.status === "success";
  const steps = [
    {
      title: "Pesanan dibuat",
      detail: `checkout ${order.method}`,
      done: true,
    },
    {
      title:
        order.status === "expired"
          ? "Pesanan dibatalkan"
          : paidDone
            ? "Pembayaran diterima"
            : "Menunggu pembayaran",
      detail: `${formatRp(order.total)} · dicek manual`,
      done: paidDone,
    },
    {
      title:
        order.status === "success"
          ? "Pesanan selesai"
          : order.status === "processing"
            ? "Sedang diproses"
            : order.status === "expired"
              ? "Tidak diproses"
              : "Diproses setelah pembayaran",
      detail: "Pesanan diteruskan ke provider",
      done: order.status === "success",
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(order.inv);
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
          <ProductArt slug={slugOf(order.service)} small />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold">{order.inv}</div>
          <div className="dsp mt-1 text-4xl leading-none">{order.service}</div>
        </div>
        <div className="basis-full sm:basis-auto">
          <span
            className="inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-extrabold"
            style={{ background: "var(--yel)", border: "2.5px solid var(--ink)" }}
          >
            {statusText[order.status]}
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
            <span className="text-right">{order.product}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="mut">Akun</span>
            <span className="break-all text-right">{target}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="mut">Bayar</span>
            <span>{order.method}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="mut">Waktu</span>
            <span>{formatDateTime(order.created)}</span>
          </div>
        </div>

        {order.sn ? (
          <div
            className="mt-4 rounded-2xl p-4"
            style={{ background: "var(--sky2)", border: "2.5px solid var(--ink)" }}
          >
            <div className="mut text-xs font-bold">{order.label}</div>
            <div className="mt-1 break-all font-extrabold">{order.sn}</div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mut text-xs font-bold">TOTAL</div>
            <div className="dsp text-4xl" style={{ color: "var(--pk)" }}>
              {formatRp(order.total)}
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
            <Link href={`/topup?g=${slugOf(order.service)}`} className="btn btn-pk">
              Beli lagi
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
