import type { Metadata } from "next";
import { Suspense } from "react";
import { BayarClient } from "@/components/BayarClient";

export const metadata: Metadata = {
  title: "Pembayaran",
};

export default function BayarPage() {
  return (
    <Suspense
      fallback={
        <main className="wrap pt-8">
          <div className="card p-8 font-semibold">Memuat pembayaran…</div>
        </main>
      }
    >
      <BayarClient />
    </Suspense>
  );
}
