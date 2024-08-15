"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebaseConfig";

interface Staff {
  id?: number;  
  user_id: string; // メールアドレスのフィールド
  password_hash: string;  
  facility: number;  
  staff_name: string;  
  is_admin: boolean;  
}

const StaffsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');  
  const [staffs, setStaffs] = useState<Staff[]>([]);  
  const [filteredStaffs, setFilteredStaffs] = useState<Staff[]>([]);  
  const [newStaff, setNewStaff] = useState<Staff>({  
    user_id: '',  // 初期値を設定
    password_hash: '',
    facility: 1,
    staff_name: '',
    is_admin: false
  });
  const [editStaff, setEditStaff] = useState<Staff | null>(null);  
  const [showAddForm, setShowAddForm] = useState<boolean>(false);  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});  

  useEffect(() => {
    fetchStaffs();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredStaffs(staffs);
    } else {
      setFilteredStaffs(
        staffs.filter(staff =>
          staff.staff_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, staffs]);

  const fetchStaffs = async () => {
    try {
      const response = await axios.get<Staff[]>('http://localhost:8000/api/staffs/');
      setStaffs(response.data);  
      setFilteredStaffs(response.data);  
    } catch (error) {
      console.error("職員の取得中にエラーが発生しました", error);
    }
  };

  const handleAddStaff = async () => {
    const validationErrors = validateForm(newStaff);
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    try {
        const email = newStaff.user_id; // メールアドレスをそのまま使用
        const password = newStaff.password_hash; // Firebase用にパスワードを取得

        // Firebaseにユーザーを作成
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Firebaseに新しいユーザーが作成されました:", userCredential.user);

        // Firebaseにユーザーが作成されたら、バックエンドにもスタッフ情報を保存
        const response = await axios.post('http://localhost:8000/api/staffs/', newStaff);
        setStaffs([...staffs, response.data]);  
        setFilteredStaffs([...staffs, response.data]);  
        setNewStaff({
            user_id: '',
            password_hash: '',
            facility: 1,
            staff_name: '',
            is_admin: false
        });
        setShowAddForm(false);  
        setErrors({});
    } catch (error) {
        console.error("職員の追加中にエラーが発生しました", error);
        setErrors({ firebase: "Firebaseユーザーの作成に失敗しました" });
    }
  };

  const handleEditStaff = (id: number) => {
    const staffToEdit = staffs.find(staff => staff.id === id);
    if (staffToEdit) {
      setEditStaff(staffToEdit);  
    }
  };

  const handleDeleteStaff = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/staffs/${id}/`);
      setStaffs(staffs.filter(staff => staff.id !== id));  
      setFilteredStaffs(staffs.filter(staff => staff.id !== id));  
    } catch (error) {
      console.error("職員の削除中にエラーが発生しました", error);
    }
  };

  const handleUpdateStaff = async () => {
    const validationErrors = validateForm(editStaff!);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8000/api/staffs/${editStaff!.id}/`, editStaff!);
      setStaffs(staffs.map(staff => (staff.id === editStaff!.id ? response.data : staff)));  
      setFilteredStaffs(staffs.map(staff => (staff.id === editStaff!.id ? response.data : staff))); 
      setEditStaff(null);  
      setErrors({});
    } catch (error) {
      console.error("職員の更新中にエラーが発生しました", error);
    }
  };

  const validateForm = (staff: Staff) => {
    const newErrors: { [key: string]: string } = {};
    if (!staff.staff_name) newErrors.staff_name = '入力必須項目です';
    if (!staff.user_id) newErrors.user_id = '入力必須項目です';
    if (!staff.password_hash && !editStaff) newErrors.password_hash = '入力必須項目です';
    if (staff.password_hash.length < 6) newErrors.password_hash = 'パスワードは6文字以上である必要があります';
    return newErrors;
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
      <h1 className="text-2xl font-bold mb-6">職員管理</h1>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <input
            type="text"
            placeholder="名前で検索"
            value={searchTerm}  
            onChange={(e) => setSearchTerm(e.target.value)}  
            className="border p-2 rounded mr-2"
          />
          <button onClick={() => setSearchTerm('')} className="bg-secondary text-white px-4 py-2 rounded">クリア</button>
        </div>
        <button onClick={() => { setShowAddForm(true); setErrors({}); }} className="bg-green-500 text-white px-4 py-2 rounded">+ 追加</button>
      </div>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">職員ID</th>
            <th className="py-2 px-4 border-b">職員名</th>
            <th className="py-2 px-4 border-b">管理者権限</th>
            <th className="py-2 px-4 border-b">操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaffs.map(staff => (
            <tr key={staff.id}>
              <td className="py-2 px-4 border-b">{staff.id}</td>
              <td className="py-2 px-4 border-b">{staff.staff_name}</td>
              <td className="py-2 px-4 border-b">
                <input
                  type="checkbox"
                  checked={staff.is_admin}  
                  readOnly
                  className="h-4 w-4"
                />
              </td>
              <td className="py-2 px-4 border-b flex space-x-2">
                <button onClick={() => handleEditStaff(staff.id as number)} className="bg-yellow-500 text-white px-4 py-2 rounded">編集</button>
                <button onClick={() => handleDeleteStaff(staff.id as number)} className="bg-red-500 text-white px-4 py-2 rounded">削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 職員情報の編集フォーム */}
      {editStaff && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
            <h2 className="text-2xl mb-4">職員情報を編集</h2>
            <label className="block mb-2">
              名前{renderRequiredLabel()}:
              <input
                type="text"
                value={editStaff.staff_name}
                onChange={(e) => setEditStaff({ ...editStaff, staff_name: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {renderErrorMessage("staff_name")}
            </label>
            <label className="block mb-2">
              管理者権限:
              <input
                type="checkbox"
                checked={editStaff.is_admin}
                onChange={(e) => setEditStaff({ ...editStaff, is_admin: e.target.checked })}
                className="h-4 w-4"
              />
            </label>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={handleUpdateStaff} className="bg-blue-500 text-white px-4 py-2 rounded">更新</button>
              <button onClick={() => setEditStaff(null)} className="bg-gray-500 text-white px-4 py-2 rounded">キャンセル</button>
            </div>
          </div>
        </div>
      )}

      {/* 新規職員追加フォーム */}
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
            <h2 className="text-2xl mb-4">新規職員追加</h2>
            <label className="block mb-2">
              名前{renderRequiredLabel()}:
              <input
                type="text"
                value={newStaff.staff_name}
                onChange={(e) => setNewStaff({ ...newStaff, staff_name: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {renderErrorMessage("staff_name")}
            </label>
            <label className="block mb-2">
              メールアドレス{renderRequiredLabel()}:
              <input
                type="email"
                value={newStaff.user_id}
                onChange={(e) => setNewStaff({ ...newStaff, user_id: e.target.value })}
                className="border p-2 rounded w-full"
              />
              {renderErrorMessage("user_id")}
            </label>
            <label className="block mb-2">
              パスワード{renderRequiredLabel()}:
              <input
                type="password"
                value={newStaff.password_hash}
                onChange={(e) => setNewStaff({ ...newStaff, password_hash: e.target.value })}
                className="border p-2 rounded w-full"
                minLength={6} // HTMLのバリデーションも追加
                required
              />
              {renderErrorMessage("password_hash")}
              <small className="text-gray-500">6文字以上のパスワードを入力してください</small>
            </label>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={handleAddStaff} className="bg-green-500 text-white px-4 py-2 rounded">追加</button>
              <button onClick={() => setShowAddForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded">キャンセル</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffsManagement;
