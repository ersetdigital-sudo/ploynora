import type { IconName } from "./icons";

export type Category = "game" | "ppob";

export type Item = {
  n: string;
  p: number;
  h?: boolean;
  id?: string;
};

export type Product = {
  name: string;
  pub: string;
  cat: Category;
  bg: string;
  lt: string;
  icon?: IconName;
  hot?: boolean;
  f: string;
  ph: string;
  phone?: boolean;
  zone?: boolean;
  server?: string[];
  providers?: string[];
  items: Item[];
  dbServiceId?: string;
};

const unitItems = (rows: [number, number, boolean?][], unit: string): Item[] =>
  rows.map(([qty, price, hot]) => ({
    n: `${qty.toLocaleString("id-ID")} ${unit}`,
    p: price,
    h: !!hot,
  }));

export const PRODUCTS: Record<string, Product> = {
  ml: {
    name: "Mobile Legends",
    pub: "Moonton",
    cat: "game",
    bg: "#FF277F",
    lt: "ML",
    hot: true,
    f: "User ID",
    ph: "12345678",
    zone: true,
    items: unitItems(
      [
        [86, 19900],
        [172, 39500],
        [257, 58900, true],
        [344, 78500],
        [429, 98000],
        [706, 159000],
        [1412, 315000],
        [2195, 489000],
      ],
      "Diamonds",
    ),
  },
  ff: {
    name: "Free Fire",
    pub: "Garena",
    cat: "game",
    bg: "#FFB13D",
    lt: "FF",
    hot: true,
    f: "Player ID",
    ph: "123456789",
    items: unitItems(
      [
        [70, 9900],
        [140, 19500],
        [355, 48500, true],
        [720, 96000],
        [1450, 190000],
        [2180, 285000],
      ],
      "Diamonds",
    ),
  },
  pubg: {
    name: "PUBG Mobile",
    pub: "Tencent",
    cat: "game",
    bg: "#94DEFF",
    lt: "PB",
    hot: true,
    f: "Character ID",
    ph: "5123456789",
    items: unitItems(
      [
        [60, 14500],
        [325, 72000, true],
        [660, 144000],
        [1800, 355000],
        [3850, 715000],
      ],
      "UC",
    ),
  },
  genshin: {
    name: "Genshin Impact",
    pub: "HoYoverse",
    cat: "game",
    bg: "#B49CFF",
    lt: "GI",
    f: "UID",
    ph: "812345678",
    server: ["Asia", "America", "Europe", "TW/HK/MO"],
    items: unitItems(
      [
        [60, 15500],
        [330, 75000],
        [1090, 235000, true],
        [2240, 475000],
        [3880, 790000],
      ],
      "Genesis Crystals",
    ),
  },
  hok: {
    name: "Honor of Kings",
    pub: "Level Infinite",
    cat: "game",
    bg: "#FFD23F",
    lt: "HK",
    f: "Player ID",
    ph: "123456789012",
    items: unitItems(
      [
        [80, 16000],
        [240, 46000],
        [400, 76000, true],
        [800, 150000],
        [1200, 225000],
      ],
      "Tokens",
    ),
  },
  valo: {
    name: "Valorant",
    pub: "Riot Games",
    cat: "game",
    bg: "#FF6B6B",
    lt: "VL",
    f: "Riot ID",
    ph: "nama#TAG",
    items: unitItems(
      [
        [475, 56000],
        [1000, 112000, true],
        [2050, 224000],
        [3650, 390000],
        [5350, 560000],
      ],
      "VP",
    ),
  },
  roblox: {
    name: "Roblox",
    pub: "Roblox Corp",
    cat: "game",
    bg: "#7CE3B1",
    lt: "RB",
    f: "Username",
    ph: "username",
    items: unitItems(
      [
        [80, 16500],
        [400, 78000, true],
        [800, 155000],
        [1700, 310000],
      ],
      "Robux",
    ),
  },
  steam: {
    name: "Steam Wallet",
    pub: "Valve",
    cat: "game",
    bg: "#6F8BFF",
    lt: "ST",
    f: "Email akun Steam",
    ph: "kamu@email.com",
    items: [
      { n: "Rp45.000", p: 48000 },
      { n: "Rp60.000", p: 63500, h: true },
      { n: "Rp90.000", p: 94500 },
      { n: "Rp120.000", p: 125500 },
      { n: "Rp250.000", p: 259000 },
    ],
  },
  pulsa: {
    name: "Pulsa",
    pub: "Semua operator",
    cat: "ppob",
    icon: "phone",
    bg: "#C9EEFF",
    lt: "PL",
    f: "Nomor HP",
    ph: "0812 3456 7890",
    phone: true,
    items: [
      { n: "Rp10.000", p: 11500 },
      { n: "Rp25.000", p: 25900, h: true },
      { n: "Rp50.000", p: 50500 },
      { n: "Rp100.000", p: 99500 },
    ],
  },
  data: {
    name: "Paket Data",
    pub: "Semua operator",
    cat: "ppob",
    icon: "wifi",
    bg: "#C9EEFF",
    lt: "DT",
    f: "Nomor HP",
    ph: "0812 3456 7890",
    phone: true,
    items: [
      { n: "5 GB · 7 hari", p: 18000 },
      { n: "15 GB · 30 hari", p: 52000, h: true },
      { n: "30 GB · 30 hari", p: 89000 },
      { n: "50 GB · 30 hari", p: 125000 },
    ],
  },
  ewallet: {
    name: "E-Wallet",
    pub: "DANA · OVO · GoPay · ShopeePay · LinkAja",
    cat: "ppob",
    icon: "wallet",
    bg: "#C9EEFF",
    lt: "EW",
    f: "Nomor HP terdaftar",
    ph: "0812 3456 7890",
    providers: ["DANA", "OVO", "GoPay", "ShopeePay", "LinkAja"],
    items: [
      { n: "Rp20.000", p: 21500 },
      { n: "Rp50.000", p: 51500, h: true },
      { n: "Rp100.000", p: 101500 },
      { n: "Rp200.000", p: 201500 },
    ],
  },
  pln: {
    name: "Token PLN",
    pub: "PLN Prabayar",
    cat: "ppob",
    icon: "bolt",
    bg: "#C9EEFF",
    lt: "PLN",
    f: "Nomor meter",
    ph: "5123 4567 8901",
    items: [
      { n: "Token Rp20.000", p: 22500 },
      { n: "Token Rp50.000", p: 52500, h: true },
      { n: "Token Rp100.000", p: 102500 },
      { n: "Token Rp200.000", p: 202500 },
    ],
  },
};

