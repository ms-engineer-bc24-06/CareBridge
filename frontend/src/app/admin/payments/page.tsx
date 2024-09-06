
// "use client";
// import React, { useEffect } from 'react';
// import { loadStripe, Stripe } from '@stripe/stripe-js';

// const stripePromise: Promise<Stripe | null> = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

// const PaymentPage: React.FC = () => {
//   useEffect(() => {
//     const handlePopState = (event: PopStateEvent) => {
//       console.log('User tried to navigate back');
//     };

//     window.addEventListener('popstate', handlePopState);

//     return () => {
//       window.removeEventListener('popstate', handlePopState);
//     };
//   }, []);

//   const handleCheckout = async () => {
//     const stripe = await stripePromise;

//     if (!stripe) {
//       console.error('Stripe.js failed to load.');
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:8000/api/payments/create-checkout-session/', {
//         method: 'POST',
//       });

//       if (!response.ok) {
//         console.error('Failed to create checkout session:', response.statusText);
//         return;
//       }

//       const session = await response.json();

//       const result = await stripe.redirectToCheckout({
//         sessionId: session.id,
//       });

//       if (result?.error) {
//         console.error(result.error.message);
//       }
//     } catch (error) {
//       console.error('Error during checkout:', error);
//     }
//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <p style={{ fontSize: '18px', marginBottom: '20px' }}>
//         このボタンをクリックすると、クレジットカードでの支払い画面に進みます。
//       </p>
//       <button
//         onClick={handleCheckout}
//         style={{
//           padding: '15px 30px',
//           fontSize: '20px',
//           backgroundColor: '#023059',
//           color: 'white',
//           border: 'none',
//           borderRadius: '5px',
//           cursor: 'pointer',
//         }}
//       >
//         クレジットカードで支払う
//       </button>
//     </div>
//   );
// };

// export default PaymentPage;



// "use client";
// import React, { useState, useEffect } from 'react';
// import { loadStripe, Stripe } from '@stripe/stripe-js';

// const stripePromise: Promise<Stripe | null> = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

// const PaymentPage: React.FC = () => {
//   const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false); // 支払い成功を管理するステート
//   // useEffect フック:
//   // ユーザーがブラウザの戻るボタンを押した場合の挙動を制御するためのイベントリスナーを設定しています。
//   useEffect(() => {
//     const handlePopState = (event: PopStateEvent) => {
//       console.log('User tried to navigate back');
//     };

//     window.addEventListener('popstate', handlePopState);

//     return () => {
//       window.removeEventListener('popstate', handlePopState);
//     };
//   }, []);

// //   handleCheckout 関数:
// // Djangoバックエンドのcreate_checkout_sessionエンドポイントにリクエストを送り、セッションを作成します。
// // セッションが正常に作成されると、そのセッションIDを使用してStripeのCheckoutページにリダイレクトします。
// // 支払いが成功すると、成功メッセージを表示します。
//   const handleCheckout = async () => {
//     const stripe = await stripePromise;

//     if (!stripe) {
//       console.error('Stripe.js failed to load.');
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:8000/api/create-checkout-session/', {
//         method: 'POST',
//         credentials: 'include'
//       });

//       if (!response.ok) {
//         console.error('Failed to create checkout session:', response.statusText);
//         return;
//       }

//       const session = await response.json();  
//       console.log('Checkout session ID:', session.id);
//       const result = await stripe.redirectToCheckout({
//         sessionId: session.id,
//       });

//       if (result?.error) {
//         console.error(result.error.message);
//       } else {
//         // 支払いが成功した場合に成功メッセージを表示
//         setPaymentSuccess(true);
//       }
//     } catch (error) {
//       console.error('Error during checkout:', error);
//     }
//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       {paymentSuccess ? (
//         <p style={{ fontSize: '18px', color: 'green', marginBottom: '20px' }}>
//           決済が完了しました。ありがとうございました！
//         </p>
//       ) : (
//         <>
//           <p style={{ fontSize: '18px', marginBottom: '20px' }}>
//             このボタンをクリックすると、クレジットカードでの支払い画面に進みます。
//           </p>
//           <button
//             onClick={handleCheckout}
//             style={{
//               padding: '15px 30px',
//               fontSize: '20px',
//               backgroundColor: '#023059',
//               color: 'white',
//               border: 'none',
//               borderRadius: '5px',
//               cursor: 'pointer',
//             }}
//           >
//             クレジットカードで支払う
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default PaymentPage;


"use client";
import React, { useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

const stripePromise: Promise<Stripe | null> = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

const PaymentPage: React.FC = () => {
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false); // 支払い成功を管理するステート

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
      // ローカルストレージから施設IDを取得
      const facilityId = localStorage.getItem('facilityId');
      console.log('Retrieved facilityId from localStorage:', facilityId);
      
      const response = await fetch('http://localhost:8000/api/create-checkout-session/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ facilityId }), // 施設IDを一緒に送信
        credentials: 'include'
      });

      if (!response.ok) {
        console.error('Failed to create checkout session:', response.statusText);
        return;
      }

      const session = await response.json();  
      console.log('Checkout session ID:', session.id);
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result?.error) {
        console.error(result.error.message);
      } else {
        // 支払いが成功した場合に成功メッセージを表示
        setPaymentSuccess(true);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
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
