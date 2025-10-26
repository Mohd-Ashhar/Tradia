import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MobileProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  index: number;
}

export const MobileProductCard = ({
  id,
  name,
  category,
  price,
  originalPrice,
  image,
  inStock,
  index,
}: MobileProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      // Handle swipe gestures (could navigate to next/prev product)
      toast.info(isLeftSwipe ? 'Swiped left' : 'Swiped right');
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success('Added to cart!');
  };

  return (
    <Link
      to={`/products/${id}`}
      className="block animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="group relative overflow-hidden rounded-3xl bg-card shadow-lg transition-all duration-300 active:scale-98">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 group-active:scale-105"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-active:opacity-100" />

          {/* Top Right Actions */}
          <div className="absolute right-3 top-3 flex flex-col gap-2">
            <button
              onClick={handleLike}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-xl transition-all duration-300 active:scale-90",
                isLiked
                  ? "bg-primary/90"
                  : "glass-morphism"
              )}
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-all",
                  isLiked ? "fill-white text-white" : "text-foreground"
                )}
              />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {!inStock && (
              <Badge variant="destructive" className="font-medium">
                Out of Stock
              </Badge>
            )}
            {originalPrice && (
              <Badge className="bg-accent text-accent-foreground font-medium">
                -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
              </Badge>
            )}
          </div>

          {/* Quick Add to Cart - Slides up on active */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full transition-transform duration-300 group-active:translate-y-0">
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full rounded-none rounded-t-2xl bg-gradient-to-r from-primary to-accent text-white backdrop-blur-xl active:scale-95"
              disabled={!inStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Quick Add
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="mb-1 text-sm font-medium text-muted-foreground">
            {category}
          </p>
          <h3 className="mb-3 line-clamp-2 font-heading text-lg font-semibold leading-tight">
            {name}
          </h3>
          
          <div className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold text-gradient">
              ${price.toLocaleString()}
            </span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
