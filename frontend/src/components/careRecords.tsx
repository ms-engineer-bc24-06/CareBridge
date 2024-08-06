// "use client";
// import React, { useState } from 'react';

// type CareRecord = {
//   care_record_id: string;
//   date: string;
//   meal: string;
//   excretion: string;
//   bath: string;
//   temperature: number | null;
//   systolic_bp: number | null;
//   diastolic_bp: number | null;
//   comments: string | null;
// };

// const CareRecords: React.FC = () => {
//   const [careRecords, setCareRecords] = useState<CareRecord[]>([]);
//   const [newRecord, setNewRecord] = useState<CareRecord>({
//     care_record_id: '',
//     date: '',
//     meal: '',
//     excretion: '',
//     bath: '',
//     temperature: null,
//     systolic_bp: null,
//     diastolic_bp: null,
//     comments: ''
//   });

//   const handleAddRecord = () => {
//     setCareRecords([...careRecords, { ...newRecord, care_record_id: Date.now().toString() }]);
//     setNewRecord({
//       care_record_id: '',
//       date: '',
//       meal: '',
//       excretion: '',
//       bath: '',
//       temperature: null,
//       systolic_bp: null,
//       diastolic_bp: null,
//       comments: ''
//     });
//   };

//   const handleDeleteRecord = (id: string) => {
//     setCareRecords(careRecords.filter(record => record.care_record_id !== id));
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-semibold mb-4">介護記録管理</h2>
//       <div className="mb-6">
//         <input
//           type="date"
//           value={newRecord.date}
//           onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
//           className="border border-gray-300 p-2 mb-2 w-full"
//         />
//         <select
//           value={newRecord.meal}
//           onChange={(e) => setNewRecord({ ...newRecord, meal: e.target.value })}
//           className="border border-gray-300 p-2 mb-2 w-full"
//         >
//           <option value="">食事：選択してください</option>
//           <option value="完食">完食</option>
//           <option value="ほとんど食べた">ほとんど食べた</option>
//           <option value="半分食べた">半分食べた</option>
//           <option value="少し食べた">少し食べた</option>
//           <option value="食べなかった">食べなかった</option>
//         </select>
//         <select
//           value={newRecord.excretion}
//           onChange={(e) => setNewRecord({ ...newRecord, excretion: e.target.value })}
//           className="border border-gray-300 p-2 mb-2 w-full"
//         >
//           <option value="">排便：選択してください</option>
//           <option value="コロコロ">コロコロ</option>
//           <option value="硬便">硬便</option>
//           <option value="普通便">普通便</option>
//           <option value="軟便">軟便</option>
//           <option value="水様便">水様便</option>
//           <option value="なし">なし</option>
//         </select>
//         <select
//           value={newRecord.bath}
//           onChange={(e) => setNewRecord({ ...newRecord, bath: e.target.value })}
//           className="border border-gray-300 p-2 mb-2 w-full"
//         >
//           <option value="">入浴：選択してください</option>
//           <option value="入浴">入浴</option>
//           <option value="シャワー">シャワー</option>
//           <option value="体を拭く">体を拭く</option>
//           <option value="なし">なし</option>
//         </select>
//         <input
//           type="number"
//           placeholder="体温"
//           value={newRecord.temperature || ''}
//           onChange={(e) => setNewRecord({ ...newRecord, temperature: parseFloat(e.target.value) })}
//           className="border border-gray-300 p-2 mb-2 w-full"
//         />
//         <input
//           type="number"
//           placeholder="収縮期血圧"
//           value={newRecord.systolic_bp || ''}
//           onChange={(e) => setNewRecord({ ...newRecord, systolic_bp: parseFloat(e.target.value) })}
//           className="border border-gray-300 p-2 mb-2 w-full"
//         />
//         <input
//           type="number"
//           placeholder="拡張期血圧"
//           value={newRecord.diastolic_bp || ''}
//           onChange={(e) => setNewRecord({ ...newRecord, diastolic_bp: parseFloat(e.target.value) })}
//           className="border border-gray-300 p-2 mb-2 w-full"
//         />
//         <textarea
//           placeholder="コメント"
//           value={newRecord.comments || ''}
//           onChange={(e) => setNewRecord({ ...newRecord, comments: e.target.value })}
//           className="border border-gray-300 p-2 mb-2 w-full"
//         />
//         <button onClick={handleAddRecord} className="bg-blue-500 text-white p-2 rounded">追加</button>
//       </div>
//       <table className="w-full border-collapse border border-gray-300">
//         <thead>
//           <tr>
//             <th className="border border-gray-300 p-2">日付</th>
//             <th className="border border-gray-300 p-2">食事</th>
//             <th className="border border-gray-300 p-2">排便</th>
//             <th className="border border-gray-300 p-2">入浴</th>
//             <th className="border border-gray-300 p-2">体温</th>
//             <th className="border border-gray-300 p-2">収縮期血圧</th>
//             <th className="border border-gray-300 p-2">拡張期血圧</th>
//             <th className="border border-gray-300 p-2">コメント</th>
//             <th className="border border-gray-300 p-2">操作</th>
//           </tr>
//         </thead>
//         <tbody>
//           {careRecords.map((record) => (
//             <tr key={record.care_record_id}>
//               <td className="border border-gray-300 p-2">{record.date}</td>
//               <td className="border border-gray-300 p-2">{record.meal}</td>
//               <td className="border border-gray-300 p-2">{record.excretion}</td>
//               <td className="border border-gray-300 p-2">{record.bath}</td>
//               <td className="border border-gray-300 p-2">{record.temperature}</td>
//               <td className="border border-gray-300 p-2">{record.systolic_bp}</td>
//               <td className="border border-gray-300 p-2">{record.diastolic_bp}</td>
//               <td className="border border-gray-300 p-2">{record.comments}</td>
//               <td className="border border-gray-300 p-2">
//                 <button onClick={() => handleDeleteRecord(record.care_record_id)} className="text-red-500">削除</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CareRecords;
// "use client";
// import React, { useState } from 'react';

