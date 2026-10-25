import { PRODUCTS } from "@/lib/catalog";
import { Icon } from "./Icon";

export function ProductArt({
  slug,
  small = false,
}: {
  slug: string;
  small?: boolean;
}) {
  const product = PRODUCTS[slug];

  if (product.cat === "ppob" && product.icon) {
    return (
      <div className="gt-art" style={{ background: product.bg }}>
        <span
          className="grid h-16 w-16 place-items-center rounded-2xl bg-white"
          style={{ border: "3px solid var(--ink)" }}
        >
          <Icon name={product.icon} className="h-8 w-8" />
        </span>
      </div>
    );
  }

  return (
    <div className="gt-art" style={{ background: product.bg }}>
      {product.hot && !small && <span className="hot">🔥 Populer</span>}
      <span
        className="lt"
        style={small ? { fontSize: 30, WebkitTextStroke: "2px var(--ink)" } : undefined}
      >
        {product.lt}
      </span>
    </div>
  );
}
