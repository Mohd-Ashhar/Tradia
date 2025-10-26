import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface FloatingCartButtonProps {
  itemCount?: number;
}

export const FloatingCartButton = ({ itemCount = 0 }: FloatingCartButtonProps) => {
  if (itemCount === 0) return null;

  return (
    <Link to="/cart">
      <Button
        size="lg"
        className="fixed bottom-24 right-6 z-40 h-16 w-16 rounded-full bg-gradient-to-r from-primary to-accent p-0 shadow-2xl transition-all hover:scale-110 active:scale-95 md:hidden animate-bounce-subtle"
      >
        <div className="relative">
          <ShoppingCart className="h-6 w-6 text-white" />
          <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-primary">
            {itemCount}
          </span>
        </div>
      </Button>
    </Link>
  );
};
