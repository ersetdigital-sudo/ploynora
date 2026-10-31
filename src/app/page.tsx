import Link from "next/link";
import { Hero } from "@/components/Hero";
import { HomeSearch } from "@/components/HomeSearch";
import { Icon } from "@/components/Icon";
import { ProductTile } from "@/components/ProductTile";
import { formatRp, GAME_KEYS, PPOB_KEYS, PRODUCTS } from "@/lib/catalog";
import { getStorefront } from "@/lib/catalog-hydrate";

const STEPS = [
  {
    title: "Pilih game",
    body: "Cari game atau layanan, lalu masukkan ID akun kamu.",
    style: "",
  },
  {
    title: "Pilih nominal & bayar",
    body: "Scan satu QRIS dari aplikasi bank atau e-wallet apa pun.",
    style: "card-sky md:-rotate-1",
  },
  {
    title: "Langsung masuk",
    body: "Item diproses otomatis. Simpan kode PLY untuk cek status.",
    style: "card-pk",
  },
];

export default async function HomePage() {
  const storefront = await getStorefront();

  return (
    <main>
      <section className="wrap pt-8 lg:pt-14">
        <div className="card card-sky relative overflow-hidden p-6 sm:p-10 lg:p-14">
          <Hero />
          <svg
            className="absolute -right-10 -top-10 w-56 opacity-60"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <circle cx="50" cy="50" r="48" fill="#fff" />
          </svg>
        </div>

        <HomeSearch />
      </section>

      <section className="wrap pt-20">
        <div className="rv flex items-end justify-between gap-4">
          <div>
            <span className="stk" style={{ background: "var(--sky)" }}>
              🎮 Lagi rame
            </span>
            <h2 className="dsp mt-4 text-5xl sm:text-6xl">
              Game favorit
              <br className="sm:hidden" /> minggu ini
            </h2>
          </div>
          <Link href="/game" className="btn btn-w hidden sm:inline-flex">
            Lihat semua <Icon name="arrow" />
          </Link>
        </div>
        <div className="rv mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
          {GAME_KEYS.map((slug) => (
            <ProductTile key={slug} slug={slug} min={storefront.minPrices[slug]} />
          ))}
        </div>
        <Link href="/game" className="btn btn-w mt-6 w-full sm:hidden">
          Lihat semua game
        </Link>
      </section>

      <section className="wrap pt-20">
        <div className="rv card card-ink p-6 sm:p-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="stk">📱 Bukan cuma game</span>
              <h2 className="dsp mt-4 text-5xl text-white sm:text-6xl">
                Isi ulang harian
                <br />
                juga bisa.
              </h2>
            </div>
            <p className="max-w-sm" style={{ color: "#d9c9db" }}>
              Pulsa, kuota, saldo e-wallet, sampai token listrik. Satu tempat,
              satu cara bayar.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {PPOB_KEYS.map((slug) => {
              const product = PRODUCTS[slug];
              return (
                <Link
                  key={slug}
                  href={`/topup?g=${slug}`}
                  className="flex flex-col gap-4 rounded-[20px] bg-white p-5 text-[var(--ink)] transition hover:-translate-y-1"
                  style={{ border: "3px solid var(--ink)" }}
                >
                  <span
                    className="grid h-12 w-12 place-items-center rounded-2xl"
                    style={{ background: "var(--sky)", border: "2.5px solid var(--ink)" }}
                  >
                    {product.icon && <Icon name={product.icon} />}
                  </span>
                  <div>
                    <div className="dsp text-2xl">{product.name}</div>
                    <div className="mut text-sm font-semibold">
                      mulai {formatRp(storefront.minPrices[slug])}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="wrap pt-20">
        <div className="rv text-center">
          <span className="stk" style={{ background: "var(--pk)", color: "#fff" }}>
            ✨ Gampang banget
          </span>
          <h2 className="dsp mt-4 text-5xl sm:text-6xl">
            Tiga langkah, langsung main
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.title} className={`rv card p-7 ${step.style}`}>
              <div
                className="stepn"
                style={index > 0 ? { background: "#fff" } : undefined}
              >
                {index + 1}
              </div>
              <h3 className="dsp mt-5 text-3xl">{step.title}</h3>
              <p className={`mt-2 ${index === 2 ? "text-white/90" : ""}`}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap pt-20">
        <div className="rv card card-pk relative grid items-center gap-6 overflow-hidden p-8 sm:p-12 md:grid-cols-[1fr_auto]">
          <div className="relative z-10">
            <div className="dsp text-xl" style={{ color: "var(--sky)" }}>
              BAYAR GAMPANG
            </div>
            <h2 className="dsp mt-2 text-5xl sm:text-7xl">Satu QRIS, semua bank.</h2>
            <p className="mt-3 max-w-md text-white/90">
              Scan dari aplikasi bank atau e-wallet apa pun. Tanpa daftar, tanpa
              biaya tambahan, langsung diproses.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-3">
            <Link href="/game" className="btn btn-w">
              Mulai top up
            </Link>
            <Link href="/lacak" className="btn btn-sky">
              Cek pesanan
            </Link>
          </div>
          <div
            className="absolute -bottom-20 -right-16 h-72 w-72 rounded-full"
            style={{ background: "var(--sky)", opacity: 0.35 }}
          />
        </div>
      </section>
    </main>
  );
}
