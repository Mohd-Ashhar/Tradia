import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  onSale?: boolean;
}

export const ProductCard = ({ id, name, category, price, originalPrice, image, onSale }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();

  const discountPercent = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, name, category, price, originalPrice, image, gender: 'unisex', onSale }, 1);
    toast.success('Added to cart!', {
      description: name,
    });
  };

  return (
    <Link to={`/products/${id}`}>
      <div
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      <div className="relative overflow-hidden rounded-2xl bg-card transition-all duration-500 hover:shadow-[var(--shadow-premium)]">
        {/* Image Container with 3D Rotation */}
        <div 
          className="relative aspect-square overflow-hidden bg-muted"
          style={{
            transform: isHovered ? 'perspective(1000px) rotateY(5deg) scale(1.05)' : 'perspective(1000px) rotateY(0deg) scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700"
            style={{
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
          />
          
          <div 
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent transition-opacity duration-500",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          />

          {/* Sale Badge */}
          {onSale && (
            <div className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-accent to-primary px-4 py-1.5 backdrop-blur-sm">
              <span className="text-xs font-bold text-white">
                {discountPercent}% OFF
              </span>
            </div>
          )}

          {/* Like Button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={cn(
              "absolute right-4 top-4 rounded-full p-2 backdrop-blur-md transition-all duration-300",
              "glass-morphism hover:scale-110",
              isLiked ? "bg-accent/20" : "bg-background/10"
            )}
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                isLiked ? "fill-accent text-accent" : "text-foreground"
              )}
            />
          </button>

          {/* Hover Reveal - Price & Add to Cart */}
          <div 
            className={cn(
              "absolute bottom-0 left-0 right-0 p-6 transition-all duration-500",
              isHovered ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-foreground">
                    ${price.toLocaleString()}
                  </p>
                  {originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                      ${originalPrice.toLocaleString()}
                    </p>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Free Shipping</p>
              </div>
              <Button
                size="icon"
                onClick={handleAddToCart}
                className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[var(--shadow-premium)]"
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
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
      </div>
    </Link>
  );
};
