"use client";
import React, { useState } from 'react';

type FamilyShare = {
  id: string;
  date: string;
  infoType: string;
  details: string;
};

const ContactNotes: React.FC = () => {
  const [shares, setShares] = useState<FamilyShare[]>([]);
  const [newShare, setNewShare] = useState<FamilyShare>({ id: '', date: '', infoType: '', details: '' });

  const handleAddShare = () => {
    setShares([...shares, { ...newShare, id: Date.now().toString() }]);
    setNewShare({ id: '', date: '', infoType: '', details: '' });
  };

  const handleDeleteShare = (id: string) => {
    setShares(shares.filter(share => share.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">ご家族様からの情報管理</h2>
      <div className="mb-6">
        <input
          type="date"
          value={newShare.date}
          onChange={(e) => setNewShare({ ...newShare, date: e.target.value })}
          className="border border-gray-300 p-2 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="情報タイプ"
          value={newShare.infoType}
          onChange={(e) => setNewShare({ ...newShare, infoType: e.target.value })}
          className="border border-gray-300 p-2 mb-2 w-full"
        />
        <textarea
          placeholder="詳細"
          value={newShare.details}
          onChange={(e) => setNewShare({ ...newShare, details: e.target.value })}
          className="border border-gray-300 p-2 mb-2 w-full"
        />
        <button onClick={handleAddShare} className="bg-blue-500 text-white p-2 rounded">追加</button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">日付</th>
            <th className="border border-gray-300 p-2">情報タイプ</th>
            <th className="border border-gray-300 p-2">詳細</th>
            <th className="border border-gray-300 p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {shares.map((share) => (
            <tr key={share.id}>
              <td className="border border-gray-300 p-2">{share.date}</td>
              <td className="border border-gray-300 p-2">{share.infoType}</td>
              <td className="border border-gray-300 p-2">{share.details}</td>
              <td className="border border-gray-300 p-2">
                <button onClick={() => handleDeleteShare(share.id)} className="text-red-500">削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactNotes;