// type CareRecord = {
//   care_record_id: string;
//   date: string;
//   meal: string;
//   excretion: string;
//   bath: string;
//   temperature: number | null;
//   systolic_bp: number | null;
//   diastolic_bp: number | null;
//   comments: string | null;
// };

// const CareRecords: React.FC = () => {
//   const [careRecords, setCareRecords] = useState<CareRecord[]>([]);
//   const [newRecord, setNewRecord] = useState<CareRecord>({
//     care_record_id: '',
//     date: '',
//     meal: '',
//     excretion: '',
//     bath: '',
//     temperature: null,
//     systolic_bp: null,
//     diastolic_bp: null,
//     comments: ''
//   });
//   const [isEditing, setIsEditing] = useState(false); // 編集モードの状態

//   const handleAddOrUpdateRecord = () => {
//     if (validateRecord()) {
//       if (isEditing) {
//         setCareRecords(careRecords.map(record =>
//           record.care_record_id === newRecord.care_record_id ? newRecord : record
//         ));
//         setIsEditing(false); // 編集モードを解除
//       } else {
//         setCareRecords([...careRecords, { ...newRecord, care_record_id: Date.now().toString() }]);
//       }
//       resetNewRecord();
//     }
//   };

//   const validateRecord = () => {
//     return newRecord.date !== '' &&
//            newRecord.meal !== '' &&
//            newRecord.excretion !== '' &&
//            newRecord.bath !== '' &&
//            newRecord.temperature !== null &&
//            newRecord.systolic_bp !== null &&
//            newRecord.diastolic_bp !== null &&
//            newRecord.comments !== '';
//   };

//   const handleEditRecord = (record: CareRecord) => {
//     setNewRecord(record);
//     setIsEditing(true); // 編集モードを有効にする
//   };

//   const handleDeleteRecord = (id: string) => {
//     setCareRecords(careRecords.filter(record => record.care_record_id !== id));
//   };

//   const resetNewRecord = () => {
//     setNewRecord({
//       care_record_id: '',
//       date: '',
//       meal: '',
//       excretion: '',
//       bath: '',
//       temperature: null,
//       systolic_bp: null,
//       diastolic_bp: null,
//       comments: ''
//     });
//   };

