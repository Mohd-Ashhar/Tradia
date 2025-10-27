import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Products from "./pages/Products";
import MobileProducts from "./pages/MobileProducts";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Sale from "./pages/Sale";
import { CartProvider } from "./contexts/CartContext";
import OrderSuccess from '@/pages/OrderSuccess';
import OrderHistory from '@/pages/OrderHistory';


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/men" element={<Men />} />
              <Route path="/women" element={<Women />} />
              <Route path="/sale" element={<Sale />} />
              <Route path="/mobile-products" element={<MobileProducts />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/install" element={<Install />} />
              <Route path="/auth" element={<Auth />} />

              <Route
                path="/order-success/:orderNumber"
                element={<OrderSuccess />}
              />
              <Route path="/orders" element={<OrderHistory />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
