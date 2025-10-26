import { ProductCard } from '@/components/ProductCard';
import { FilterSidebar } from '@/components/FilterSidebar';
import { ProductHeader } from '@/components/ProductHeader';
import { getSaleProducts } from '@/data/products';
import { Tag } from 'lucide-react';
import { FilterProvider, useFilters } from '@/contexts/FilterContext';
import { filterProducts } from '@/utils/productFilters';

const SaleContent = () => {
  const allProducts = getSaleProducts();
  const { filters, setSortBy } = useFilters();
  const products = filterProducts(allProducts, filters);

  return (
    <div className="min-h-screen bg-background">
      <ProductHeader />
      
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <Tag className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold sm:text-5xl">
              Sale <span className="text-gradient">Collection</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Exclusive deals on premium luxury items - Limited time only
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden w-80 lg:block">
            <FilterSidebar />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sort & Filter Bar */}
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{products.length}</span> products on sale
              </p>
              <select 
                className="glass-morphism rounded-lg border-border/50 px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                value={filters.sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Sort by: Featured</option>
                <option value="discount">Discount: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:gap-8">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in-up"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Tag className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-2xl font-semibold mb-2">No items on sale</h3>
                <p className="text-muted-foreground">Check back soon for exclusive deals!</p>
              </div>
            )}

            {/* Load More */}
            {products.length > 0 && (
              <div className="mt-12 text-center">
                <button className="glass-morphism rounded-full px-8 py-3 font-medium transition-all hover:scale-105 hover:shadow-[var(--shadow-glass)]">
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Button */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent shadow-[var(--shadow-premium)] transition-transform hover:scale-110">
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Sale = () => {
  return (
    <FilterProvider>
      <SaleContent />
    </FilterProvider>
  );
};

export default Sale;
