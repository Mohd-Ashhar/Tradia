import { ProductCard } from "@/components/ProductCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ProductHeader } from "@/components/ProductHeader";

import { FilterProvider, useFilters } from "@/contexts/FilterContext";
import { filterProducts } from "@/utils/productFilters";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCardSkeleton } from "@/components/LoadingState";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Type definition for Supabase Jsonb type
type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// --- NEW: Correct Product Interface Definition ---
// This interface now matches your Supabase table and is exported
// so other files (like ProductDetail.tsx) can use it.
export interface Product {
  id: string; // UUID
  created_at?: string;
  updated_at?: string;
  name: string;
  description?: string | null;
  price: number;
  originalPrice?: number | null;
  category: string;
  gender?: string | null;
  onSale?: boolean;
  stock_quantity?: number;
  image_url?: string | null;
  additional_images?: string[] | null; // <-- FIELD IS NOW INCLUDED
  specifications?: Json | null; // <-- FIELD IS NOW INCLUDED
  is_featured?: boolean;
}
// --- END NEW INTERFACE ---

/**
 * Function to fetch products from Supabase
 */
const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    throw new Error(error.message);
  }

  return data as Product[];
};

const ProductsContent = () => {
  const { filters, setSortBy } = useFilters();

  // This useQuery now uses the new, correct Product interface
  const {
    data: allProductsList,
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // --- Handle Loading State ---
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:gap-8">
        {[...Array(6)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // --- Handle Error State ---
  if (error || !allProductsList) {
    return (
      <Alert variant="destructive" className="glass-morphism">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Fetching Products</AlertTitle>
        <AlertDescription>
          We couldn't load the products at this time. Please try refreshing the
          page.
          <br />
          {error && (
            <span className="text-xs text-muted-foreground/80">
              {error.message}
            </span>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  const products = filterProducts(allProductsList, filters);

  return (
    <div className="min-h-screen bg-background">
      <ProductHeader />

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="mb-2 text-4xl font-bold sm:text-5xl">
            New <span className="text-gradient">Collection</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover our curated selection of premium luxury items
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden w-80 lg:block">
            <FilterSidebar />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sort & Filter Bar */}
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {products.length}
                </span>{" "}
                products
              </p>
              <select
                className="glass-morphism rounded-lg border-border/50 px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                value={filters.sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:gap-8">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in-up"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    {/* Pass the full product object */}
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[40vh] flex-col items-center justify-center rounded-lg border border-dashed text-center">
                <h3 className="text-2xl font-semibold tracking-tight">
                  No Products Found
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your filters or check back later.
                </p>
              </div>
            )}

            {/* Load More Button (Functionality not implemented yet) */}
            {products.length > 0 && (
              <div className="mt-12 text-center">
                <button className="glass-morphism rounded-full px-8 py-3 font-medium transition-all hover:scale-105 hover:shadow-[var(--shadow-glass)]">
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Button (Functionality not implemented yet) */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent shadow-[var(--shadow-premium)] transition-transform hover:scale-110">
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Ensure Products wraps ProductsContent with FilterProvider
const Products = () => {
  return (
    <FilterProvider>
      <ProductsContent />
    </FilterProvider>
  );
};

export default Products;
