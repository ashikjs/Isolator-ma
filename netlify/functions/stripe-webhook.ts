import { Handler } from "@netlify/functions";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});
const supabase = createClient(
  process.env.VITE_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

// Define Stripe Event Type
type StripeCheckoutSession = {
  id: string;
  payment_status: string;
  amount_total: number;
  currency: string;
  metadata: {
    user_id: string;
  };
};

// Webhook Handler
const handler: Handler = async (event) => {
  const sig = event.headers["stripe-signature"] as string;
  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body as string,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object as StripeCheckoutSession;

    console.log("Received checkout session:", session);

    // Insert payment details into Supabase
    const { data, error } = await supabase.from("payments").insert([
      {
        user_id: session.metadata.user_id,
        session_id: session.id,
        status: session.payment_status,
        amount: session.amount_total ? session.amount_total / 100 : 0, // Handle null case
        currency: session.currency || "USD", // Default to USD if missing
        created_at: new Date().toISOString(),
      },
    ]);

    // Log data and errors from Supabase
    console.log("Supabase response:", { data, error });

    if (error) {
      console.error("Supabase insert error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Database insert failed", details: error }),
      };
    }

    console.log("Payment stored successfully:", data);
  }

  return { statusCode: 200, body: "Webhook received" };
};

export { handler };
