"use client";
import React, { useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

const stripePromise: Promise<Stripe | null> = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

const PaymentPage: React.FC = () => {
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false); // 支払い成功を管理するステート

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
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
      // ローカルストレージから施設IDを取得
      const facilityId = localStorage.getItem('facilityId');
      
      const response = await fetch('http://localhost:8000/api/create-checkout-session/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ facilityId }), // 施設IDを一緒に送信
        credentials: 'include'
      });

      if (!response.ok) {
        return;
      }

      const session = await response.json();  
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result?.error) {
      } else {
        // 支払いが成功した場合に成功メッセージを表示
        setPaymentSuccess(true);
      }
    } catch (error) {
      console.error('Error during checkout:');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {paymentSuccess ? (
        <p style={{ fontSize: '18px', color: 'green', marginBottom: '20px' }}>
          決済が完了しました。ありがとうございました！
        </p>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default PaymentPage;
