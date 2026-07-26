import type { Product } from "@/types/models";

/** Local JPEGs under `/public/images` — works offline. */

/** Single lady-model hero shot across all swatches. */
const premiumLady = "/images/premium-shirt-tan-lady.jpg";

/** Seeded catalogue — names align with FashionHub design ("Tangerine"). */
export const PRODUCTS: Product[] = [
  {
    id: "premium-tagerine-shirt",
    name: "Premium Tangerine Shirt",
    priceCents: 25785,
    sizes: ["S", "M", "L", "XL", "XXL"],
    defaultColorId: "tan",
    previewImageSrc: premiumLady,
    imagesByColor: {
      tan: premiumLady,
      navy: premiumLady,
      stone: premiumLady,
    },
    colors: [
      { id: "tan", label: "Beige", hex: "#C89B6B" },
      { id: "navy", label: "Navy", hex: "#1E2F4F" },
      { id: "stone", label: "Light grey", hex: "#D7D9DC" },
    ],
  },
  {
    id: "tagerine-shirt",
    name: "Tangerine Shirt",
    priceCents: 24032,
    sizes: ["S", "M", "L", "XL"],
    defaultColorId: "tan",
    previewImageSrc: "/images/product-tagerine.jpg",
    imagesByColor: {},
    colors: [{ id: "tan", label: "Sunset", hex: "#EA7E3F" }],
  },
  {
    id: "linen-city-jacket",
    name: "Linen City Jacket",
    priceCents: 31900,
    sizes: ["M", "L", "XL", "XXL"],
    defaultColorId: "sand",
    previewImageSrc: "/images/product-jacket.jpg",
    imagesByColor: {},
    colors: [
      { id: "sand", label: "Sand", hex: "#C9B497" },
      { id: "graphite", label: "Graphite", hex: "#3B3F45" },
    ],
  },
  {
    id: "woven-summer-pants",
    name: "Woven Summer Pants",
    priceCents: 17450,
    sizes: ["S", "M", "L"],
    defaultColorId: "sand",
    previewImageSrc: "/images/product-pants.jpg",
    imagesByColor: {},
    colors: [{ id: "sand", label: "Natural", hex: "#D8CABA" }],
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
