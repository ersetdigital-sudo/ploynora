import Link from "next/link";
import { GAME_KEYS, PRODUCTS } from "@/lib/catalog";
import { Logo } from "./Logo";

const MARQUEE = [
  "Top up kilat",
  "Harga bersahabat",
  "Bayar pakai QRIS",
  "Tanpa daftar",
  "Buka 24 jam",
];

function MarqueeGroup() {
  return (
    <div className="mq-g">
      {MARQUEE.map((text) => (
        <span key={text} className="flex items-center">
          <span className="mq-i">{text}</span>
          <svg className="mq-s" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 1.5l2.6 7.9 7.9 2.6-7.9 2.6L12 22.5l-2.6-7.9L1.5 12l7.9-2.6z" />
          </svg>
        </span>
      ))}
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="card-ink mt-24" style={{ borderTop: "3px solid var(--ink)" }}>
      <div className="mqb" aria-hidden="true">
        <div className="mq">
          <MarqueeGroup />
          <MarqueeGroup />
        </div>
      </div>
      <div className="wrap grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="logo text-white">
            <b>P</b>
            <span>
              ploynora<em>.</em>
            </span>
          </div>
          <p className="mt-4 max-w-sm" style={{ color: "#d9c9db" }}>
            Tempat top up game dan isi ulang harian yang cepat, aman, dan nggak
            bikin dompet nangis.
          </p>
        </div>
        <div>
          <div className="dsp text-xl" style={{ color: "var(--sky)" }}>
            Game
          </div>
          <div className="mt-3 grid gap-2 text-sm" style={{ color: "#d9c9db" }}>
            {GAME_KEYS.slice(0, 5).map((slug) => (
              <Link key={slug} href={`/topup?g=${slug}`} className="hover:text-white">
                {PRODUCTS[slug].name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="dsp text-xl" style={{ color: "var(--sky)" }}>
            Lainnya
          </div>
          <div className="mt-3 grid gap-2 text-sm" style={{ color: "#d9c9db" }}>
            <Link href="/game?c=ppob" className="hover:text-white">
              Pulsa &amp; tagihan
            </Link>
            <Link href="/lacak" className="hover:text-white">
              Cek pesanan
            </Link>
            <Link href="/bantuan" className="hover:text-white">
              Bantuan
            </Link>
          </div>
        </div>
      </div>
      <div className="wrap pb-8 text-xs" style={{ color: "#a08ea3" }}>
        © {year} Ploynora Games. Semua merek game milik pemiliknya masing-masing.
      </div>
    </footer>
  );
}
