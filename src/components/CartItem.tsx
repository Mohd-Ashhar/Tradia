import { useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CartItemProps {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem = ({
  id,
  name,
  image,
  price,
  quantity,
  size,
  onQuantityChange,
  onRemove,
}: CartItemProps) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(id);
      toast.success('Item removed from cart');
    }, 300);
  };

  return (
    <div
      className={`glass-morphism rounded-2xl p-6 transition-all duration-300 ${
        isRemoving ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}
    >
      <div className="flex gap-6">
        {/* Product Image */}
        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading text-xl font-semibold">{name}</h3>
                {size && (
                  <p className="mt-1 text-sm text-muted-foreground">Size: {size}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <p className="mt-2 text-2xl font-bold text-gradient">
              ${price.toLocaleString()}
            </p>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background/50 backdrop-blur-sm">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onQuantityChange(id, Math.max(1, quantity - 1))}
                className="h-10 w-10 rounded-lg transition-all hover:bg-muted"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onQuantityChange(id, quantity + 1)}
                className="h-10 w-10 rounded-lg transition-all hover:bg-muted"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="ml-auto text-sm text-muted-foreground">
              Subtotal: <span className="font-semibold text-foreground">${(price * quantity).toLocaleString()}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
