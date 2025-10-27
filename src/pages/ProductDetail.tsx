import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ProductHeader } from "@/components/ProductHeader";
import { ProductImageViewer } from "@/components/ProductImageViewer";
import { ProductReviews } from "@/components/ProductReviews";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Heart,
  Truck,
  Shield,
  RotateCcw,
  Loader2, // Import loader
} from "lucide-react";
import { toast } from "sonner";
// Remove static data import: import { allProducts } from '@/data/products';
import { useCart } from "@/contexts/CartContext";

// --- NEW IMPORTS ---
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
// Import the Product interface we defined in Products.tsx
import { Product } from "@/pages/Products";

/**
 * NEW: Function to fetch a single product by its ID
 */
const fetchProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single(); // .single() fetches one record or null

  if (error) {
    console.error("Error fetching product:", error);
    throw new Error(error.message);
  }
  return data;
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // --- NEW: Fetch data using React Query ---
  const {
    data: productData,
    isLoading,
    error,
  } = useQuery<Product | null>({
    // The queryKey uniquely identifies this query.
    // It includes the 'id' so React Query fetches a new
    // product if the id in the URL changes.
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null; // Don't fetch if there's no ID
      return await fetchProductById(id);
    },
    enabled: !!id, // Only run the query if 'id' exists
    retry: 1, // Don't retry endlessly if product isn't found
  });

  // --- NEW: Updated redirect effect ---
  useEffect(() => {
    // If loading is done AND we still have no product (or an error), then redirect.
    if (!isLoading && (!productData || error)) {
      toast.error("Product not found", {
        description: "Redirecting you to all products.",
      });
      navigate("/products");
    }
  }, [isLoading, productData, error, navigate]);

  // Scroll animation effect (no change)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100 && !hasAnimated) {
        setHasAnimated(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasAnimated]);

  // --- NEW: Handle Add to Cart ---
  const handleAddToCartClick = async () => {
    if (productData) {
      await addToCart(productData, quantity); // Pass the full product object
    }
  };

  // --- NEW: Loading State ---
  if (isLoading || !productData) {
    return (
      <div className="min-h-screen bg-background">
        <ProductHeader />
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // --- At this point, productData is loaded and valid ---

  const discountPercent =
    productData.originalPrice && productData.price
      ? Math.round(
          ((productData.originalPrice - productData.price) /
            productData.originalPrice) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <ProductHeader />

      <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb (no change) */}
        <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground">{productData.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Column - Image Viewer */}
          <div className="animate-fade-in-up">
            <ProductImageViewer
              mainImage={productData.image_url || "/placeholder.svg"}
              images={productData.additional_images || []}
            />
          </div>

          {/* Right Column - Product Info */}
          <div className="flex flex-col gap-6">
            {/* ... (Badge, Title, Price, Description) ... */}
            {productData.onSale && (
              <Badge
                variant="premium"
                className="w-fit animate-fade-in-up transition-all"
                style={{ animationDelay: "0.1s" }}
              >
                SALE - {discountPercent}% OFF
              </Badge>
            )}

            <h1
              className="font-heading text-4xl font-bold animate-fade-in-up transition-all sm:text-5xl"
              style={{ animationDelay: "0.2s" }}
            >
              {productData.name}
            </h1>

            <div
              className="flex items-baseline gap-3 animate-fade-in-up transition-all"
              style={{ animationDelay: "0.3s" }}
            >
              <span className="text-4xl font-bold text-gradient">
                ${productData.price.toLocaleString()}
              </span>
              {productData.onSale && productData.originalPrice && (
                <span className="text-2xl text-muted-foreground line-through">
                  ${productData.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p
              className="text-lg text-muted-foreground animate-fade-in-up transition-all"
              style={{ animationDelay: "0.4s" }}
            >
              {productData.description}
            </p>

            {/* Quantity & Add to Cart */}
            <div
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 animate-fade-in-up transition-all"
              style={{ animationDelay: "0.5s" }}
            >
              {/* ... (Quantity controls - no change) ... */}

              <Button
                size="lg"
                className="flex-1 text-lg"
                onClick={handleAddToCartClick} // Use new handler
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              {/* ... (Wishlist button - no change) ... */}
            </div>

            {/* Guarantees (no change) */}
            <div className="flex flex-col gap-3 rounded-2xl border border-border/50 p-6 glass-morphism">
              {/* ... */}
            </div>

            {/* --- NEW: Specifications from DB --- */}
            {productData.specifications && (
              <div
                className={`glass-morphism rounded-2xl p-6 transition-all duration-1000 animate-fade-in-up`}
                style={{ animationDelay: "0.6s" }}
              >
                <h3 className="mb-4 text-xl font-bold">Specifications</h3>
                <dl className="grid gap-3 sm:grid-cols-2">
                  {/* Map over the JSONB object entries */}
                  {Object.entries(productData.specifications).map(
                    ([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <dt className="text-sm font-medium text-muted-foreground">
                          {key}
                        </dt>
                        <dd className="mt-1 font-medium">{String(value)}</dd>
                      </div>
                    )
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section (no change) */}
        <div
          className={`mt-16 transition-all duration-1000 animate-fade-in-up`}
          style={{ animationDelay: "0.7s" }}
        >
          <ProductReviews />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
