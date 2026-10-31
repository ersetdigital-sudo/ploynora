import type { Metadata } from "next";
import { Suspense } from "react";
import { TopupClient } from "@/components/TopupClient";
import { isSlug, PRODUCTS } from "@/lib/catalog";
import { getStorefront } from "@/lib/catalog-hydrate";

type Props = {
  searchParams: Promise<{ g?: string | string[]; n?: string | string[] }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { g } = await searchParams;
  const slug = Array.isArray(g) ? g[0] : g;
  const name = slug && isSlug(slug) ? PRODUCTS[slug].name : "Game & Layanan";
  return { title: `Top up ${name}` };
}

export default async function TopupPage({ searchParams }: Props) {
  const params = await searchParams;
  const rawSlug = Array.isArray(params.g) ? params.g[0] : params.g;
  const rawPrefill = Array.isArray(params.n) ? params.n[0] : params.n;
  const slug = rawSlug && isSlug(rawSlug) ? rawSlug : "ml";
  const prefill = rawPrefill ?? "";

  const storefront = await getStorefront();
  const qrisMethod =
    storefront.methods.find(
      (method) => method.name.toLowerCase() === "qris",
    ) ??
    storefront.methods[0] ??
    null;
  const product = storefront.products[slug];

  return (
    <Suspense
      fallback={
        <main className="wrap pt-8">
          <div className="card p-8 font-semibold">Memuat checkout…</div>
        </main>
      }
    >
      <TopupClient
        key={`${slug}:${prefill}`}
        product={product}
        slug={slug}
        prefill={prefill}
        brandSlug={storefront.brand?.slug ?? ""}
        qrisMethodId={qrisMethod?.id ?? null}
      />
    </Suspense>
  );
}
