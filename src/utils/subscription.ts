import { supabase } from "../lib/supabase";

/**
 * Checks if a user has an active subscription in the `payments` table.
 * @param userId - The ID of the logged-in user.
 * @returns Promise<boolean> - Returns true if the user has an active subscription, otherwise false.
 */
export const checkSubscription = async (userId: string): Promise<boolean> => {
  try {
    const { data, error }: any = await supabase
      .from("payments")
      .select("status")
      .eq("user_id", userId)
      .eq("status", "paid")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.log("Error fetching subscription:", error);
      return false;
    }

    console.log("Subscription status:", data);

    if (data?.status === 'paid') {
      localStorage.setItem("isPaidUser", 'true');
      return true
    } else {
      localStorage.setItem("isPaidUser", 'false');
      return false
    }
  } catch (err) {
    console.error("Unexpected error checking subscription:", err);
    return false;
  }
};
