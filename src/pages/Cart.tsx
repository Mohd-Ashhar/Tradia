// src/pages/Cart.tsx

import {
  Link,
  useNavigate,
} from "react-router-dom";
import { ArrowLeft, ShoppingBag, Loader2 } from "lucide-react";
import { ProductHeader } from "@/components/ProductHeader";
import { CartItem } from "@/components/CartItem";
import { OrderSummary } from "@/components/OrderSummary";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth
import { supabase } from "@/integrations/supabase/client"; // Import supabase
import { useState } from "react"; // Import useState

const Cart = () => {
  const { items, updateQuantity, removeFromCart, loading, clearCart } =
    useCart();
  const { user } = useAuth(); // Get user
  const navigate = useNavigate(); // Get navigate hook
  const [isCheckingOut, setIsCheckingOut] = useState(false); // Loading state for checkout

  const handleQuantityChange = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
  };

  // --- NEW: handleCheckout function ---
  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please log in to check out.");
      navigate("/auth");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsCheckingOut(true);

    // --- TEMPORARY Shipping Address ---
    // Later, you will get this from a form or user's profile
    // We'll pull from the profile as a placeholder
    const { data: profile } = await supabase
      .from("profiles")
      .select("shipping_addresses")
      .eq("id", user.id)
      .single();

    const shipping_address = profile?.shipping_addresses?.[0] || {
      name: user.email,
      line1: "123 Default St",
      city: "Anytown",
      postal_code: "12345",
      country: "US",
    };
    // --- End Temporary Data ---

    try {
      // Call the Supabase function
      // --- THIS IS THE CORRECTED LINE ---
      const { data: orderNumber, error } = await supabase.rpc("create_order", {
        shipping_address_json: shipping_address,
        billing_address_json: shipping_address, // Use same for billing for now
      });

      if (error) {
        throw error;
      }

      // Success!
      toast.success("Order placed successfully!", {
        description: `Your order #${orderNumber} is being processed.`,
      });
      clearCart(); // Clear cart from local state (it's already cleared in DB)
      navigate(`/order-success/${orderNumber}`); // Redirect to a success page
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error("Checkout Failed", {
        description:
          error.message || "Could not place your order. Please try again.",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };
  // --- END NEW ---

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  // Handle Initial Cart Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ProductHeader />
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProductHeader />

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb (You can add this back if you have it) */}

        {!loading && items.length === 0 ? (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-6 rounded-2xl glass-morphism">
            <ShoppingBag className="h-24 w-24 text-muted-foreground/30" />
            <h2 className="text-3xl font-bold">Your cart is empty</h2>
            <p className="text-muted-foreground">
              Looks like you haven't added anything yet.
            </p>
            <Button asChild size="lg">
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Left Column - Cart Items */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              <div className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="font-heading text-3xl font-bold sm:text-4xl">
                  Shopping Cart
                  <span className="ml-3 text-xl text-muted-foreground">
                    ({items.length} {items.length === 1 ? "item" : "items"})
                  </span>
                </h1>
                <Link to="/products">
                  <Button variant="outline" className="glass-morphism">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CartItem
                    {...item}
                    image={item.image_url || "/placeholder.svg"}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                  />
                </div>
              ))}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              {/* Pass the loading state to OrderSummary */}
              <OrderSummary
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                onCheckout={handleCheckout}
                isLoading={isCheckingOut} // Pass loading state
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
