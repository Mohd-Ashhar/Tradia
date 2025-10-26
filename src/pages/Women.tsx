import { ProductCard } from '@/components/ProductCard';
import { FilterSidebar } from '@/components/FilterSidebar';
import { ProductHeader } from '@/components/ProductHeader';
import { getWomenProducts } from '@/data/products';
import { FilterProvider, useFilters } from '@/contexts/FilterContext';
import { filterProducts } from '@/utils/productFilters';

const WomenContent = () => {
  const allProducts = getWomenProducts();
  const { filters, setSortBy } = useFilters();
  const products = filterProducts(allProducts, filters);

  return (
    <div className="min-h-screen bg-background">
      <ProductHeader />
      
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="mb-2 text-4xl font-bold sm:text-5xl">
            Women's <span className="text-gradient">Collection</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover premium women's fashion and accessories
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
                Showing <span className="font-semibold text-foreground">{products.length}</span> products
              </p>
              <select 
                className="glass-morphism rounded-lg border-border/50 px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                value={filters.sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Grid */}
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

            {/* Load More */}
            <div className="mt-12 text-center">
              <button className="glass-morphism rounded-full px-8 py-3 font-medium transition-all hover:scale-105 hover:shadow-[var(--shadow-glass)]">
                Load More Products
              </button>
            </div>
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

const Women = () => {
  return (
    <FilterProvider>
      <WomenContent />
    </FilterProvider>
  );
};

export default Women;
