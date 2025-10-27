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
  Loader2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/pages/Products";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth
import { cn } from "@/lib/utils"; // Import cn

/**
 * Function to fetch a single product by its ID
 */
const fetchProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

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
  const { user } = useAuth(); // Get user
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false); // Loading state for Buy Now

  const {
    data: productData,
    isLoading,
    error,
  } = useQuery<Product | null>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      return await fetchProductById(id);
    },
    enabled: !!id,
    retry: 1,
  });

  useEffect(() => {
    if (!isLoading && (!productData || error)) {
      toast.error("Product not found", {
        description: "Redirecting you to all products.",
      });
      navigate("/products");
    }
  }, [isLoading, productData, error, navigate]);

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

  const handleAddToCartClick = async () => {
    if (productData) {
      await addToCart(productData, quantity);
    }
  };

  // --- NEW: handleBuyNow function ---
  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Please log in to buy this item.");
      navigate("/auth");
      return;
    }

    if (!productData) return;

    setIsBuyingNow(true);

    // --- Get placeholder shipping address (same as cart) ---
    const { data: profile } = await supabase
      .from("profiles")
      .select("shipping_addresses, email")
      .eq("id", user.id)
      .single();

    const shipping_address = profile?.shipping_addresses?.[0] || {
      name: profile?.email || user.email,
      line1: "123 Default St",
      city: "Anytown",
      postal_code: "12345",
      country: "US",
    };
    // --- End placeholder ---

    try {
      // Call the new Supabase function
      const { data: orderNumber, error } = await supabase.rpc(
        "create_order_single_item",
        {
          product_id_to_buy: productData.id,
          quantity_to_buy: quantity,
          shipping_address_json: shipping_address,
          billing_address_json: shipping_address,
        }
      );

      if (error) {
        throw error;
      }

      // Success!
      toast.success("Order placed successfully!", {
        description: `Your order #${orderNumber} is being processed.`,
      });
      navigate(`/order-success/${orderNumber}`); // Redirect to success page
    } catch (error: any) {
      console.error("Buy Now error:", error);
      toast.error("Checkout Failed", {
        description:
          error.message || "Could not place your order. Please try again.",
      });
    } finally {
      setIsBuyingNow(false);
    }
  };

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
        {/* ... (Breadcrumb, Image Viewer, Product Info, etc.) ... */}

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
              {/* --- Quantity Controls (No Change) --- */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">
                  Qty:
                </span>
                <div className="flex items-center gap-1 rounded-lg border border-border bg-background/50 p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-10 text-center text-lg font-semibold">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* --- NEW: Button Container --- */}
              <div className="flex flex-1 items-center gap-3">
                <Button
                  size="lg"
                  className="flex-1 text-lg"
                  onClick={handleAddToCartClick}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>

                {/* --- NEW: Buy Now Button --- */}
                <Button
                  size="lg"
                  className="flex-1 text-lg bg-gradient-to-r from-accent to-yellow-400 text-white"
                  onClick={handleBuyNow}
                  disabled={isBuyingNow}
                >
                  {isBuyingNow ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Zap className="mr-2 h-5 w-5" />
                  )}
                  Buy Now
                </Button>
                {/* ------------------------- */}
              </div>

              <Button
                variant="outline"
                size="lg"
                className="h-14 w-14 p-0 glass-morphism transition-all hover:scale-110"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={cn(
                    "h-6 w-6",
                    isWishlisted && "fill-destructive text-destructive"
                  )}
                />
              </Button>
            </div>

            {/* ... (Guarantees, Specifications, Reviews) ... */}
            <div className="flex flex-col gap-3 rounded-2xl border border-border/50 p-6 glass-morphism">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  Free shipping on orders over $500
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="font-medium">30-day return policy</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  Lifetime craftsmanship guarantee
                </span>
              </div>
            </div>

            {productData.specifications && (
              <div
                className={`glass-morphism rounded-2xl p-6 transition-all duration-1000 animate-fade-in-up`}
                style={{ animationDelay: "0.6s" }}
              >
                <h3 className="mb-4 text-xl font-bold">Specifications</h3>
                <dl className="grid gap-3 sm:grid-cols-2">
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
