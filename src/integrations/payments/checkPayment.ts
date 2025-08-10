import { supabase } from "@/integrations/supabase/client";

export async function userHasActivePayment(userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false;
  const { data, error } = await supabase
    .from("payment_logs")
    .select("status")
    .eq("user_id", userId)
    .eq("status", "succeeded")
    .limit(1);
  if (error) return false;
  return Array.isArray(data) && data.length > 0;
}


