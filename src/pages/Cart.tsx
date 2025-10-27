import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Loader2 } from "lucide-react"; // Import Loader2
import { ProductHeader } from "@/components/ProductHeader";
import { CartItem } from "@/components/CartItem";
import { OrderSummary } from "@/components/OrderSummary";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  // Add 'loading' from useCart
  const { items, updateQuantity, removeFromCart, loading } = useCart();

  const handleQuantityChange = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
  };

  // ... (handleCheckout, subtotal, etc. remain the same)

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  // Handle Loading State
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
        {/* ... (Breadcrumb) ... */}

        {/* Handle Empty Cart */}
        {!loading && items.length === 0 ? (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-6 rounded-2xl glass-morphism">
            {/* ... (Empty cart icon and text) ... */}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Left Column - Cart Items */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              <div className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="font-heading text-3xl font-bold sm:text-4xl">
                  Shopping Cart
                  <span className="ml-3 text-xl text-muted-foreground">
                    {/* Update item count to handle loading */}(
                    {loading ? "..." : items.length}{" "}
                    {items.length === 1 ? "item" : "items"})
                  </span>
                </h1>
                {/* ... (Continue Shopping Button) ... */}
              </div>

              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CartItem
                    {...item}
                    image={item.image_url || "/placeholder.svg"} // Ensure image_url is passed
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                  />
                </div>
              ))}
            </div>

            {/* Right Column - Order Summary */}
            {/* ... (OrderSummary component) ... */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
