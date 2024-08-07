import React from 'react';

const FacilityManagement: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Facility Management</h1>
      {/* 施設情報の表示・編集コンポーネントをここに配置 */}
    </div>
  );
};

export default FacilityManagement;
// "use client";
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// // 施設情報の型を定義します
// interface Facility {
//   facility_id: number;
//   facility_name: string;
//   address: string;
//   phone_number: string;
//   email: string;
//   payment_id: number;
// }

// const FacilitiesPage: React.FC = () => {
//   // ステートの型をFacility[]に設定します
//   const [facilities, setFacilities] = useState<Facility[]>([]);

//   useEffect(() => {
//     axios.get('/api/facilities')
//       .then(response => setFacilities(response.data))
//       .catch(error => console.error(error));
//   }, []);

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">施設情報</h1>
//       <table className="min-w-full bg-white">
//         <thead>
//           <tr>
//             <th className="py-2">施設名</th>
//             <th className="py-2">住所</th>
//             <th className="py-2">電話番号</th>
//             <th className="py-2">メールアドレス</th>
//             <th className="py-2">決済ID</th>
//           </tr>
//         </thead>
//         <tbody>
//           {facilities.map(facility => (
//             <tr key={facility.facility_id}>
//               <td className="py-2">{facility.facility_name}</td>
//               <td className="py-2">{facility.address}</td>
//               <td className="py-2">{facility.phone_number}</td>
//               <td className="py-2">{facility.email}</td>
//               <td className="py-2">{facility.payment_id}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default FacilitiesPage;

