// src/integrations/supabase/api.ts (or similar)
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner"; // Using sonner based on your project setup

/**
 * Calls the cancel_order RPC function in Supabase.
 * @param orderId The UUID of the order to cancel.
 */
export const cancelOrderApi = async (orderId: string) => {
  const { data, error } = await supabase.rpc("cancel_order", {
    order_id_to_cancel: orderId,
  });

  if (error) {
    console.error("Error cancelling order:", error);
    toast.error("Failed to cancel order", { description: error.message });
    throw error; // Re-throw so the component knows about the failure
  } else {
    toast.success(data || "Order cancelled successfully"); // Show success message from function
    return data; // Return data on success
  }
};

/**
 * Calls the update_order_status RPC function in Supabase.
 * Use this for admin actions or potentially user actions like confirming receipt.
 * @param orderId The UUID of the order to update.
 * @param updates An object containing the fields to update (status, paymentStatus, trackingNumber).
 */
export const updateOrderStatusApi = async (
  orderId: string,
  updates: { status?: string; paymentStatus?: string; trackingNumber?: string }
) => {
  const { error } = await supabase.rpc("update_order_status", {
    order_id_to_update: orderId,
    new_status: updates.status,
    new_payment_status: updates.paymentStatus,
    new_tracking_number: updates.trackingNumber,
  });

  if (error) {
    console.error("Error updating order status:", error);
    toast.error("Failed to update order status", {
      description: error.message,
    });
    throw error;
  } else {
    toast.success("Order status updated");
  }
};
