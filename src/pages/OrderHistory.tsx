import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ProductHeader } from "@/components/ProductHeader";
import { Loader2, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Define types for the fetched data
interface OrderProduct {
  id: string;
  name: string;
  image_url: string | null;
}

interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  products: OrderProduct | null;
}

interface Order {
  id: string;
  created_at: string;
  order_number: string;
  status: string;
  total_amount: number;
  order_items: OrderItem[];
}

// Fetch function
const fetchOrders = async (userId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      created_at,
      order_number,
      status,
      total_amount,
      order_items (
        id,
        quantity,
        price_at_purchase,
        products ( id, name, image_url )
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data as Order[];
};

const OrderHistory = () => {
  const { user } = useAuth();
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<Order[]>({
    queryKey: ["orders", user?.id],
    queryFn: () => fetchOrders(user!.id),
    enabled: !!user, // Only run if user is logged in
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4 rounded-2xl glass-morphism p-10 text-center">
          <h2 className="text-2xl font-bold text-destructive">
            Error Loading Orders
          </h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      );
    }

    if (!orders || orders.length === 0) {
      return (
        <div className="flex h-[60vh] flex-col items-center justify-center gap-6 rounded-2xl glass-morphism p-10 text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground/30" />
          <h2 className="text-3xl font-bold">No Orders Found</h2>
          <p className="text-muted-foreground">
            You haven't placed any orders yet.
          </p>
          <Button asChild size="lg">
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      );
    }

    return (
      <Accordion type="single" collapsible className="w-full space-y-6">
        {orders.map((order) => (
          <AccordionItem
            key={order.id}
            value={order.id}
            className="rounded-2xl border-none glass-morphism"
          >
            <AccordionTrigger className="p-6 text-left hover:no-underline">
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-foreground">
                    Order #{order.order_number}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex flex-col items-start sm:items-end">
                  <span className="font-heading text-2xl font-bold text-gradient">
                    ${order.total_amount.toLocaleString()}
                  </span>
                  <Badge
                    variant={order.status === "pending" ? "outline" : "premium"}
                    className="mt-1 capitalize"
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
              <div className="border-t border-border/50 pt-6">
                <h4 className="mb-4 text-lg font-semibold">
                  Items in this order
                </h4>
                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.products?.image_url || "/placeholder.svg"}
                        alt={item.products?.name || "Product"}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold">{item.products?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          $
                          {(
                            item.price_at_purchase * item.quantity
                          ).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          (${item.price_at_purchase.toLocaleString()} each)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <ProductHeader />
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-heading mb-8 text-4xl font-bold sm:text-5xl">
          My Orders
        </h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default OrderHistory;
