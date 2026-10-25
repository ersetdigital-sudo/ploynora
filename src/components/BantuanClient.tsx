"use client";

import Link from "next/link";
import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { ADMIN_WA, WA_LINK } from "@/lib/store";

type Cat = "bayar" | "pesanan" | "akun";

type Faq = {
  cat: Cat;
  q: string;
  a: string;
};

const FAQS: Faq[] = [
  {
    cat: "bayar",
    q: "Metode pembayaran apa saja yang tersedia?",
    a: "Semua pesanan dibayar lewat QRIS. Satu kode bisa discan dari aplikasi bank atau e-wallet apa pun: BCA, Mandiri, BRI, DANA, OVO, GoPay, ShopeePay, dan lainnya.",
  },
  {
    cat: "bayar",
    q: "Berapa lama pembayaran dikonfirmasi?",
    a: "Pembayaran dicek manual oleh tim. Setelah menekan tombol Saya sudah bayar, kirim kode PLY ke WhatsApp support supaya pesananmu cepat diverifikasi.",
  },
  {
    cat: "bayar",
    q: "Kode QRIS-nya ada di mana?",
    a: "Di halaman pembayaran yang muncul setelah checkout. Kalau halaman itu tertutup, buka lagi lewat kode PLY di halaman Cek Pesanan.",
  },
  {
    cat: "bayar",
    q: "Apakah ada biaya tambahan?",
    a: "Tidak. QRIS tanpa biaya tambahan. Total yang tampil di ringkasan adalah jumlah akhir yang kamu bayar.",
  },
  {
    cat: "pesanan",
    q: "Berapa lama item masuk ke akun?",
    a: "Mayoritas pesanan diproses otomatis dalam hitungan detik setelah pembayaran diverifikasi. Saat server game sedang sibuk, prosesnya bisa sampai 15 menit.",
  },
  {
    cat: "pesanan",
    q: "Di mana saya bisa lihat User ID dan Zone ID?",
    a: "Buka profil di dalam game. Untuk Mobile Legends, ID dan Zone ada di bawah nama akun, contoh 12345678 (1234).",
  },
  {
    cat: "pesanan",
    q: "Saya salah memasukkan ID, bisa dibatalkan?",
    a: "Pesanan yang sudah diteruskan ke provider tidak bisa ditarik. Selalu cek ulang ID dan nominal sebelum menekan tombol bayar.",
  },
  {
    cat: "pesanan",
    q: "Item belum masuk padahal sudah bayar?",
    a: "Cek status di halaman Cek Pesanan pakai kode PLY. Kalau transaksi gagal, dana dikembalikan otomatis ke metode pembayaran awal maksimal 1x24 jam.",
  },
  {
    cat: "akun",
    q: "Apakah harus daftar akun?",
    a: "Nggak perlu. Cukup isi ID game, pilih nominal, dan bayar. Simpan kode PLY untuk cek status kapan saja.",
  },
  {
    cat: "akun",
    q: "Apakah akun game saya aman?",
    a: "Kami hanya butuh ID publik, bukan password. Jangan pernah memberikan password akunmu ke siapa pun, termasuk yang mengaku dari Ploynora.",
  },
  {
    cat: "akun",
    q: "Bagaimana cara cek pesanan?",
    a: "Buka halaman Cek Pesanan, masukkan kode PLY yang muncul di halaman pembayaran. Status dan rincian pesanan langsung tampil.",
  },
];

const TABS: { key: "all" | Cat; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "bayar", label: "💳 Pembayaran" },
  { key: "pesanan", label: "📦 Pesanan" },
  { key: "akun", label: "👤 Akun" },
];

export function BantuanClient() {
  const [cat, setCat] = useState<"all" | Cat>("all");
  const [query, setQuery] = useState("");

  const term = query.trim().toLowerCase();
  const list = FAQS.filter((faq) => {
    if (cat !== "all" && faq.cat !== cat) return false;
    if (!term) return true;
    return `${faq.q} ${faq.a}`.toLowerCase().includes(term);
  });

  return (
    <main className="wrap pt-6 sm:pt-10">
      <Breadcrumbs
        items={[
          { label: "Beranda", href: "/" },
          { label: "Bantuan" },
        ]}
      />

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <h1 className="dsp text-[40px] sm:text-7xl">
            Ada yang bikin
            <br />
            <span style={{ color: "var(--pk)" }}>bingung?</span>
          </h1>

          <div className="relative mt-7">
            <span className="absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true">
              <Icon name="search" />
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="in pl-12"
              placeholder="Cari pertanyaan…"
              aria-label="Cari pertanyaan"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setCat(tab.key)}
                className={`chip ${cat === tab.key ? "on" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {list.length ? (
              list.map((faq) => (
                <details key={faq.q} className="fq">
                  <summary>
                    {faq.q}
                    <i>+</i>
                  </summary>
                  <p className="mut px-5 pb-5 font-medium leading-relaxed">{faq.a}</p>
                </details>
              ))
            ) : (
              <div className="card p-8 text-center font-bold">
                Belum ada jawaban untuk itu. Hubungi kami ya!
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="card card-sky p-6">
            <span
              className="grid h-12 w-12 place-items-center rounded-2xl bg-white"
              style={{ border: "3px solid var(--ink)" }}
            >
              <Icon name="chat" />
            </span>
            <div className="dsp mt-3 text-3xl">Masih butuh bantuan?</div>
            <p className="mt-2 font-semibold">
              Tim kami siap bantu soal pesanan yang belum masuk.
            </p>
            <div className="mt-5 space-y-3">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4"
                style={{ border: "2.5px solid var(--ink)" }}
              >
                <span className="font-extrabold">WhatsApp</span>
                <span className="text-sm font-bold">{ADMIN_WA}</span>
              </a>
            </div>
          </div>

          <Link href="/lacak" className="card card-pk block p-6">
            <div className="dsp text-3xl">Cek status pesanan</div>
            <p className="mt-1 font-semibold text-white/90">Pakai kode PLY kamu →</p>
          </Link>
        </aside>
      </div>
    </main>
  );
}
