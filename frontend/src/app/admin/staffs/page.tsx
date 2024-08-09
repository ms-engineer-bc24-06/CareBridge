"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 職員データの型を定義
interface Staff {
  id?: number;  // 職員ID（省略可能）
  password_hash: string;  // パスワードのハッシュ
  facility: number;  // 所属施設のID
  staff_name: string;  // 職員名
  is_admin: boolean;  // 管理者権限フラグ
}

const StaffsManagement: React.FC = () => {
  // 状態を管理するためのフック
  const [searchTerm, setSearchTerm] = useState<string>('');  // 検索用の入力値
  const [staffs, setStaffs] = useState<Staff[]>([]);  // 取得した職員リスト
  const [filteredStaffs, setFilteredStaffs] = useState<Staff[]>([]);  // フィルタされた職員リスト
  const [newStaff, setNewStaff] = useState<Staff>({  // 新規追加用の職員データ
    password_hash: '',
    facility: 1,
    staff_name: '',
    is_admin: false
  });
  const [editStaff, setEditStaff] = useState<Staff | null>(null);  // 編集対象の職員データ
  const [showAddForm, setShowAddForm] = useState<boolean>(false);  // 新規追加フォームの表示状態

  // コンポーネントの初回レンダリング時に職員データを取得
  useEffect(() => {
    fetchStaffs();
  }, []);

  // 検索ワードが変更されたときに職員リストをフィルタリング
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

  // APIから職員データを取得する関数
  const fetchStaffs = async () => {
    try {
      const response = await axios.get<Staff[]>('http://localhost:8000/api/staffs/');
      setStaffs(response.data);  // 取得したデータをstateに保存
      setFilteredStaffs(response.data);  // フィルタリング用にも保存
    } catch (error) {
      console.error("職員の取得中にエラーが発生しました", error);
    }
  };

  // 新しい職員を追加する関数
  const handleAddStaff = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/staffs/', newStaff);
      setStaffs([...staffs, response.data]);  // 新規職員をリストに追加
      setFilteredStaffs([...staffs, response.data]);  // フィルタリング用リストも更新
      setNewStaff({
        password_hash: '',
        facility: 1,
        staff_name: '',
        is_admin: false
      });
      setShowAddForm(false);  // フォームを閉じる
    } catch (error) {
      console.error("職員の追加中にエラーが発生しました", error);
    }
  };

  // 編集する職員を選択する関数
  const handleEditStaff = (id: number) => {
    const staffToEdit = staffs.find(staff => staff.id === id);
    if (staffToEdit) {
      setEditStaff(staffToEdit);  // 編集対象の職員をstateに保存
    }
  };

  // 職員を削除する関数
  const handleDeleteStaff = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/staffs/${id}/`);
      setStaffs(staffs.filter(staff => staff.id !== id));  // 削除された職員をリストから除外
      setFilteredStaffs(staffs.filter(staff => staff.id !== id));  // フィルタリング用リストも更新
    } catch (error) {
      console.error("職員の削除中にエラーが発生しました", error);
    }
  };

  // 職員情報を更新する関数
  const handleUpdateStaff = async () => {
    if (editStaff) {
      try {
        const response = await axios.put(`http://localhost:8000/api/staffs/${editStaff.id}/`, editStaff);
        setStaffs(staffs.map(staff => (staff.id === editStaff.id ? response.data : staff)));  // 更新された職員情報をリストに反映
        setFilteredStaffs(staffs.map(staff => (staff.id === editStaff.id ? response.data : staff)));  // フィルタリング用リストも更新
        setEditStaff(null);  // 編集モードを終了
      } catch (error) {
        console.error("職員の更新中にエラーが発生しました", error);
      }
    }
  };

  // 入力フィールドが適切に入力されているかをチェックする関数
  const isFieldComplete = (value: string | number | boolean | undefined) => {
    return value !== '' && value !== null && value !== undefined;
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">職員管理</h1>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <input
            type="text"
            placeholder="名前で検索"
            value={searchTerm}  // 検索ワードをstateに保存
            onChange={(e) => setSearchTerm(e.target.value)}  // 検索ワードの変更を反映
            className="border p-2 rounded mr-2"
          />
          <button onClick={() => setSearchTerm('')} className="bg-secondary text-white px-4 py-2 rounded">クリア</button>
        </div>
        <button onClick={() => setShowAddForm(true)} className="bg-green-500 text-white px-4 py-2 rounded">+ 追加</button>
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
                  checked={staff.is_admin}  // 管理者権限を表示（変更不可）
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
              職員ID:
              <input
                type="text"
                value={editStaff.id ?? ''}  // 職員ID（変更不可）
                onChange={(e) => setEditStaff({ ...editStaff, id: parseInt(e.target.value) })}
                className="border p-2 rounded w-full"
                readOnly  // IDは編集できないようにする
              />
              <input type="checkbox" checked={isFieldComplete(editStaff.id)} readOnly />
            </label>
            <label className="block mb-2">
              名前:
              <input
                type="text"
                value={editStaff.staff_name}
                onChange={(e) => setEditStaff({ ...editStaff, staff_name: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(editStaff.staff_name)} readOnly />
            </label>
            <label className="block mb-2">
              管理者権限:
              <input
                type="checkbox"
                checked={editStaff.is_admin}
                onChange={(e) => setEditStaff({ ...editStaff, is_admin: e.target.checked })}
                className="h-4 w-4"
              />
              <input type="checkbox" checked={editStaff.is_admin} readOnly />
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
              職員ID:
              <input
                type="text"
                value={newStaff.id ?? ''}  // 職員IDの入力（省略可能）
                onChange={(e) => setNewStaff({ ...newStaff, id: parseInt(e.target.value) })}
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(newStaff.id)} readOnly />
            </label>
            <label className="block mb-2">
              名前:
              <input
                type="text"
                value={newStaff.staff_name}
                onChange={(e) => setNewStaff({ ...newStaff, staff_name: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(newStaff.staff_name)} readOnly />
            </label>
            <label className="block mb-2">
              管理者権限:
              <input
                type="checkbox"
                checked={newStaff.is_admin}
                onChange={(e) => setNewStaff({ ...newStaff, is_admin: e.target.checked })}
                className="h-4 w-4"
              />
              <input type="checkbox" checked={newStaff.is_admin} readOnly />
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

