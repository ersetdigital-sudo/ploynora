import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GameCatalog } from "@/components/GameCatalog";

export const metadata: Metadata = {
  title: "Semua Game & Layanan",
};

export default function GamePage() {
  return (
    <main className="wrap pt-6 sm:pt-10">
      <Breadcrumbs
        items={[
          { label: "Beranda", href: "/" },
          { label: "Game" },
        ]}
      />
      <Suspense
        fallback={
          <div className="card mt-6 p-8 font-semibold">Memuat katalog…</div>
        }
      >
        <GameCatalog />
      </Suspense>
    </main>
  );
}
