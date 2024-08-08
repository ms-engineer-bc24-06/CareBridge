"use client";
import React, { useState } from 'react';

interface User {
  userId: string;
  name: string;
  furigana: string;
  gender: string;
  birthdate: string;
  address: string;
  emergencyContact: string;
  emergencyContactFurigana: string;
  relationship: string;
  emergencyContactPhone: string;
}

const UsersManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [users, setUsers] = useState<User[]>([
    // ダミーデータ
    { userId: 'U001', name: '山田太郎', furigana: 'やまだたろう', gender: '男', birthdate: '1980-01-01', address: '東京都', emergencyContact: '田中一郎', emergencyContactFurigana: 'たなかいちろう', relationship: '友人', emergencyContactPhone: '090-1234-5678' },
    { userId: 'U002', name: '鈴木花子', furigana: 'すずきはなこ', gender: '女', birthdate: '1990-05-05', address: '大阪府', emergencyContact: '佐藤次郎', emergencyContactFurigana: 'さとうじろう', relationship: '兄弟', emergencyContactPhone: '090-8765-4321' },
  ]);
  const [newUser, setNewUser] = useState<User>({ userId: '', name: '', furigana: '', gender: '', birthdate: '', address: '', emergencyContact: '', emergencyContactFurigana: '', relationship: '', emergencyContactPhone: '' });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSearch = () => {
    // 検索ロジック（例: フィルタリング）
    const filteredUsers = users.filter(user => user.name.includes(searchTerm) || user.furigana.includes(searchTerm));
    setUsers(filteredUsers);
  };

  const handleAddUser = () => {
    // すべての入力項目が埋まっているかチェック
    if (Object.values(newUser).some(value => value === '')) {
      alert('すべての入力項目を埋めてください');
      return;
    }
    // ユーザー追加ロジック
    setUsers([...users, newUser]);
    setNewUser({ userId: '', name: '', furigana: '', gender: '', birthdate: '', address: '', emergencyContact: '', emergencyContactFurigana: '', relationship: '', emergencyContactPhone: '' });
    setShowAddForm(false);
  };

  const handleEditUser = (userId: string) => {
    // 編集対象のユーザーをセット
    const userToEdit = users.find(user => user.userId === userId);
    if (userToEdit) {
      setEditUser(userToEdit);
    }
  };

  const handleDeleteUser = (userId: string) => {
    // 削除ロジック
    setUsers(users.filter(user => user.userId !== userId));
  };

  const handleUpdateUser = () => {
    // すべての入力項目が埋まっているかチェック
    if (editUser && Object.values(editUser).some(value => value === '')) {
      alert('すべての入力項目を埋めてください');
      return;
    }
    // 更新ロジック
    if (editUser) {
      setUsers(users.map(user => (user.userId === editUser.userId ? editUser : user)));
      setEditUser(null);
    }
  };

  const isFieldComplete = (value: string) => {
    return value !== '';
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">利用者管理</h1>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <input
            type="text"
            placeholder="名前で検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded mr-2"
          />
          <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">検索</button>
        </div>
        <button onClick={() => setShowAddForm(true)} className="bg-green-500 text-white px-4 py-2 rounded">+ 追加</button>
      </div>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ユーザーID</th>
            <th className="py-2 px-4 border-b">利用者名</th>
            <th className="py-2 px-4 border-b">ふりがな</th>
            <th className="py-2 px-4 border-b">操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.userId}>
              <td className="py-2 px-4 border-b">{user.userId}</td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => handleSelectUser(user)} className="text-blue-500 underline">{user.name}</button>
              </td>
              <td className="py-2 px-4 border-b">{user.furigana}</td>
              <td className="py-2 px-4 border-b flex space-x-2">
                <button onClick={() => handleEditUser(user.userId)} className="bg-yellow-500 text-white px-4 py-2 rounded">編集</button>
                <button onClick={() => handleDeleteUser(user.userId)} className="bg-red-500 text-white px-4 py-2 rounded">削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl h-full overflow-auto">
            <h2 className="text-2xl mb-4">利用者情報を編集</h2>
            <label className="block mb-2">
              ユーザーID:
              <input
                type="text"
                value={editUser.userId}
                onChange={(e) => setEditUser({ ...editUser, userId: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {isFieldComplete(editUser.userId) && <span className="text-green-500">✔️</span>}
            </label>
            <label className="block mb-2">
              名前:
              <input
                type="text"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {isFieldComplete(editUser.name) && <span className="text-green-500">✔️</span>}
            </label>
            <label className="block mb-2">
              ふりがな:
              <input
                type="text"
                value={editUser.furigana}
                onChange={(e) => setEditUser({ ...editUser, furigana: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {isFieldComplete(editUser.furigana) && <span className="text-green-500">✔️</span>}
            </label>
            <label className="block mb-2">
              性別:
              <input
                type="text"
                value={editUser.gender}
                onChange={(e) => setEditUser({ ...editUser, gender: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {isFieldComplete(editUser.gender) && <span className="text-green-500">✔️</span>}
            </label>
            <label className="block mb-2">
              生年月日:
              <input
                type="date"
                value={editUser.birthdate}
                onChange={(e) => setEditUser({ ...editUser, birthdate: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {isFieldComplete(editUser.birthdate) && <span className="text-green-500">✔️</span>}
            </label>
            <label className="block mb-2">
              住所:
              <input
                type="text"
                value={editUser.address}
                onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {isFieldComplete(editUser.address) && <span className="text-green-500">✔️</span>}
            </label>
            <label className="block mb-2">
              緊急連絡先:
              <input
                type="text"
                value={editUser.emergencyContact}
                onChange={(e) => setEditUser({ ...editUser, emergencyContact: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {isFieldComplete(editUser.emergencyContact) && <span className="text-green-500">✔️</span>}
            </label>
            <label className="block mb-2">
              緊急連絡者の方のふりがな:
              <input
                type="text"
                value={editUser.emergencyContactFurigana}
                onChange={(e) => setEditUser({ ...editUser, emergencyContactFurigana: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {isFieldComplete(editUser.emergencyContactFurigana) && <span className="text-green-500">✔️</span>}
            </label>
            <label className="block mb-2">
              緊急連絡者の方の続柄:
              <input
                type="text"
                value={editUser.relationship}
                onChange={(e) => setEditUser({ ...editUser, relationship: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {isFieldComplete(editUser.relationship) && <span className="text-green-500">✔️</span>}
            </label>
            <label className="block mb-2">
              緊急連絡先の電話番号:
              <input
                type="text"
                value={editUser.emergencyContactPhone}
                onChange={(e) => setEditUser({ ...editUser, emergencyContactPhone: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {isFieldComplete(editUser.emergencyContactPhone) && <span className="text-green-500">✔️</span>}
            </label>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={handleUpdateUser} className="bg-blue-500 text-white px-4 py-2 rounded">更新</button>
              <button onClick={() => setEditUser(null)} className="bg-gray-500 text-white px-4 py-2 rounded">キャンセル</button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl h-full overflow-auto">
            <h2 className="text-2xl mb-4">新規利用者追加</h2>
            <label className="block mb-2">
              ユーザーID:
              <input
                type="text"
                value={newUser.userId}
                onChange={(e) => setNewUser({ ...newUser, userId: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {isFieldComplete(newUser.userId) && <span className="text-green-500">✔️</span>}
            </label>
            <label className="block mb-2">
              名前:
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {isFieldComplete(newUser.name) && <span className="text-green-500">✔️</span>}
            </label>
            <label className="block mb-2">
              ふりがな:
              <input
                type="text"
                value={newUser.furigana}
                onChange={(e) => setNewUser({ ...newUser, furigana: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {isFieldComplete(newUser.furigana) && <span className="text-green-500">✔️</span>}
            </label>
            <label className="block mb-2">
              性別:
              <input
                type="text"
                value={newUser.gender}
                onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {isFieldComplete(newUser.gender) && <span className="text-green-500">✔️</span>}
            </label>
            <label className="block mb-2">
              生年月日:
              <input
                type="date"
                value={newUser.birthdate}
                onChange={(e) => setNewUser({ ...newUser, birthdate: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {isFieldComplete(newUser.birthdate) && <span className="text-green-500">✔️</span>}
            </label>
            <label className="block mb-2">
              住所:
              <input
                type="text"
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {isFieldComplete(newUser.address) && <span className="text-green-500">✔️</span>}
            </label>
            <label className="block mb-2">
              緊急連絡先:
              <input
                type="text"
                value={newUser.emergencyContact}
                onChange={(e) => setNewUser({ ...newUser, emergencyContact: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {isFieldComplete(newUser.emergencyContact) && <span className="text-green-500">✔️</span>}
            </label>
            <label className="block mb-2">
              緊急連絡先ふりがな:
              <input
                type="text"
                value={newUser.emergencyContactFurigana}
                onChange={(e) => setNewUser({ ...newUser, emergencyContactFurigana: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {isFieldComplete(newUser.emergencyContactFurigana) && <span className="text-green-500">✔️</span>}
            </label>
            <label className="block mb-2">
              続柄:
              <input
                type="text"
                value={newUser.relationship}
                onChange={(e) => setNewUser({ ...newUser, relationship: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {isFieldComplete(newUser.relationship) && <span className="text-green-500">✔️</span>}
            </label>
            <label className="block mb-2">
              緊急連絡先電話番号:
              <input
                type="text"
                value={newUser.emergencyContactPhone}
                onChange={(e) => setNewUser({ ...newUser, emergencyContactPhone: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {isFieldComplete(newUser.emergencyContactPhone) && <span className="text-green-500">✔️</span>}
            </label>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={handleAddUser} className="bg-green-500 text-white px-4 py-2 rounded">追加</button>
              <button onClick={() => setShowAddForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded">キャンセル</button>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl h-full overflow-auto">
            <h2 className="text-2xl mb-4">利用者詳細</h2>
            <p><strong>ユーザーID:</strong> {selectedUser.userId}</p>
            <p><strong>名前:</strong> {selectedUser.name} ({selectedUser.furigana})</p>
            <p><strong>性別:</strong> {selectedUser.gender}</p>
            <p><strong>生年月日:</strong> {selectedUser.birthdate}</p>
            <p><strong>住所:</strong> {selectedUser.address}</p>
            <p><strong>緊急連絡先:</strong> {selectedUser.emergencyContact} ({selectedUser.emergencyContactFurigana})</p>
            <p><strong>緊急連絡先の方の続柄:</strong> {selectedUser.relationship}</p>
            <p><strong>緊急連絡先の電話番号:</strong> {selectedUser.emergencyContactPhone}</p>
            <button onClick={() => setSelectedUser(null)} className="bg-gray-500 text-white px-4 py-2 rounded mt-4">閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;

