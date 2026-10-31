"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { ProductArt } from "@/components/ProductArt";
import { formatRp, PRODUCTS } from "@/lib/catalog";
import {
  ADMIN_WA,
  PAID_MESSAGE,
  QRIS_IMAGE,
  formatDate,
  waLink,
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

export function BayarClient() {
  const search = useSearchParams();
  const id = (search.get("id") ?? "").trim().toUpperCase();
  const [order, setOrder] = useState<ApiOrder | null | undefined>(undefined);
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!id) {
      setOrder(null);
      return;
    }
    setOrder(undefined);
    fetch(`/api/orders/${encodeURIComponent(id)}`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (alive) setOrder((data as ApiOrder | null) ?? null);
      })
      .catch(() => {
        if (alive) setOrder(null);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  const copyId = async () => {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.inv);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  if (order === undefined) {
    return (
      <main className="wrap no-chrome pb-focus pt-6 sm:pt-10">
        <div className="card p-8 font-semibold">Memuat pembayaran…</div>
      </main>
    );
  }

  if (order === null) {
    return (
      <main className="wrap no-chrome pt-6 sm:pt-10">
        <div className="card mx-auto max-w-xl p-8 text-center sm:p-10">
          <div className="text-6xl">🔍</div>
          <div className="dsp mt-3 text-4xl">Pesanan nggak ketemu</div>
          <p className="mut mt-2 font-semibold">
            Kode pesanan tidak cocok dengan data server. Cek kode PLY kamu di
            halaman Cek Pesanan, atau buat pesanan baru.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/game" className="btn btn-pk">
              Pilih game
            </Link>
            <Link href="/lacak" className="btn btn-w">
              Cek pesanan
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const target =
    order.lines.find(([label]) => /tujuan/i.test(label))?.[1] ?? "-";
  const activeStatus = paid ? "processing" : order.status;
  const canPay = activeStatus === "pending";
  const waMessage = waLink(
    `Halo, saya sudah bayar pesanan ${order.inv} sebesar ${formatRp(order.total)}. Mohon dicek ya.`,
  );

  return (
    <>
      <main className="wrap no-chrome pb-focus pt-6 sm:pt-10">
        <Breadcrumbs
          items={[
            { label: "Beranda", href: "/" },
            { label: "Cek Pesanan", href: "/lacak" },
            { label: "Pembayaran" },
          ]}
        />

        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex items-center gap-4">
            <div
              className="w-16 flex-none overflow-hidden rounded-2xl sm:w-20"
              style={{ border: "3px solid var(--ink)" }}
            >
              <ProductArt slug={slugOf(order.service)} small />
            </div>
            <div>
              <h1 className="dsp text-4xl leading-none sm:text-5xl">
                {paid
                  ? "Pembayaran diterima"
                  : activeStatus === "success"
                    ? "Pesanan selesai"
                    : activeStatus === "expired"
                      ? "Pesanan dibatalkan"
                      : "Selesaikan pembayaran"}
              </h1>
              <p className="mut mt-2 font-semibold">
                {order.service} · {order.product}
              </p>
            </div>
          </div>
          <span
            className="w-fit rounded-full px-4 py-2 text-xs font-extrabold"
            style={{
              background: activeStatus === "success" || paid ? "var(--sky)" : "var(--yel)",
              border: "2.5px solid var(--ink)",
            }}
          >
            {activeStatus === "success" || paid
              ? "✅ Selesai"
              : activeStatus === "expired"
                ? "✖ Dibatalkan"
                : "⏳ Menunggu pembayaran"}
          </span>
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_380px]">
          <section className="card p-5 sm:p-8">
            {!canPay ? (
              <div className="py-6 text-center">
                <span
                  className="mx-auto grid h-16 w-16 place-items-center rounded-2xl"
                  style={{
                    background: "var(--sky)",
                    border: "3px solid var(--ink)",
                    boxShadow: "4px 4px 0 var(--ink)",
                  }}
                >
                  <Icon name={activeStatus === "expired" ? "clock" : "check"} className="h-8 w-8" />
                </span>
                <h2 className="dsp mx-auto mt-6 max-w-md text-4xl leading-tight sm:text-5xl">
                  {paid
                    ? PAID_MESSAGE
                    : activeStatus === "success"
                      ? "Terima kasih, pesanan sudah selesai"
                      : "Pesanan sudah dibatalkan"}
                </h2>
                <p className="mut mx-auto mt-3 max-w-md font-semibold">
                  {paid
                    ? "Pembayaran QRIS kamu dicek tim kami, lalu pesanan diteruskan ke provider."
                    : activeStatus === "success"
                      ? "Item sudah dikirim. Cek detail dan SN di halaman Cek Pesanan."
                      : "Pesanan ini sudah tidak aktif. Silakan buat pesanan baru bila perlu."}{" "}
                  Pantau statusnya dengan kode{" "}
                  <b style={{ color: "var(--ink)" }}>{order.inv}</b>.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <Link href={`/lacak?id=${order.inv}`} className="btn btn-pk">
                    Cek pesanan <Icon name="arrow" />
                  </Link>
                  <a
                    href={waMessage}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-w"
                  >
                    <Icon name="chat" /> WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="stk">Scan pakai QRIS</span>
                    <div className="dsp mt-4 text-5xl sm:text-6xl">
                      {formatRp(order.total)}
                    </div>
                    <div className="mut mt-1 text-sm font-bold">
                      {order.inv} · {formatDate(order.created)}
                    </div>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-extrabold"
                    style={{ background: "var(--sky)", border: "2.5px solid var(--ink)" }}
                  >
                    Gratis biaya
                  </span>
                </div>

                <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                  <div
                    className="w-full max-w-[280px] shrink-0 overflow-hidden rounded-2xl bg-white p-3"
                    style={{ border: "3px solid var(--ink)" }}
                  >
                    <img
                      src={order.qris || QRIS_IMAGE}
                      alt="Kode QRIS untuk pembayaran pesanan"
                      className="block h-auto w-full rounded-xl"
                      width={520}
                      height={520}
                    />
                    <div className="mut mt-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                      <span>QRIS</span>
                      <span>semua bank &amp; e-wallet</span>
                    </div>
                  </div>
                  <ol className="w-full space-y-3 text-sm font-semibold leading-relaxed">
                    {[
                      "Buka aplikasi bank atau e-wallet pilihanmu.",
                      "Pilih menu bayar QRIS, lalu scan kode di samping.",
                      `Periksa nominal ${formatRp(order.total)} dan selesaikan pembayaran.`,
                      'Tekan "Saya sudah bayar" setelah transaksi berhasil.',
                    ].map((step, index) => (
                      <li key={step} className="flex gap-3">
                        <span
                          className="grid h-7 w-7 flex-none place-items-center rounded-lg text-xs font-extrabold"
                          style={{ background: "var(--sky2)", border: "2px solid var(--ink)" }}
                        >
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <button
                  type="button"
                  className="btn btn-pk mt-7 w-full"
                  onClick={() => setPaid(true)}
                >
                  Saya sudah bayar
                </button>
                <a
                  href={waMessage}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-w mt-3 w-full"
                >
                  <Icon name="chat" /> Konfirmasi via WhatsApp
                </a>
                <p className="mut mt-3 text-center text-xs font-semibold">
                  Pembayaran dicek manual · simpan kode {order.inv}
                </p>
              </>
            )}
          </section>

          <aside className="card p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="dsp text-3xl">Detail</div>
              <button
                type="button"
                onClick={copyId}
                className="mut flex items-center gap-1 text-xs font-extrabold"
                aria-label="Salin kode pesanan"
              >
                <Icon name="copy" className="h-4 w-4" />
                {copied ? "Tersalin!" : "Salin kode"}
              </button>
            </div>
            <div className="mt-4" style={{ borderTop: "2.5px dashed var(--ink)" }}>
              {[
                ["kode", order.inv],
                ["produk", order.service],
                ["item", order.product],
                ["akun", target],
                ["metode", order.method],
                ["status", statusText[activeStatus].toLowerCase()],
              ].map(([label, value]) => (
                <div key={label} className="invoice-line">
                  <span className="mut">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            <div
              className="mt-2 flex items-end justify-between pt-4"
              style={{ borderTop: "2.5px dashed var(--ink)" }}
            >
              <span className="font-bold">Total</span>
              <span className="dsp text-4xl" style={{ color: "var(--pk)" }}>
                {formatRp(order.total)}
              </span>
            </div>
            <div
              className="mt-5 rounded-2xl p-3 text-xs font-semibold leading-relaxed"
              style={{ background: "var(--yel)", border: "2.5px solid var(--ink)" }}
            >
              Pembayaran manual · QRIS diverifikasi tim. Simpan kode pesanan
              untuk cek status.
            </div>
            <p className="mut mt-4 text-xs font-semibold">
              Butuh bantuan? WhatsApp {ADMIN_WA}.
            </p>
          </aside>
        </div>
      </main>

      <div className="buybar lg:hidden">
        <div className="min-w-0 flex-1">
          <div className="mut truncate text-xs font-bold">
            {order.inv} · {statusText[activeStatus].toLowerCase()}
          </div>
          <div className="dsp text-2xl" style={{ color: "var(--pk)" }}>
            {formatRp(order.total)}
          </div>
        </div>
        {canPay ? (
          <button type="button" className="btn btn-pk" onClick={() => setPaid(true)}>
            Saya sudah bayar
          </button>
        ) : (
          <Link href={`/lacak?id=${order.inv}`} className="btn btn-pk">
            Cek
          </Link>
        )}
      </div>
    </>
  );
}