export const PRODUCT_ORDER = Object.keys(PRODUCTS);

export const GAME_KEYS = PRODUCT_ORDER.filter((key) => PRODUCTS[key].cat === "game");
export const PPOB_KEYS = PRODUCT_ORDER.filter((key) => PRODUCTS[key].cat === "ppob");

export const isSlug = (value: string | null | undefined): boolean =>
  !!value && value in PRODUCTS;

export const formatRp = (value: number) =>
  "Rp" + Math.round(value).toLocaleString("id-ID");

export const minPrice = (slug: string) =>
  Math.min(...PRODUCTS[slug].items.map((item) => item.p));

export const HERO_ROTATION = [
  { word: "gas terus!", lt: "ML", slug: "ml", item: "257 Diamonds" },
  { word: "push rank!", lt: "ML", slug: "ml", item: "344 Diamonds" },
  { word: "booyah!", lt: "FF", slug: "ff", item: "355 Diamonds" },
  { word: "chicken!", lt: "PB", slug: "pubg", item: "325 UC" },
  { word: "gacha!", lt: "GI", slug: "genshin", item: "1.090 Genesis Crystals" },
  { word: "clutch!", lt: "VL", slug: "valo", item: "1.000 VP" },
  { word: "kece!", lt: "RB", slug: "roblox", item: "400 Robux" },
];
