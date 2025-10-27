import { useState } from "react";
// Import Package icon
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  LogOut,
  LogIn,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
export const ProductHeader = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You've been successfully signed out",
      });
      navigate("/auth");
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-morphism border-b border-border/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* ... (Logo, Desktop Navigation, Search Bar remain the same) ... */}
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">
              <span className="text-gradient">Tradia</span>
            </h1>
          </Link>

          {/* <nav className="hidden items-center space-x-8 md:flex">
            <Link
              to="/products"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              New Arrivals
            </Link>
            <Link
              to="/women"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Women
            </Link>
            <Link
              to="/men"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Men
            </Link>
            <Link
              to="/sale"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Sale
            </Link>
          </nav> */}

          {/* <div
            className={cn(
              "hidden md:flex items-center transition-all duration-300",
              isSearchOpen ? "w-64" : "w-10"
            )}
          >
            {isSearchOpen ? (
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10 pr-4 glass-morphism border-border/50"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="hover:bg-primary/10"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div> */}

          {/* Actions */}
          <div className="flex items-center space-x-2">
         
            {/* <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-primary/10"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button> */}

            {/* <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex hover:bg-primary/10"
            >
              <Heart className="h-5 w-5" />
            </Button> */}

            {/* Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex hover:bg-primary/10"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-morphism">
                <div className="px-2 py-1.5 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                <DropdownMenuSeparator />
                {user ? (
                  <>
                    <div className="px-2 py-1.5 text-sm text-muted-foreground truncate">
                      {user.email}
                    </div>
                    <DropdownMenuSeparator />
                    {/* --- ADDED MY ORDERS LINK --- */}
                    <Link to="/orders">
                      <DropdownMenuItem className="cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                      </DropdownMenuItem>
                    </Link>
                    {/* --------------------------- */}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem
                    onClick={() => navigate("/auth")}
                    className="cursor-pointer"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Link to="/cart">
              <Button
                size="icon"
                className="relative bg-gradient-to-r from-primary to-accent hover:shadow-lg"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* ... (Mobile Menu Toggle remains the same) ... */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-primary/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* ... (Mobile Search Bar and Mobile Menu remain the same) ... */}
        {isSearchOpen && (
          <div className="pb-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 pr-4 glass-morphism border-border/50"
              />
            </div>
          </div>
        )}

        {isMobileMenuOpen && (
          <nav className="flex flex-col space-y-4 border-t border-border/50 py-4 md:hidden">
            {/* <Link
              to="/products"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              New Arrivals
            </Link>
            <Link
              to="/women"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Women
            </Link>
            <Link
              to="/men"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Men
            </Link>
            <Link
              to="/sale"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sale
            </Link> */}
          </nav>
        )}
      </div>
    </header>
  );
};
