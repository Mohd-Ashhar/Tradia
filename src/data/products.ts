import productBag from "@/assets/product-bag-1.jpg";
import productSweater from "@/assets/product-sweater.jpg";
import productWatch from "@/assets/product-watch.jpg";
import productBoots from "@/assets/product-boots.jpg";
import productEarrings from "@/assets/product-earrings.jpg";
import productScarf from "@/assets/product-scarf.jpg";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  gender: "men" | "women" | "unisex";
  onSale?: boolean;
}

export const allProducts: Product[] = [
  {
    id: "1",
    name: "Emerald Leather Handbag",
    category: "Bags",
    price: 1299,
    image: productBag,
    gender: "women",
  },
  {
    id: "2",
    name: "Cashmere Crew Sweater",
    category: "Clothing",
    price: 485,
    image: productSweater,
    gender: "women",
  },
  {
    id: "3",
    name: "Minimalist Gold Watch",
    category: "Watches",
    price: 2150,
    image: productWatch,
    gender: "unisex",
  },
  {
    id: "4",
    name: "Suede Ankle Boots",
    category: "Footwear",
    price: 695,
    image: productBoots,
    gender: "women",
  },
  {
    id: "5",
    name: "Gold Hoop Earrings",
    category: "Jewelry",
    price: 340,
    originalPrice: 450,
    image: productEarrings,
    gender: "women",
    onSale: true,
  },
  {
    id: "6",
    name: "Silk Blend Scarf",
    category: "Accessories",
    price: 215,
    image: productScarf,
    gender: "unisex",
  },
  {
    id: "7",
    name: "Premium Wool Blazer",
    category: "Clothing",
    price: 890,
    image: productSweater,
    gender: "men",
  },
  {
    id: "8",
    name: "Designer Tote Bag",
    category: "Bags",
    price: 1450,
    originalPrice: 1850,
    image: productBag,
    gender: "unisex",
    onSale: true,
  },
  {
    id: "9",
    name: "Classic Timepiece",
    category: "Watches",
    price: 3200,
    image: productWatch,
    gender: "men",
  },
  {
    id: "10",
    name: "Leather Chelsea Boots",
    category: "Footwear",
    price: 595,
    originalPrice: 795,
    image: productBoots,
    gender: "men",
    onSale: true,
  },
  {
    id: "11",
    name: "Wool Overcoat",
    category: "Clothing",
    price: 1290,
    image: productSweater,
    gender: "men",
  },
  {
    id: "12",
    name: "Diamond Studs",
    category: "Jewelry",
    price: 680,
    originalPrice: 890,
    image: productEarrings,
    gender: "women",
    onSale: true,
  },
];

export const getMenProducts = () =>
  allProducts.filter((p) => p.gender === "men" || p.gender === "unisex");
export const getWomenProducts = () =>
  allProducts.filter((p) => p.gender === "women" || p.gender === "unisex");
export const getSaleProducts = () => allProducts.filter((p) => p.onSale);
