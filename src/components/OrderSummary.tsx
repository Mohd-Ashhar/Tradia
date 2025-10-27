import { Shield, Truck, RefreshCw, Lock, Loader2 } from "lucide-react"; // Import Loader2
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  onCheckout: () => void;
  isLoading?: boolean; // Add isLoading prop
}

export const OrderSummary = ({
  subtotal,
  shipping,
  tax,
  total,
  onCheckout,
  isLoading, // Destructure prop
}: OrderSummaryProps) => {
  const savings = 300; // Example savings

  return (
    <div className="sticky top-24 space-y-6">
      {/* Order Summary Card */}
      <div className="glass-morphism rounded-2xl p-8 shadow-xl">
        <h2 className="mb-6 font-heading text-2xl font-bold">Order Summary</h2>

        {/* ... (Subtotal, Shipping, Tax divs remain the same) ... */}
        <div className="space-y-4 border-b border-border/50 pb-6">
          <div className="flex justify-between text-base">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-base">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-semibold text-accent">
              {shipping === 0 ? "FREE" : `$${shipping}`}
            </span>
          </div>
          <div className="flex justify-between text-base">
            <span className="text-muted-foreground">Tax</span>
            <span className="font-semibold">${tax.toLocaleString()}</span>
          </div>
          {savings > 0 && (
            <div className="flex justify-between text-base">
              <span className="text-accent">You're saving</span>
              <span className="font-semibold text-accent">-${savings}</span>
            </div>
          )}
        </div>

        {/* ... (Total div remains the same) ... */}
        <div className="flex items-baseline justify-between border-b border-border/50 py-6">
          <span className="text-lg font-medium">Total</span>
          <div className="text-right">
            <span className="font-heading text-4xl font-bold text-gradient">
              ${total.toLocaleString()}
            </span>
            <p className="mt-1 text-xs text-muted-foreground">
              Including ${tax} in taxes
            </p>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="space-y-3 pt-6">
          <Button
            onClick={onCheckout}
            disabled={isLoading} // Disable button when loading
            size="lg"
            className="group relative w-full overflow-hidden bg-gradient-to-r from-primary to-accent text-lg font-medium text-white transition-all hover:scale-105 hover:shadow-[var(--shadow-premium)]"
          >
            {/* Show loader or text */}
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Lock className="h-5 w-5" />
                Proceed to Checkout
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 transition-opacity group-hover:opacity-100" />
          </Button>
        </div>

        {/* ... (Trust Badges remain the same) ... */}
        <div className="mt-6 space-y-3 border-t border-border/50 pt-6">
          <div className="flex items-center gap-3 text-sm">
            <Shield className="h-5 w-5 text-accent" />
            <span className="text-muted-foreground">
              Secure checkout with 256-bit SSL encryption
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Truck className="h-5 w-5 text-accent" />
            <span className="text-muted-foreground">
              Free shipping on orders over $500
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <RefreshCw className="h-5 w-5 text-accent" />
            <span className="text-muted-foreground">
              30-day hassle-free returns
            </span>
          </div>
        </div>

        {/* ... (Payment Methods remain the same) ... */}
        <div className="mt-6 border-t border-border/50 pt-6">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            We accept
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Visa",
              "Mastercard",
              "Amex",
              "PayPal",
              "Apple Pay",
              "Google Pay",
            ].map((method) => (
              <Badge
                key={method}
                variant="outline"
                className="border-border/50 bg-background/50 text-xs"
              >
                {method}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* ... (Promo Code div remains the same) ... */}
      <div className="glass-morphism rounded-2xl p-6">
        <label className="mb-3 block text-sm font-medium">Promo Code</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter code"
            className="flex-1 rounded-lg border border-border bg-background/50 px-4 py-2 text-sm backdrop-blur-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Button variant="outline" className="glass-morphism">
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};
