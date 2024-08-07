import React from 'react';

const UserManagement: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      {/* 利用者情報の表示・編集コンポーネントをここに配置 */}
    </div>
  );
};

export default UserManagement;
// "use client";
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// interface User {
//   user_id: number;
//   user_name: string;
//   user_birthday: string;
//   user_sex: string;
//   emergency_contact_name: string;
// }

// const UsersPage: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     axios.get('/api/users')
//       .then(response => setUsers(response.data))
//       .catch(error => console.error(error));
//   }, []);

//   const handleBack = () => {
//     router.push('/admin/dashboard');
//   };

//   return (
//     <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/background.png)' }}>
//       <div className="p-6 bg-white bg-opacity-90">
//         <h1 className="text-2xl font-bold mb-4">利用者管理</h1>
//         <button onClick={handleBack} className="mb-4 p-2 bg-blue-500 text-white rounded">戻る</button>
//         <table className="min-w-full bg-white">
//           <thead>
//             <tr>
//               <th className="py-2">利用者ID</th>
//               <th className="py-2">利用者名</th>
//               <th className="py-2">誕生日</th>
//               <th className="py-2">性別</th>
//               <th className="py-2">緊急連絡先</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map(user => (
//               <tr key={user.user_id}>
//                 <td className="py-2">{user.user_id}</td>
//                 <td className="py-2">{user.user_name}</td>
//                 <td className="py-2">{user.user_birthday}</td>
//                 <td className="py-2">{user.user_sex}</td>
//                 <td className="py-2">{user.emergency_contact_name}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default UsersPage;

