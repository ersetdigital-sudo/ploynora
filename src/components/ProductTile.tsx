import Link from "next/link";
import { formatRp, minPrice, PRODUCTS } from "@/lib/catalog";
import { ProductArt } from "./ProductArt";

export function ProductTile({ slug }: { slug: string }) {
  const product = PRODUCTS[slug];
  return (
    <Link href={`/topup?g=${slug}`} className="gt">
      <ProductArt slug={slug} />
      <div className="flex flex-1 flex-col p-4">
        <div className="font-extrabold leading-tight">{product.name}</div>
        <div className="mut mt-0.5 text-xs font-semibold">{product.pub}</div>
        <div className="mt-auto pt-3 text-sm font-bold">
          mulai <span style={{ color: "var(--pk)" }}>{formatRp(minPrice(slug))}</span>
        </div>
      </div>
    </Link>
  );
}
