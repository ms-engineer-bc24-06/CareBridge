// フロントエンドで職員の情報を収集し、その情報をバックエンド（Django）に送信し、バックエンドがFirebase Admin SDKを使用してFirebaseに新しいユーザーを作成する
// APIキーやその他の認証情報はサーバー側で安全に管理されます。セキュリティが向上します。
"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Staff {
  id?: number;  
  user_id: string;
  password: string;
  facility: number;  
  staff_name: string;  
  is_admin: boolean;  
}

// CSRFトークンを取得する関数
const getCsrfToken = (): string | null => {
  const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
  return csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : null;
};

// 必須項目ラベルの表示関数
const renderRequiredLabel = () => (
  <span style={{ color: 'red' }}>*</span>
);

const StaffsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');  
  const [staffs, setStaffs] = useState<Staff[]>([]);  
  const [filteredStaffs, setFilteredStaffs] = useState<Staff[]>([]);  
  const [newStaff, setNewStaff] = useState<Staff>({
    user_id: '',
    password: '',
    facility: 1,
    staff_name: '',
    is_admin: false
  });
  
  const [confirmPassword, setConfirmPassword] = useState<string>(''); 
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false); 
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

  // 職員データをサーバーから取得
  const fetchStaffs = async () => {
    try {
      const response = await axios.get<Staff[]>('http://localhost:8000/api/staffs/');
      setStaffs(response.data);  
      setFilteredStaffs(response.data);  
    } catch (error) {
      console.error("職員の取得中にエラーが発生しました", error);
    }
  };

  // 職員を追加する処理
  const handleAddStaff = async () => {
    const validationErrors = validateForm(newStaff);
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    try {
        // 送信するデータをログに出力して確認
        console.log('Sending data:', {
            display_name: newStaff.staff_name,
            email: newStaff.user_id,
            password: newStaff.password,
            is_admin: newStaff.is_admin  // この部分が重要
        });

        const csrfToken = getCsrfToken(); 
        const response = await axios.post('http://localhost:8000/firebaseManagement/create_staff_user/', {
            display_name: newStaff.staff_name,
            email: newStaff.user_id,
            password: newStaff.password,
            is_admin: newStaff.is_admin  // ここでis_adminをバックエンドに送信
        }, {
            headers: {
                'X-CSRFToken': csrfToken || ''
            }
        });

        if (response.status === 200) {
            console.log("職員が作成されました:", response.data);
            setStaffs([...staffs, response.data]);
            setFilteredStaffs([...staffs, response.data]);
            setNewStaff({
                user_id: '',
                password: '',
                facility: 1,
                staff_name: '',
                is_admin: false
            });
            setConfirmPassword(''); 
            setShowAddForm(false);
            setErrors({});
        } else {
            console.error("サーバーでの職員作成に失敗しました", response.data);
        }
    } catch (error) {
        console.error("サーバーでの職員作成に失敗しました", error);
        setErrors({ api: "職員の作成に失敗しました。" });
    }
  };

  // 職員を編集する処理
  const handleEditStaff = (id: number) => {
    const staffToEdit = staffs.find(staff => staff.id === id);
    if (staffToEdit) {
      setEditStaff(staffToEdit);  
    }
  };

    // 職員を削除する処理
  const handleDeleteStaff = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/staffs/${id}/`);
      setStaffs(staffs.filter(staff => staff.id !== id));  
      setFilteredStaffs(staffs.filter(staff => staff.id !== id));  
    } catch (error) {
      console.error("職員の削除中にエラーが発生しました", error);
    }
  };

  // 職員情報を更新する処理
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

  // パスワードの表示/非表示を切り替える処理
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  // フォームのバリデーションを行う処理
  const validateForm = (staff: Staff) => {
    const newErrors: { [key: string]: string } = {};
    if (!staff.staff_name) newErrors.staff_name = '入力必須項目です';
    if (!staff.user_id) newErrors.user_id = '入力必須項目です';
    if (!staff.password && !editStaff) newErrors.password = '入力必須項目です';
    if (staff.password.length < 6) newErrors.password = 'パスワードは6文字以上である必要があります';
    if (staff.password !== confirmPassword) newErrors.confirmPassword = 'パスワードが一致しません';
    return newErrors;
  };
  // エラーメッセージを表示する処理
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
            <th className="py-2 px-4 border-b">アクション</th>
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
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  className="border p-2 rounded w-full"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-2"
                >
                  {passwordVisible ? "隠す" : "表示"}
                </button>
              </div>
              {renderErrorMessage("password")}
              <small className="text-gray-500">6文字以上のパスワードを入力してください</small>
            </label>
            <label className="block mb-2">
              パスワードの確認{renderRequiredLabel()}:
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border p-2 rounded w-full"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-2"
                >
                  {passwordVisible ? "隠す" : "表示"}
                </button>
              </div>
              {renderErrorMessage("confirmPassword")}
            </label>
            <label className="block mb-2">
              管理者権限:
                <input
                  type="checkbox"
                  checked={newStaff.is_admin}
                  onChange={(e) => setNewStaff({ ...newStaff, is_admin: e.target.checked })}
                  className="h-4 w-4"
                />
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
