import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
// Remove the sonner toast import, context will handle it
// import { toast } from 'sonner';
// Import the Product interface
import { Product } from "@/pages/Products";

interface ProductCardProps {
  product: Product; // Changed to accept a single product object
}

export const ProductCard = ({ product }: ProductCardProps) => {
  // Destructure product properties
  const { id, name, category, price, originalPrice, image_url, onSale } =
    product;

  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();

  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Make async and pass the full product object
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product, 1); // Pass the full product object
    // Remove the toast, CartContext handles it now
  };

  return (
    <Link to={`/products/${id}`}>
      <div
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="glass-morphism relative w-full overflow-hidden rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-[var(--shadow-premium-hover)]">
          {/* ... (Wishlist and Sale Badges) ... */}

          {/* Product Image */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={image_url || "/placeholder.svg"} // Use image_url
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
          </div>

          {/* Price & Add to Cart (Hover) */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 p-6 glass-morphism-footer transition-all duration-500 ease-in-out",
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            )}
          >
            {/* ... (Price display) ... */}
            <Button
              size="icon"
              onClick={handleAddToCart}
              className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[var(--shadow-premium)]"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {/* ... */}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {category}
          </p>
          <h3 className="text-lg font-semibold text-foreground line-clamp-2">
            {name}
          </h3>
        </div>
      </div>
    </Link>
  );
};
