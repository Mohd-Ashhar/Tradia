import { Product } from '@/data/products';
import { FilterState } from '@/contexts/FilterContext';

export const filterProducts = (products: Product[], filters: FilterState): Product[] => {
  let filtered = [...products];

  // Filter by categories
  if (filters.categories.length > 0) {
    filtered = filtered.filter(product =>
      filters.categories.some(cat => 
        product.category.toLowerCase() === cat.toLowerCase()
      )
    );
  }

  // Filter by price range
  filtered = filtered.filter(
    product => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
  );

  // Sort products
  switch (filters.sortBy) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      // In a real app, you'd have a createdAt field
      filtered.reverse();
      break;
    default:
      // 'featured' - keep original order
      break;
  }

  return filtered;
};
