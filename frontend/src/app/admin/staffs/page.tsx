"use client";
import React, { useState } from 'react';

interface User {
  userId: string;
  name: string;
  furigana: string; // ふりがなを追加
  gender: string;
  birthdate: string;
  address: string;
  isAdmin: boolean;
}

const StaffsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [users, setUsers] = useState<User[]>([
    // ダミーデータ
    { userId: 'U001', name: '山田太郎', furigana: 'やまだたろう', gender: '男', birthdate: '1980-01-01', address: '東京都', isAdmin: true },
    { userId: 'U002', name: '鈴木花子', furigana: 'すずきはなこ', gender: '女', birthdate: '1990-05-05', address: '大阪府', isAdmin: false },
  ]);
  const [newUser, setNewUser] = useState<User>({ userId: '', name: '', furigana: '', gender: '', birthdate: '', address: '', isAdmin: false });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

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
    setNewUser({ userId: '', name: '', furigana: '', gender: '', birthdate: '', address: '', isAdmin: false });
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">職員管理</h1>
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
            <th className="py-2 px-4 border-b">職員ID</th>
            <th className="py-2 px-4 border-b">職員名</th>
            <th className="py-2 px-4 border-b">ふりがな</th> {/* ふりがな列を追加 */}
            <th className="py-2 px-4 border-b">性別</th>
            <th className="py-2 px-4 border-b">生年月日</th>
            <th className="py-2 px-4 border-b">住所</th>
            <th className="py-2 px-4 border-b">管理者権限</th>
            <th className="py-2 px-4 border-b">操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.userId}>
              <td className="py-2 px-4 border-b">{user.userId}</td>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.furigana}</td> {/* ふりがな列 */}
              <td className="py-2 px-4 border-b">{user.gender}</td>
              <td className="py-2 px-4 border-b">{user.birthdate}</td>
              <td className="py-2 px-4 border-b">{user.address}</td>
              <td className="py-2 px-4 border-b">{user.isAdmin ? '✔️' : ''}</td>
              <td className="py-2 px-4 border-b flex space-x-2">
                <button onClick={() => handleEditUser(user.userId)} className="bg-yellow-500 text-white px-4 py-2 rounded">編集</button>
                <button onClick={() => handleDeleteUser(user.userId)} className="bg-red-500 text-white px-4 py-2 rounded">削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
            <h2 className="text-2xl mb-4">職員情報を編集</h2>
            <label className="block mb-2">
              ユーザーID:
              <input
                type="text"
                value={editUser.userId}
                onChange={(e) => setEditUser({ ...editUser, userId: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(editUser.userId)} readOnly />
            </label>
            <label className="block mb-2">
              名前:
              <input
                type="text"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(editUser.name)} readOnly />
            </label>
            <label className="block mb-2">
              ふりがな:
              <input
                type="text"
                value={editUser.furigana}
                onChange={(e) => setEditUser({ ...editUser, furigana: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(editUser.furigana)} readOnly />
            </label>
            <label className="block mb-2">
              性別:
              <select
                value={editUser.gender}
                onChange={(e) => setEditUser({ ...editUser, gender: e.target.value })}
                className="border p-2 rounded w-full"
              >
                <option value="">選択してください</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
              <input type="checkbox" checked={isFieldComplete(editUser.gender)} readOnly />
            </label>
            <label className="block mb-2">
              生年月日:
              <input
                type="date"
                value={editUser.birthdate}
                onChange={(e) => setEditUser({ ...editUser, birthdate: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(editUser.birthdate)} readOnly />
            </label>
            <label className="block mb-2">
              住所:
              <input
                type="text"
                value={editUser.address}
                onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(editUser.address)} readOnly />
            </label>
            <label className="block mb-2">
              管理者権限:
              <input
                type="checkbox"
                checked={editUser.isAdmin}
                onChange={(e) => setEditUser({ ...editUser, isAdmin: e.target.checked })}
                className="border p-2 rounded"
              />
              <input type="checkbox" checked={editUser.isAdmin} readOnly />
            </label>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={handleUpdateUser} className="bg-blue-500 text-white px-4 py-2 rounded">更新</button>
              <button onClick={() => setEditUser(null)} className="bg-gray-500 text-white px-4 py-2 rounded">キャンセル</button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
            <h2 className="text-2xl mb-4">新規職員追加</h2>
            <label className="block mb-2">
              職員ID:
              <input
                type="text"
                value={newUser.userId}
                onChange={(e) => setNewUser({ ...newUser, userId: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(newUser.userId)} readOnly />
            </label>
            <label className="block mb-2">
              名前:
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(newUser.name)} readOnly />
            </label>
            <label className="block mb-2">
              ふりがな:
              <input
                type="text"
                value={newUser.furigana}
                onChange={(e) => setNewUser({ ...newUser, furigana: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(newUser.furigana)} readOnly />
            </label>
            <label className="block mb-2">
              性別:
              <select
                value={newUser.gender}
                onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
                className="border p-2 rounded w-full"
              >
                <option value="">選択してください</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
              <input type="checkbox" checked={isFieldComplete(newUser.gender)} readOnly />
            </label>
            <label className="block mb-2">
              生年月日:
              <input
                type="date"
                value={newUser.birthdate}
                onChange={(e) => setNewUser({ ...newUser, birthdate: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(newUser.birthdate)} readOnly />
            </label>
            <label className="block mb-2">
              住所:
              <input
                type="text"
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(newUser.address)} readOnly />
            </label>
            <label className="block mb-2">
              管理者権限:
              <input
                type="checkbox"
                checked={newUser.isAdmin}
                onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                className="border p-2 rounded"
              />
              <input type="checkbox" checked={newUser.isAdmin} readOnly />
            </label>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={handleAddUser} className="bg-green-500 text-white px-4 py-2 rounded">追加</button>
              <button onClick={() => setShowAddForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded">キャンセル</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffsManagement;

