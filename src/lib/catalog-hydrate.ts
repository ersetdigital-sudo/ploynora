import { PRODUCTS, type Product } from "@/lib/catalog";
import {
  getCatalog,
  type CatalogMethod,
  type CatalogService,
} from "@/lib/db/server";
import type { WebBrand } from "@/lib/db/types";

export type Storefront = {
  products: Record<string, Product>;
  minPrices: Record<string, number>;
  methods: CatalogMethod[];
  brand: WebBrand | null;
};

function hydrateProduct(product: Product, dbService: CatalogService): Product {
  const items = product.items.map((item, index) => {
    const dbProduct =
      dbService.products.find(
        (candidate) => candidate.nama === `${product.name} · ${item.n}`,
      ) ??
      dbService.products.find((candidate) => candidate.nama === item.n) ??
      dbService.products[index];
    return dbProduct
      ? { ...item, p: dbProduct.hargaJual, id: dbProduct.id }
      : item;
  });

  return { ...product, dbServiceId: dbService.dbId, items };
}

export async function getStorefront(): Promise<Storefront> {
  const result = await getCatalog();
  const products = { ...PRODUCTS };
  const minPrices = Object.fromEntries(
    Object.entries(PRODUCTS).map(([slug, product]) => [
      slug,
      Math.min(...product.items.map((item) => item.p)),
    ]),
  ) as Record<string, number>;

  if (result.data) {
    const bySlug = new Map(
      result.data.services.map((service) => [service.slug, service]),
    );
    for (const slug of Object.keys(PRODUCTS)) {
      const dbService = bySlug.get(slug);
      if (dbService) {
        products[slug] = hydrateProduct(PRODUCTS[slug], dbService);
        minPrices[slug] = Math.min(
          ...products[slug].items.map((item) => item.p),
        );
      }
    }
  }

  return {
    products,
    minPrices,
    methods: result.data?.methods ?? [],
    brand: result.data?.brand ?? null,
  };
}

export async function getHydratedProduct(slug: string) {
  const storefront = await getStorefront();
  return {
    product: storefront.products[slug] ?? null,
    products: storefront.products,
    minPrices: storefront.minPrices,
    methods: storefront.methods,
    brand: storefront.brand,
  };
}
