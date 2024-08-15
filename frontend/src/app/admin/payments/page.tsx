
"use client";
import React, { useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

const stripePromise: Promise<Stripe | null> = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

const PaymentPage: React.FC = () => {
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log('User tried to navigate back');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    if (!stripe) {
      console.error('Stripe.js failed to load.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/payments/create-checkout-session/', {
        method: 'POST',
      });

      if (!response.ok) {
        console.error('Failed to create checkout session:', response.statusText);
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
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <p style={{ fontSize: '18px', marginBottom: '20px' }}>
        このボタンをクリックすると、クレジットカードでの支払い画面に進みます。
      </p>
      <button
        onClick={handleCheckout}
        style={{
          padding: '15px 30px',
          fontSize: '20px',
          backgroundColor: '#023059',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        クレジットカードで支払う
      </button>
    </div>
  );
};

export default PaymentPage;

