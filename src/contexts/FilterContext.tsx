import { createContext, useContext, useState, ReactNode } from 'react';

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  sizes: string[];
  sortBy: string;
}

interface FilterContextType {
  filters: FilterState;
  setCategories: (categories: string[]) => void;
  setPriceRange: (range: [number, number]) => void;
  setSizes: (sizes: string[]) => void;
  setSortBy: (sortBy: string) => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const defaultFilters: FilterState = {
  categories: [],
  priceRange: [0, 5000],
  sizes: [],
  sortBy: 'featured',
};

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const setCategories = (categories: string[]) => {
    setFilters(prev => ({ ...prev, categories }));
  };

  const setPriceRange = (range: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange: range }));
  };

  const setSizes = (sizes: string[]) => {
    setFilters(prev => ({ ...prev, sizes }));
  };

  const setSortBy = (sortBy: string) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        setCategories,
        setPriceRange,
        setSizes,
        setSortBy,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
