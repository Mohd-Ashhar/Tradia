import { useState } from "react";
import {
  Shirt,
  Watch,
  Gem,
  Footprints,
  ShoppingBag,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useFilters } from "@/contexts/FilterContext";

const categories = [
  { id: "clothing", name: "Clothing", icon: Shirt },
  { id: "accessories", name: "Accessories", icon: Sparkles },
  { id: "jewelry", name: "Jewelry", icon: Gem },
  { id: "footwear", name: "Footwear", icon: Footprints },
  { id: "bags", name: "Bags", icon: ShoppingBag },
  { id: "watches", name: "Watches", icon: Watch },
];

export const FilterSidebar = () => {
  const { filters, setCategories, setPriceRange, setSizes } = useFilters();
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    size: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setCategories([...filters.categories, categoryId]);
    } else {
      setCategories(filters.categories.filter((c) => c !== categoryId));
    }
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSizes([...filters.sizes, size]);
    } else {
      setSizes(filters.sizes.filter((s) => s !== size));
    }
  };

  return (
    <aside className="glass-morphism sticky top-24 h-fit rounded-2xl p-6 shadow-[var(--shadow-glass)]">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Filters</h2>
        <p className="text-sm text-muted-foreground">Refine your search</p>
      </div>

      {/* Categories */}
      <Collapsible open={openSections.categories}>
        <CollapsibleTrigger
          onClick={() => toggleSection("categories")}
          className="mb-4 flex w-full items-center justify-between text-sm font-semibold uppercase tracking-wider"
        >
          Categories
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              openSections.categories && "rotate-180"
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-3">
              <Checkbox
                id={category.id}
                checked={filters.categories.includes(category.id)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category.id, checked as boolean)
                }
              />
              <Label
                htmlFor={category.id}
                className="flex flex-1 cursor-pointer items-center gap-2 text-sm font-medium"
              >
                <category.icon className="h-4 w-4 text-muted-foreground" />
                {category.name}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <div className="my-6 h-px bg-border" />

      {/* Price Range */}
      <Collapsible open={openSections.price}>
        <CollapsibleTrigger
          onClick={() => toggleSection("price")}
          className="mb-4 flex w-full items-center justify-between text-sm font-semibold uppercase tracking-wider"
        >
          Price Range
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              openSections.price && "rotate-180"
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={5000}
            step={100}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">${filters.priceRange[0]}</span>
            <span className="font-medium">${filters.priceRange[1]}</span>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </aside>
  );
};
