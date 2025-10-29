// src/pages/OrderHistory.tsx

import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Import useQueryClient
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
import { useState } from "react"; // Import useState
import { toast } from "sonner"; // Import sonner toast
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components
import { cancelOrderApi } from "@/integrations/supabase/api"; // Import the API function

// ... (Keep existing type definitions: OrderProduct, OrderItem, Order) ...
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

// ... (Keep existing fetchOrders function) ...
const fetchOrders = async (userId: string): Promise<Order[]> => {
  // ... function implementation ...
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
  const queryClient = useQueryClient(); // Get query client instance

  // State for managing cancellation loading and confirmation dialog
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<{
    id: string;
    number: string;
  } | null>(null);

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<Order[]>({
    queryKey: ["orders", user?.id],
    queryFn: () => fetchOrders(user!.id),
    enabled: !!user, // Only run if user is logged in
  });

  // --- NEW: Function to initiate cancellation ---
  const handleCancelClick = (orderId: string, orderNumber: string) => {
    setOrderToCancel({ id: orderId, number: orderNumber });
    setShowConfirmDialog(true);
  };

  // --- NEW: Function to perform the cancellation after confirmation ---
  const performCancellation = async () => {
    if (!orderToCancel) return;

    setCancellingOrderId(orderToCancel.id);
    setShowConfirmDialog(false); // Close dialog

    try {
      await cancelOrderApi(orderToCancel.id);
      // Invalidate the orders query to refetch data and update UI
      queryClient.invalidateQueries({ queryKey: ["orders", user?.id] });
    } catch (err) {
      // Error toast is handled within cancelOrderApi, but you could add more UI feedback here
      console.error("Cancellation failed in component:", err);
    } finally {
      setCancellingOrderId(null);
      setOrderToCancel(null);
    }
  };

  const renderContent = () => {
    // ... (Keep existing isLoading, error, and no orders checks) ...
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
        {orders.map((order) => {
          // --- NEW: Check if the order is cancellable ---
          const isCancellable = ["pending", "processing"].includes(
            order.status
          );
          const isCurrentlyCancelling = cancellingOrderId === order.id;

          return (
            <AccordionItem
              key={order.id}
              value={order.id}
              className="rounded-2xl border-none glass-morphism"
            >
              <AccordionTrigger className="p-6 text-left hover:no-underline">
                {/* ... (Keep existing trigger content) ... */}
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
                      variant={
                        order.status === "pending" ||
                        order.status === "processing"
                          ? "outline"
                          : order.status === "cancelled"
                          ? "destructive"
                          : "default"
                      }
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
                  {/* ... (Keep existing item mapping) ... */}
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

                  {/* --- NEW: Add Cancel Button conditionally --- */}
                  {isCancellable && (
                    <div className="mt-6 border-t border-border/50 pt-6">
                      <Button
                        variant="destructive"
                        onClick={() =>
                          handleCancelClick(order.id, order.order_number)
                        }
                        disabled={isCurrentlyCancelling}
                        size="sm"
                      >
                        {isCurrentlyCancelling ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Cancel Order
                      </Button>
                    </div>
                  )}
                  {/* -------------------------------------- */}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
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

      {/* --- NEW: Confirmation Dialog --- */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="glass-morphism">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel order #{orderToCancel?.number}. This action
              cannot be undone, and items will be restocked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!cancellingOrderId}>
              Back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={performCancellation}
              disabled={!!cancellingOrderId}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancellingOrderId === orderToCancel?.id ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Yes, Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* ----------------------------- */}
    </div>
  );
};

export default OrderHistory;