//   const isFieldValid = (field: keyof CareRecord) => {
//     return !!newRecord[field] || field === 'temperature' && newRecord.temperature !== null ||
//            field === 'systolic_bp' && newRecord.systolic_bp !== null ||
//            field === 'diastolic_bp' && newRecord.diastolic_bp !== null;
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-semibold mb-4">介護記録管理</h2>
//       <div className="mb-6">
//         <div className="mb-4">
//           <input
//             type="date"
//             value={newRecord.date}
//             onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
//             className="border border-gray-300 p-2 w-full"
//           />
//           <label>
//             <input
//               type="checkbox"
//               checked={isFieldValid('date')}
//               readOnly
//               className="mr-2"
//             />
//             日付
//           </label>
//         </div>
//         <div className="mb-4">
//           <select
//             value={newRecord.meal}
//             onChange={(e) => setNewRecord({ ...newRecord, meal: e.target.value })}
//             className="border border-gray-300 p-2 w-full"
//           >
//             <option value="">食事：選択してください</option>
//             <option value="完食">完食</option>
//             <option value="ほとんど食べた">ほとんど食べた</option>
//             <option value="半分食べた">半分食べた</option>
//             <option value="少し食べた">少し食べた</option>
//             <option value="食べなかった">食べなかった</option>
//           </select>
//           <label>
//             <input
//               type="checkbox"
//               checked={isFieldValid('meal')}
//               readOnly
//               className="mr-2"
//             />
//             食事
//           </label>
//         </div>
//         <div className="mb-4">
//           <select
//             value={newRecord.excretion}
//             onChange={(e) => setNewRecord({ ...newRecord, excretion: e.target.value })}
//             className="border border-gray-300 p-2 w-full"
//           >
//             <option value="">排便：選択してください</option>
//             <option value="コロコロ">コロコロ</option>
//             <option value="硬便">硬便</option>
//             <option value="普通便">普通便</option>
//             <option value="軟便">軟便</option>
//             <option value="水様便">水様便</option>
//             <option value="なし">なし</option>
//           </select>
//           <label>
//             <input
//               type="checkbox"
//               checked={isFieldValid('excretion')}
//               readOnly
//               className="mr-2"
//             />
//             排便
//           </label>
//         </div>
//         <div className="mb-4">
//           <select
//             value={newRecord.bath}
//             onChange={(e) => setNewRecord({ ...newRecord, bath: e.target.value })}
//             className="border border-gray-300 p-2 w-full"
//           >
//             <option value="">入浴：選択してください</option>
//             <option value="入浴">入浴</option>
//             <option value="シャワー">シャワー</option>
//             <option value="体を拭く">体を拭く</option>
//             <option value="なし">なし</option>
//           </select>
//           <label>
//             <input
//               type="checkbox"
//               checked={isFieldValid('bath')}
//               readOnly
//               className="mr-2"
//             />
//             入浴
//           </label>
//         </div>
//         <div className="mb-4">
//           <input
//             type="number"
//             placeholder="体温 (℃)"
//             value={newRecord.temperature || ''}
//             onChange={(e) => setNewRecord({ ...newRecord, temperature: parseFloat(e.target.value) })}
//             className="border border-gray-300 p-2 w-full"
//           />
//           <label>
//             <input
//               type="checkbox"
//               checked={isFieldValid('temperature')}
//               readOnly
//               className="mr-2"
//             />
//             体温
//           </label>
//         </div>
//         <div className="mb-4">
//           <input
//             type="number"
//             placeholder="収縮期血圧 (mmHg)"
//             value={newRecord.systolic_bp || ''}
//             onChange={(e) => setNewRecord({ ...newRecord, systolic_bp: parseFloat(e.target.value) })}
//             className="border border-gray-300 p-2 w-full"
//           />
//           <label>
//             <input
//               type="checkbox"
//               checked={isFieldValid('systolic_bp')}
//               readOnly
//               className="mr-2"
//             />
//             収縮期血圧
//           </label>
//         </div>
//         <div className="mb-4">
//           <input
//             type="number"
//             placeholder="拡張期血圧 (mmHg)"
//             value={newRecord.diastolic_bp || ''}
//             onChange={(e) => setNewRecord({ ...newRecord, diastolic_bp: parseFloat(e.target.value) })}
//             className="border border-gray-300 p-2 w-full"
//           />
//           <label>
//             <input
//               type="checkbox"
//               checked={isFieldValid('diastolic_bp')}
//               readOnly
//               className="mr-2"
//             />
//             拡張期血圧
//           </label>
//         </div>
//         <div className="mb-4">
//           <textarea
//             placeholder="コメント"
//             value={newRecord.comments || ''}
//             onChange={(e) => setNewRecord({ ...newRecord, comments: e.target.value })}
//             className="border border-gray-300 p-2 w-full"
//           />
//           <label>
//             <input
//               type="checkbox"
//               checked={isFieldValid('comments')}
//               readOnly
//               className="mr-2"
//             />
//             コメント
//           </label>
//         </div>
//         <button
//           onClick={handleAddOrUpdateRecord}
//           className="bg-blue-500 text-white p-2 rounded"
//         >
//           {isEditing ? '更新' : '追加'}
//         </button>
//       </div>
//       <div>
//         <table className="min-w-full bg-white border border-gray-300">
//           <thead>
//             <tr>
//               <th className="border px-4 py-2">日付</th>
//               <th className="border px-4 py-2">食事</th>
//               <th className="border px-4 py-2">排便</th>
//               <th className="border px-4 py-2">入浴</th>
//               <th className="border px-4 py-2">体温</th>
//               <th className="border px-4 py-2">収縮期血圧</th>
//               <th className="border px-4 py-2">拡張期血圧</th>
//               <th className="border px-4 py-2">コメント</th>
//               <th className="border px-4 py-2">アクション</th>
//             </tr>
//           </thead>
//           <tbody>
//             {careRecords.map(record => (
//               <tr key={record.care_record_id}>
//                 <td className="border px-4 py-2">{record.date}</td>
//                 <td className="border px-4 py-2">{record.meal}</td>
//                 <td className="border px-4 py-2">{record.excretion}</td>
//                 <td className="border px-4 py-2">{record.bath}</td>
//                 <td className="border px-4 py-2">{record.temperature} ℃</td>
//                 <td className="border px-4 py-2">{record.systolic_bp} mmHg</td>
//                 <td className="border px-4 py-2">{record.diastolic_bp} mmHg</td>
//                 <td className="border px-4 py-2">{record.comments}</td>
//                 <td className="border px-4 py-2">
//                   <button
//                     onClick={() => handleEditRecord(record)}
//                     className="bg-yellow-500 text-white p-1 rounded mr-2"
//                   >
//                     編集
//                   </button>
//                   <button
//                     onClick={() => handleDeleteRecord(record.care_record_id)}
//                     className="bg-red-500 text-white p-1 rounded"
//                   >
//                     削除
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CareRecords;


