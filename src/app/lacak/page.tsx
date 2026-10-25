import type { Metadata } from "next";
import { Suspense } from "react";
import { LacakClient } from "@/components/LacakClient";

export const metadata: Metadata = {
  title: "Cek Pesanan",
};

export default function LacakPage() {
  return (
    <Suspense
      fallback={
        <main className="wrap pt-8">
          <div className="card p-8 font-semibold">Memuat halaman cek pesanan…</div>
        </main>
      }
    >
      <LacakClient />
    </Suspense>
  );
}
