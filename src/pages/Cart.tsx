import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { ProductHeader } from '@/components/ProductHeader';
import { CartItem } from '@/components/CartItem';
import { OrderSummary } from '@/components/OrderSummary';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';

const Cart = () => {
  const { items, updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
  };

  const handleCheckout = () => {
    toast.success('Proceeding to checkout...', {
      description: 'Redirecting to secure payment',
    });
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-background">
      <ProductHeader />

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Shopping Cart</span>
        </div>

        {/* Progress Steps */}
        <div className="mb-12 flex justify-center">
          <div className="flex items-center gap-4">
            {[
              { step: 1, label: 'Cart', active: true },
              { step: 2, label: 'Details', active: false },
              { step: 3, label: 'Payment', active: false },
              { step: 4, label: 'Confirmation', active: false },
            ].map((item, index, arr) => (
              <div key={item.step} className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold transition-all ${
                      item.active
                        ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                        : 'glass-morphism text-muted-foreground'
                    }`}
                  >
                    {item.step}
                  </div>
                  <span
                    className={`hidden font-medium sm:block ${
                      item.active ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {index < arr.length - 1 && (
                  <div className="h-0.5 w-12 bg-border sm:w-20" />
                )}
              </div>
            ))}
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="glass-morphism mb-6 rounded-full p-8">
              <ShoppingBag className="h-20 w-20 text-muted-foreground" />
            </div>
            <h2 className="mb-4 font-heading text-3xl font-bold">
              Your cart is empty
            </h2>
            <p className="mb-8 text-muted-foreground">
              Discover our luxury collection and find your perfect items
            </p>
            <Link to="/products">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent text-white transition-all hover:scale-105 hover:shadow-[var(--shadow-premium)]"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          /* Cart Content */
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Cart Items */}
            <div className="space-y-6 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h1 className="font-heading text-3xl font-bold sm:text-4xl">
                  Shopping Cart
                  <span className="ml-3 text-xl text-muted-foreground">
                    ({items.length} {items.length === 1 ? 'item' : 'items'})
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
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                  />
                </div>
              ))}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
