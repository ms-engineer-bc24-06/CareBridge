"use client";
import React, { useEffect } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";

const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

const PaymentPage: React.FC = () => {
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {};

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    if (!stripe) {
      console.error("Stripe.js failed to load.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/create-checkout-session/`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        console.error("Failed to create checkout session:");
        return;
      }

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result?.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Error during checkout:");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>お支払いがキャンセルされました</h1>
      <p>
        お支払い手続きを完了せずに終了しました。再度お手続きを行う場合は、以下のボタンをクリックしてください。
      </p>
      <button
        onClick={handleCheckout}
        style={{
          padding: "15px 30px",
          fontSize: "20px",
          backgroundColor: "#023059",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        再度お支払い手続きを行う
      </button>
      <p style={{ marginTop: "20px", fontSize: "16px" }}>
        サービスを継続しない場合は、このページを閉じてください。
      </p>
    </div>
  );
};

export default PaymentPage;
