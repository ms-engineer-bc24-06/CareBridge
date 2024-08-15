'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface User {
  uuid: string;
  user_id: string;
  user_name: string;
  user_name_kana: string;
  user_sex: string;
  user_birthday: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  allergies: string | null;
  medications: string | null;
  medical_history: string | null;
}

const UsersManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [users, setUsers] = useState<User[]>([]); 
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); 
  const [newUser, setNewUser] = useState<User>({
    uuid: '', 
    user_id: '',
    user_name: '',
    user_name_kana: '',
    user_sex: '',
    user_birthday: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    allergies: null,
    medications: null,
    medical_history: null,
  });
  const [editUser, setEditUser] = useState<User | null>(null);  
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); 

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredUsers(users);  
    } else {
      setFilteredUsers(
        users.filter(user =>
          user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.user_name_kana.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>('http://localhost:8000/api/users/');
      setUsers(response.data);  
      setFilteredUsers(response.data);  
    } catch (error) {
      console.error("ユーザーの取得中にエラーが発生しました", error);
    }
  };

  const handleAddUser = async () => {
    const validationErrors = validateForm(newUser);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/users/', newUser);
      setUsers([...users, response.data]); 
      setFilteredUsers([...users, response.data]); 
      setNewUser({
        uuid: '',
        user_id: '',
        user_name: '',
        user_name_kana: '',
        user_sex: '',
        user_birthday: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        emergency_contact_relationship: '',
        allergies: null,
        medications: null,
        medical_history: null,
      });
      setShowAddForm(false); 
      setErrors({});
    } catch (error) {
      console.error("ユーザーの追加中にエラーが発生しました", error);
    }
  };

  const validateForm = (user: User) => {
    const newErrors: { [key: string]: string } = {};

    if (!user.user_id) newErrors.user_id = '必須項目です';
    if (!user.user_name) newErrors.user_name = '必須項目です';
    if (!user.user_name_kana) newErrors.user_name_kana = '必須項目です';
    if (!user.user_sex) newErrors.user_sex = '必須項目です';
    if (!user.user_birthday) newErrors.user_birthday = '必須項目です';
    if (!user.emergency_contact_name) newErrors.emergency_contact_name = '必須項目です';
    if (!user.emergency_contact_phone) newErrors.emergency_contact_phone = '必須項目です';
    if (!user.emergency_contact_relationship) newErrors.emergency_contact_relationship = '必須項目です';

    return newErrors;
  };

  const handleEditUser = (userId: string) => {
    const userToEdit = users.find(user => user.user_id === userId);
    if (userToEdit) {
      setEditUser(userToEdit);  
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/users/${userId}/`);
      setUsers(users.filter(user => user.user_id !== userId));  
      setFilteredUsers(users.filter(user => user.user_id !== userId));  
    } catch (error) {
      console.error("ユーザーの削除中にエラーが発生しました", error);
    }
  };

  const handleUpdateUser = async () => {
    const validationErrors = validateForm(editUser!);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8000/api/users/${editUser!.uuid}/`, editUser!);
      setUsers(users.map(user => (user.uuid === editUser!.uuid ? response.data : user)));  
      setFilteredUsers(users.map(user => (user.uuid === editUser!.uuid ? response.data : user))); 
      setEditUser(null);  
      setErrors({});
    } catch (error) {
      console.error("ユーザーの更新中にエラーが発生しました", error);
    }
  };

  const handlePhoneInput = (
    e: React.ChangeEvent<HTMLInputElement>, 
    user: User, 
    setUser: React.Dispatch<React.SetStateAction<User>>
  ) => {
    const formattedPhone = e.target.value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    setUser({ ...user, emergency_contact_phone: formattedPhone });
  };

  const renderRequiredLabel = () => (
    <span style={{ color: 'red' }}>*</span>
  );

  const renderErrorMessage = (fieldName: string) => {
    if (errors[fieldName]) {
      return <span style={{ color: 'red' }}>{errors[fieldName]}</span>;
    }
    return null;
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">利用者管理</h1>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <input
            type="text"
            placeholder="名前で検索"
            value={searchTerm}
            onChange={(e) => handlePhoneInput(e, newUser, (user) => setNewUser(user!))}
            className="border p-2 rounded mr-2"
          />
          <button onClick={() => setSearchTerm('')} className="bg-secondary text-white px-4 py-2 rounded">クリア</button>
        </div>
        <button onClick={() => { setShowAddForm(true); setErrors({}); }} className="bg-green-500 text-white px-4 py-2 rounded">+ 追加</button>
      </div>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">利用者ID</th>
            <th className="py-2 px-4 border-b">利用者名</th>
            <th className="py-2 px-4 border-b">ふりがな</th>
            <th className="py-2 px-4 border-b">操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.uuid}>
              <td className="py-2 px-4 border-b">{user.user_id}</td>
              <td className="py-2 px-4 border-b">
                <Link href={`/admin/users/${user.uuid}`} className="text-blue-800 underline">{user.user_name}</Link>
              </td>
              <td className="py-2 px-4 border-b">{user.user_name_kana}</td>
              <td className="py-2 px-4 border-b flex space-x-2">
                <button onClick={() => handleEditUser(user.user_id)} className="bg-yellow-500 text-white px-4 py-2 rounded">編集</button>
                <button onClick={() => handleDeleteUser(user.user_id)} className="bg-red-500 text-white px-4 py-2 rounded">削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 編集フォーム */}
      {editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl h-full overflow-auto">
            <h2 className="text-2xl mb-4">利用者情報を編集</h2>
            <label className="block mb-2">
              利用者ID{renderRequiredLabel()}:
              <input
                type="text"
                value={editUser.user_id}
                onChange={(e) => setEditUser(prev => prev ? { ...prev, user_id: e.target.value } : null)}
                className="border p-2 rounded w-full"
                placeholder="例: 123456"
              />
              {renderErrorMessage("user_id")}
            </label>
            <label className="block mb-2">
              利用者名{renderRequiredLabel()}:
              <input
                type="text"
                value={editUser.user_name}
                onChange={(e) => setEditUser(prev => prev ? { ...prev, user_name: e.target.value } : null)}
                className="border p-2 rounded w-full"
                placeholder="例: 山田 太郎"
              />
              {renderErrorMessage("user_name")}
            </label>
            <label className="block mb-2">
              ふりがな{renderRequiredLabel()}:
              <input
                type="text"
                value={editUser.user_name_kana}
                onChange={(e) => setEditUser(prev => prev ? { ...prev, user_name_kana: e.target.value } : null)}
                className="border p-2 rounded w-full"
                placeholder="例: やまだ たろう"
              />
              {renderErrorMessage("user_name_kana")}
            </label>
            <label className="block mb-2">
              性別{renderRequiredLabel()}:
              <div className="flex space-x-4">
                <label>
                  <input
                    type="radio"
                    value="男性"
                    checked={editUser.user_sex === '男性'}
                    onChange={(e) => setEditUser(prev => prev ? { ...prev, user_sex: e.target.value } : null)}
                    className="mr-2"
                  />
                  男性
                </label>
                <label>
                  <input
                    type="radio"
                    value="女性"
                    checked={editUser.user_sex === '女性'}
                    onChange={(e) => setEditUser(prev => prev ? { ...prev, user_sex: e.target.value } : null)}
                    className="mr-2"
                  />
                  女性
                </label>
              </div>
              {renderErrorMessage("user_sex")}
            </label>
            <label className="block mb-2">
              生年月日{renderRequiredLabel()}:
              <input
                type="date"
                value={editUser.user_birthday}
                onChange={(e) => setEditUser(prev => prev ? { ...prev, user_birthday: e.target.value } : null)}
                className="border p-2 rounded w-full"
              />
              {renderErrorMessage("user_birthday")}
            </label>
            <label className="block mb-2">
              緊急連絡者名{renderRequiredLabel()}:
              <input
                type="text"
                value={editUser.emergency_contact_name}
                onChange={(e) => setEditUser(prev => prev ? { ...prev, emergency_contact_name: e.target.value } : null)}
                className="border p-2 rounded w-full"
                placeholder="例: 田中 花子"
              />
              {renderErrorMessage("emergency_contact_name")}
            </label>
            <label className="block mb-2">
              緊急連絡者との関係{renderRequiredLabel()}:
              <input
                type="text"
                value={editUser.emergency_contact_relationship}
                onChange={(e) => setEditUser(prev => prev ? { ...prev, emergency_contact_relationship: e.target.value } : null)}
                className="border p-2 rounded w-full"
                placeholder="例: 母"
              />
              {renderErrorMessage("emergency_contact_relationship")}
            </label>
            <label className="block mb-2">
              緊急連絡先電話番号{renderRequiredLabel()}:
              <input
                type="text"
                value={editUser.emergency_contact_phone}
                onChange={(e) => handlePhoneInput(e, editUser, setEditUser)}
                className="border p-2 rounded w-full"
                placeholder="例: 090-1234-5678"
              />
              {renderErrorMessage("emergency_contact_phone")}
            </label>
            <label className="block mb-2">
              アレルギー:
              <input
                type="text"
                value={editUser.allergies ?? ''}
                onChange={(e) => setEditUser(prev => prev ? { ...prev, allergies: e.target.value } : null)}
                className="border p-2 rounded w-full"
                placeholder="例: ピーナッツ"
              />
            </label>
            <label className="block mb-2">
              服用中の薬:
              <input
                type="text"
                value={editUser.medications ?? ''}
                onChange={(e) => setEditUser(prev => prev ? { ...prev, medications: e.target.value } : null)}
                className="border p-2 rounded w-full"
                placeholder="例: アスピリン"
              />
            </label>
            <label className="block mb-2">
              既往症:
              <input
                type="text"
                value={editUser.medical_history ?? ''}
                onChange={(e) => setEditUser(prev => prev ? { ...prev, medical_history: e.target.value } : null)}
                className="border p-2 rounded w-full"
                placeholder="例: 高血圧"
              />
            </label>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={handleUpdateUser} className="bg-blue-500 text-white px-4 py-2 rounded">更新</button>
              <button onClick={() => setEditUser(null)} className="bg-gray-500 text-white px-4 py-2 rounded">キャンセル</button>
            </div>
          </div>
        </div>
      )}

      {/* 新規ユーザー追加フォーム */}
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl h-full overflow-auto">
            <h2 className="text-2xl mb-4">新規利用者追加</h2>
            <label className="block mb-2">
              利用者名{renderRequiredLabel()}:
              <input
                type="text"
                value={newUser.user_name}
                onChange={(e) => setNewUser({ ...newUser, user_name: e.target.value })}
                className="border p-2 rounded w-full"
                placeholder="例: 山田 太郎"
              />
              {renderErrorMessage("user_name")}
            </label>
            <label className="block mb-2">
              ふりがな{renderRequiredLabel()}:
              <input
                type="text"
                value={newUser.user_name_kana}
                onChange={(e) => setNewUser({ ...newUser, user_name_kana: e.target.value })}
                className="border p-2 rounded w-full"
                placeholder="例: やまだ たろう"
              />
              {renderErrorMessage("user_name_kana")}
            </label>
            <label className="block mb-2">
              性別{renderRequiredLabel()}:
              <div className="flex space-x-4">
                <label>
                  <input
                    type="radio"
                    value="男性"
                    checked={newUser.user_sex === '男性'}
                    onChange={(e) => setNewUser({ ...newUser, user_sex: e.target.value })}
                    className="mr-2"
                  />
                  男性
                </label>
                <label>
                  <input
                    type="radio"
                    value="女性"
                    checked={newUser.user_sex === '女性'}
                    onChange={(e) => setNewUser({ ...newUser, user_sex: e.target.value })}
                    className="mr-2"
                  />
                  女性
                </label>
              </div>
              {renderErrorMessage("user_sex")}
            </label>
            <label className="block mb-2">
              生年月日{renderRequiredLabel()}:
              <input
                type="date"
                value={newUser.user_birthday}
                onChange={(e) => setNewUser({ ...newUser, user_birthday: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {renderErrorMessage("user_birthday")}
            </label>
            <label className="block mb-2">
              緊急連絡者名{renderRequiredLabel()}:
              <input
                type="text"
                value={newUser.emergency_contact_name}
                onChange={(e) => setNewUser({ ...newUser, emergency_contact_name: e.target.value })}
                className="border p-2 rounded w-full"
                placeholder="例: 田中 花子"
              />
              {renderErrorMessage("emergency_contact_name")}
            </label>
            <label className="block mb-2">
              緊急連絡者との関係{renderRequiredLabel()}:
              <input
                type="text"
                value={newUser.emergency_contact_relationship}
                onChange={(e) => setNewUser({ ...newUser, emergency_contact_relationship: e.target.value })}
                className="border p-2 rounded w-full"
                placeholder="例: 母"
              />
              {renderErrorMessage("emergency_contact_relationship")}
            </label>
            <label className="block mb-2">
              緊急連絡先電話番号{renderRequiredLabel()}:
              <input
                type="text"
                value={newUser.emergency_contact_phone}
                onChange={(e) => handlePhoneInput(e, newUser, setNewUser)}
                className="border p-2 rounded w-full"
                placeholder="例: 090-1234-5678"
              />
              {renderErrorMessage("emergency_contact_phone")}
            </label>
            <label className="block mb-2">
              アレルギー:
              <input
                type="text"
                value={newUser.allergies ?? ''}
                onChange={(e) => setNewUser({ ...newUser, allergies: e.target.value })}
                className="border p-2 rounded w-full"
                placeholder="例: ピーナッツ"
              />
            </label>
            <label className="block mb-2">
              服用中の薬:
              <input
                type="text"
                value={newUser.medications ?? ''}
                onChange={(e) => setNewUser({ ...newUser, medications: e.target.value })}
                className="border p-2 rounded w-full"
                placeholder="例: アスピリン"
              />
            </label>
            <label className="block mb-2">
              既往症:
              <input
                type="text"
                value={newUser.medical_history ?? ''}
                onChange={(e) => setNewUser({ ...newUser, medical_history: e.target.value })}
                className="border p-2 rounded w-full"
                placeholder="例: 高血圧"
              />
            </label>
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                onClick={handleAddUser}
                className={`bg-green-500 text-white px-4 py-2 rounded ${!Object.keys(errors).length ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={Object.keys(errors).length > 0}
              >
                追加
              </button>
              <button onClick={() => setShowAddForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded">キャンセル</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;


