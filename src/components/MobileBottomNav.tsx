import { Home, Grid3x3, ShoppingCart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Grid3x3, label: 'Products', path: '/products' },
  { icon: ShoppingCart, label: 'Cart', path: '/cart', badge: 3 },
  { icon: User, label: 'Account', path: '/auth' },
];

export const MobileBottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-morphism border-t border-border/50 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 py-3 safe-area-inset-bottom">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative flex flex-col items-center gap-1 rounded-2xl px-6 py-2 transition-all duration-300 active:scale-95",
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-accent/10"
                    : "hover:bg-muted/50"
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-all duration-300",
                      isActive
                        ? "text-primary scale-110"
                        : "text-muted-foreground"
                    )}
                  />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-xs font-bold text-white animate-bounce-subtle">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse-slow" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium transition-all duration-300",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
