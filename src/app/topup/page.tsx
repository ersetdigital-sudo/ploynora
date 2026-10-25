import type { Metadata } from "next";
import { Suspense } from "react";
import { TopupClient } from "@/components/TopupClient";
import { isSlug, PRODUCTS } from "@/lib/catalog";

type Props = {
  searchParams: Promise<{ g?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { g } = await searchParams;
  const name = g && isSlug(g) ? PRODUCTS[g].name : "Game & Layanan";
  return { title: `Top up ${name}` };
}

export default function TopupPage() {
  return (
    <Suspense
      fallback={
        <main className="wrap pt-8">
          <div className="card p-8 font-semibold">Memuat checkout…</div>
        </main>
      }
    >
      <TopupClient />
    </Suspense>
  );
}