"use client";
import React, { useState, ChangeEvent } from 'react';

type CareRecord = {
  care_record_id: string;
  date: string;
  meal: string;
  excretion: string;
  bath: string;
  temperature: number | null;
  systolic_bp: number | null;
  diastolic_bp: number | null;
  comments: string | null;
};

const CareRecords: React.FC = () => {
  const [careRecords, setCareRecords] = useState<CareRecord[]>([]);
  const [newRecord, setNewRecord] = useState<CareRecord>({
    care_record_id: '',
    date: '',
    meal: '',
    excretion: '',
    bath: '',
    temperature: null,
    systolic_bp: null,
    diastolic_bp: null,
    comments: ''
  });
  const [isEditing, setIsEditing] = useState(false); // 編集モードの状態

  const handleAddOrUpdateRecord = () => {
    if (validateRecord()) {
      if (isEditing) {
        setCareRecords(careRecords.map(record =>
          record.care_record_id === newRecord.care_record_id ? newRecord : record
        ));
        setIsEditing(false); // 編集モードを解除
      } else {
        setCareRecords([...careRecords, { ...newRecord, care_record_id: Date.now().toString() }]);
      }
      resetNewRecord();
    }
  };

  const validateRecord = () => {
    return newRecord.date !== '' &&
           newRecord.meal !== '' &&
           newRecord.excretion !== '' &&
           newRecord.bath !== '' &&
           newRecord.temperature !== null &&
           newRecord.systolic_bp !== null &&
           newRecord.diastolic_bp !== null &&
           newRecord.comments !== '';
  };

  const handleEditRecord = (record: CareRecord) => {
    setNewRecord(record);
    setIsEditing(true); // 編集モードを有効にする
  };

  const handleDeleteRecord = (id: string) => {
    setCareRecords(careRecords.filter(record => record.care_record_id !== id));
  };

  const resetNewRecord = () => {
    setNewRecord({
      care_record_id: '',
      date: '',
      meal: '',
      excretion: '',
      bath: '',
      temperature: null,
      systolic_bp: null,
      diastolic_bp: null,
      comments: ''
    });
  };

  const isFieldValid = (field: keyof CareRecord) => {
    return !!newRecord[field] || field === 'temperature' && newRecord.temperature !== null ||
           field === 'systolic_bp' && newRecord.systolic_bp !== null ||
           field === 'diastolic_bp' && newRecord.diastolic_bp !== null;
  };

  const handleTemperatureChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.length === 2 && !value.includes('.')) {
      value = value + '.';
    }
    setNewRecord({ ...newRecord, temperature: parseFloat(value) });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">介護記録管理</h2>
      <div className="mb-6">
        <div className="mb-4">
          <input
            type="date"
            value={newRecord.date}
            onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
            className="border border-gray-300 p-2 w-full"
          />
          <label>
            <input
              type="checkbox"
              checked={isFieldValid('date')}
              readOnly
              className="mr-2"
            />
            日付
          </label>
        </div>
        <div className="mb-4">
          <select
            value={newRecord.meal}
            onChange={(e) => setNewRecord({ ...newRecord, meal: e.target.value })}
            className="border border-gray-300 p-2 w-full"
          >
            <option value="">食事：選択してください</option>
            <option value="完食">完食</option>
            <option value="ほとんど食べた">ほとんど食べた</option>
            <option value="半分食べた">半分食べた</option>
            <option value="少し食べた">少し食べた</option>
            <option value="食べなかった">食べなかった</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={isFieldValid('meal')}
              readOnly
              className="mr-2"
            />
            食事
          </label>
        </div>
        <div className="mb-4">
          <select
            value={newRecord.excretion}
            onChange={(e) => setNewRecord({ ...newRecord, excretion: e.target.value })}
            className="border border-gray-300 p-2 w-full"
          >
            <option value="">排便：選択してください</option>
            <option value="コロコロ">コロコロ</option>
            <option value="硬便">硬便</option>
            <option value="普通便">普通便</option>
            <option value="軟便">軟便</option>
            <option value="水様便">水様便</option>
            <option value="なし">なし</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={isFieldValid('excretion')}
              readOnly
              className="mr-2"
            />
            排便
          </label>
        </div>
        <div className="mb-4">
          <select
            value={newRecord.bath}
            onChange={(e) => setNewRecord({ ...newRecord, bath: e.target.value })}
            className="border border-gray-300 p-2 w-full"
          >
            <option value="">入浴：選択してください</option>
            <option value="入浴">入浴</option>
            <option value="シャワー">シャワー</option>
            <option value="体を拭く">体を拭く</option>
            <option value="なし">なし</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={isFieldValid('bath')}
              readOnly
              className="mr-2"
            />
            入浴
          </label>
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="体温 (℃)"
            value={newRecord.temperature || ''}
            onChange={handleTemperatureChange}
            className="border border-gray-300 p-2 w-full"
          />
          <label>
            <input
              type="checkbox"
              checked={isFieldValid('temperature')}
              readOnly
              className="mr-2"
            />
            体温
          </label>
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="収縮期血圧 (mmHg)"
            value={newRecord.systolic_bp || ''}
            onChange={(e) => setNewRecord({ ...newRecord, systolic_bp: parseFloat(e.target.value) })}
            className="border border-gray-300 p-2 w-full"
          />
          <label>
            <input
              type="checkbox"
              checked={isFieldValid('systolic_bp')}
              readOnly
              className="mr-2"
            />
            収縮期血圧
          </label>
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="拡張期血圧 (mmHg)"
            value={newRecord.diastolic_bp || ''}
            onChange={(e) => setNewRecord({ ...newRecord, diastolic_bp: parseFloat(e.target.value) })}
            className="border border-gray-300 p-2 w-full"
          />
          <label>
            <input
              type="checkbox"
              checked={isFieldValid('diastolic_bp')}
              readOnly
              className="mr-2"
            />
            拡張期血圧
          </label>
        </div>
        <div className="mb-4">
          <textarea
            placeholder="コメント"
            value={newRecord.comments || ''}
            onChange={(e) => setNewRecord({ ...newRecord, comments: e.target.value })}
            className="border border-gray-300 p-2 w-full"
          />
          <label>
            <input
              type="checkbox"
              checked={isFieldValid('comments')}
              readOnly
              className="mr-2"
            />
            コメント
          </label>
        </div>
        <button
          onClick={handleAddOrUpdateRecord}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {isEditing ? '更新' : '追加'}
        </button>
      </div>
      <div>
        {careRecords.length > 0 && (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">日付</th>
                <th className="py-2">食事</th>
                <th className="py-2">排便</th>
                <th className="py-2">入浴</th>
                <th className="py-2">体温</th>
                <th className="py-2">収縮期血圧</th>
                <th className="py-2">拡張期血圧</th>
                <th className="py-2">コメント</th>
                <th className="py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {careRecords.map((record) => (
                <tr key={record.care_record_id}>
                  <td className="py-2">{record.date}</td>
                  <td className="py-2">{record.meal}</td>
                  <td className="py-2">{record.excretion}</td>
                  <td className="py-2">{record.bath}</td>
                  <td className="py-2">{record.temperature}</td>
                  <td className="py-2">{record.systolic_bp}</td>
                  <td className="py-2">{record.diastolic_bp}</td>
                  <td className="py-2">{record.comments}</td>
                  <td className="py-2">
                    <button
                      onClick={() => handleEditRecord(record)}
                      className="bg-yellow-500 text-white p-2 rounded mr-2"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDeleteRecord(record.care_record_id)}
                      className="bg-red-500 text-white p-2 rounded"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CareRecords;
