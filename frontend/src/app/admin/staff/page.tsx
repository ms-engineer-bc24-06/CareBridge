import React from 'react';

const StaffManagement: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Staff Management</h1>
      {/* 職員情報の表示・編集コンポーネントをここに配置 */}
    </div>
  );
};

export default StaffManagement;
// "use client";
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// interface Staff {
//   staff_id: number;
//   staff_name: string;
//   position: string;
//   contact: string;
// }

// const StaffPage: React.FC = () => {
//   const [staff, setStaff] = useState<Staff[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     axios.get('/api/staff')
//       .then(response => setStaff(response.data))
//       .catch(error => console.error(error));
//   }, []);

//   const handleBack = () => {
//     router.push('/admin/dashboard');
//   };

//   return (
//     <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/background.png)' }}>
//       <div className="p-6 bg-white bg-opacity-90">
//         <h1 className="text-2xl font-bold mb-4">職員管理</h1>
//         <button onClick={handleBack} className="mb-4 p-2 bg-blue-500 text-white rounded">戻る</button>
//         <table className="min-w-full bg-white">
//           <thead>
//             <tr>
//               <th className="py-2">職員ID</th>
//               <th className="py-2">職員名</th>
//               <th className="py-2">役職</th>
//               <th className="py-2">連絡先</th>
//             </tr>
//           </thead>
//           <tbody>
//             {staff.map(staffMember => (
//               <tr key={staffMember.staff_id}>
//                 <td className="py-2">{staffMember.staff_id}</td>
//                 <td className="py-2">{staffMember.staff_name}</td>
//                 <td className="py-2">{staffMember.position}</td>
//                 <td className="py-2">{staffMember.contact}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default StaffPage;


