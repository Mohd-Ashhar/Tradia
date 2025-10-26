import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { MobileProductCard } from '@/components/MobileProductCard';
import { PullToRefresh } from '@/components/PullToRefresh';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FloatingCartButton } from '@/components/FloatingCartButton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import productBag from '@/assets/product-bag-1.jpg';
import productSweater from '@/assets/product-sweater.jpg';
import productWatch from '@/assets/product-watch.jpg';
import productBoots from '@/assets/product-boots.jpg';
import productEarrings from '@/assets/product-earrings.jpg';
import productScarf from '@/assets/product-scarf.jpg';

const products = [
  {
    id: '1',
    name: 'Emerald Leather Handbag',
    category: 'Luxury Bags',
    price: 1299,
    originalPrice: 1599,
    image: productBag,
    inStock: true,
  },
  {
    id: '2',
    name: 'Cashmere Blend Sweater',
    category: 'Premium Knitwear',
    price: 449,
    originalPrice: 599,
    image: productSweater,
    inStock: true,
  },
  {
    id: '3',
    name: 'Luxury Gold Watch',
    category: 'Timepieces',
    price: 2599,
    image: productWatch,
    inStock: true,
  },
  {
    id: '4',
    name: 'Italian Leather Boots',
    category: 'Designer Footwear',
    price: 799,
    originalPrice: 999,
    image: productBoots,
    inStock: false,
  },
  {
    id: '5',
    name: 'Diamond Earrings',
    category: 'Fine Jewelry',
    price: 3499,
    image: productEarrings,
    inStock: true,
  },
  {
    id: '6',
    name: 'Silk Designer Scarf',
    category: 'Accessories',
    price: 299,
    image: productScarf,
    inStock: true,
  },
];

const MobileProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success('Products refreshed!');
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Fixed Header */}
      <header className="sticky top-0 z-40 glass-morphism border-b border-border/50 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-4">
          <h1 className="font-heading text-2xl font-bold text-gradient">
            Tradia
          </h1>
          <div className="flex-1" />
          <ThemeToggle />
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search luxury items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-full border-border/50 bg-muted/30 pl-10 pr-12 backdrop-blur-sm"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Product Grid with Pull to Refresh */}
      <PullToRefresh onRefresh={handleRefresh}>
        <main className="px-4 py-6">
          {/* Category Pills */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['All', 'Bags', 'Clothing', 'Jewelry', 'Accessories'].map((category) => (
              <button
                key={category}
                className="whitespace-nowrap rounded-full bg-muted px-5 py-2 text-sm font-medium transition-all active:scale-95 hover:bg-primary hover:text-primary-foreground"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product, index) => (
              <MobileProductCard key={product.id} {...product} index={index} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-center text-muted-foreground">
                No products found
              </p>
            </div>
          )}
        </main>
      </PullToRefresh>

      {/* Floating Cart Button */}
      <FloatingCartButton itemCount={3} />

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileProducts;
