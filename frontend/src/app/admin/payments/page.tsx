import React from 'react';

const PaymentManagement: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Payment Management</h1>
      {/* 決済情報の表示・編集コンポーネントをここに配置 */}
    </div>
  );
};

export default PaymentManagement;
// "use client";
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// interface Payment {
//   payment_id: number;
//   card_number: string;
//   card_expiry: string;
//   card_cvc: string;
//   created_at: string;
//   updated_at: string;
// }

// const PaymentsPage: React.FC = () => {
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     axios.get('/api/payments')
//       .then(response => setPayments(response.data))
//       .catch(error => console.error(error));
//   }, []);

//   const handleBack = () => {
//     router.push('/admin/dashboard');
//   };

//   return (
//     <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/background.png)' }}>
//       <div className="p-6 bg-white bg-opacity-90">
//         <h1 className="text-2xl font-bold mb-4">決済管理</h1>
//         <button onClick={handleBack} className="mb-4 p-2 bg-blue-500 text-white rounded">戻る</button>
//         <table className="min-w-full bg-white">
//           <thead>
//             <tr>
//               <th className="py-2">決済ID</th>
//               <th className="py-2">カード番号</th>
//               <th className="py-2">有効期限</th>
//               <th className="py-2">CVCコード</th>
//               <th className="py-2">追加日時</th>
//               <th className="py-2">更新日時</th>
//             </tr>
//           </thead>
//           <tbody>
//             {payments.map(payment => (
//               <tr key={payment.payment_id}>
//                 <td className="py-2">{payment.payment_id}</td>
//                 <td className="py-2">{payment.card_number}</td>
//                 <td className="py-2">{payment.card_expiry}</td>
//                 <td className="py-2">{payment.card_cvc}</td>
//                 <td className="py-2">{payment.created_at}</td>
//                 <td className="py-2">{payment.updated_at}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PaymentsPage;

