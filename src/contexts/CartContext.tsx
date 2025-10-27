import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
// Import the new Product interface (make sure this path is correct)
import { Product } from "@/pages/Products";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface CartItem extends Product {
  quantity: number;
}

// Define the shape of data fetched from Supabase (product is nested)
interface FetchedCartItem {
  quantity: number;
  products: Product | null;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>; // Now async
  removeFromCart: (productId: string) => Promise<void>; // Now async
  updateQuantity: (productId: string, quantity: number) => Promise<void>; // Now async
  clearCart: () => Promise<void>; // Now async
  totalItems: number;
  totalPrice: number;
  loading: boolean; // Add loading state
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Remove localStorage initializer for useState

  // Remove localStorage.setItem useEffect

  // Fetch cart from Supabase when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("cart_items")
        .select(
          `
          quantity,
          products ( * )
        `
        )
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching cart:", error);
        toast.error("Failed to fetch your cart", {
          description: error.message,
        });
        setItems([]);
      } else if (data) {
        // Map the fetched data to the CartItem structure
        const cartItems = data
          .filter(
            (item): item is FetchedCartItem & { products: Product } =>
              item.products !== null
          )
          .map((item) => ({
            ...item.products, // Spread all product details
            quantity: item.quantity,
          }));
        setItems(cartItems);
      }
      setLoading(false);
    };

    fetchCart();
  }, [user]); // Re-run this effect when the user changes

  // CREATE / UPDATE
  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    // Find if item already exists in local state
    const existingItem = items.find((item) => item.id === product.id);
    const newQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    // Perform an "upsert" (insert or update)
    const { error } = await supabase.from("cart_items").upsert(
      {
        user_id: user.id,
        product_id: product.id,
        quantity: newQuantity,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id, product_id", // Specify conflict target
      }
    );

    if (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart", { description: error.message });
    } else {
      // Optimistic update: update local state immediately
      if (existingItem) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === product.id ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        setItems((prev) => [...prev, { ...product, quantity }]);
      }
      toast.success("Added to cart!", { description: product.name });
    }
  };

  // DELETE
  const removeFromCart = async (productId: string) => {
    if (!user) return; // Should not happen if item exists

    // Optimistic update
    setItems((prev) => prev.filter((item) => item.id !== productId));

    // Supabase delete
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .match({ user_id: user.id, product_id: productId });

    if (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item", { description: error.message });
      // NOTE: Here you might want to re-fetch the cart to sync state if deletion fails
    } else {
      toast.success("Item removed from cart");
    }
  };

  // UPDATE
  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    // Optimistic update
    setItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );

    // Supabase update
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: quantity, updated_at: new Date().toISOString() })
      .match({ user_id: user.id, product_id: productId });

    if (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity", { description: error.message });
      // NOTE: You might want to re-fetch here too on failure
    }
  };

  // DELETE (ALL)
  const clearCart = async () => {
    if (!user) return;

    // Optimistic update
    setItems([]);

    // Supabase delete
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart", { description: error.message });
      // NOTE: Re-fetch on failure
    } else {
      toast.success("Cart cleared");
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        loading, // Provide loading state
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
