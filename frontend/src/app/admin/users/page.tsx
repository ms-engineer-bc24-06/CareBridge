"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

// ユーザーの型定義
interface User {
  uuid: string;  // ユーザーのUUID
  user_id: string;  // ユーザーID
  user_name: string;  // ユーザー名
  user_name_kana: string;  // ユーザー名のカナ表記
  user_sex: string;  // 性別
  user_birthday: string;  // 生年月日
  emergency_contact_name: string;  // 緊急連絡先の名前
  emergency_contact_phone: string;  // 緊急連絡先の電話番号
  emergency_contact_relationship: string;  // 緊急連絡先との関係
}

const UsersManagement: React.FC = () => {
  // 状態を管理するためのフック
  const [searchTerm, setSearchTerm] = useState<string>('');  // 検索用の入力値
  const [users, setUsers] = useState<User[]>([]);  // 取得したユーザーのリスト
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);  // フィルタリングされたユーザーリスト
  const [newUser, setNewUser] = useState<User>({  // 新規ユーザーのためのオブジェクト
    uuid: '', 
    user_id: '',
    user_name: '',
    user_name_kana: '',
    user_sex: '',
    user_birthday: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
  });
  const [editUser, setEditUser] = useState<User | null>(null);  // 編集対象のユーザーオブジェクト
  const [showAddForm, setShowAddForm] = useState<boolean>(false);  // 新規ユーザー追加フォームの表示/非表示を管理
  const [selectedUser, setSelectedUser] = useState<User | null>(null);  // 詳細表示するために選択されたユーザー

  // コンポーネントの初回レンダリング時にユーザーを取得
  useEffect(() => {
    fetchUsers();
  }, []);

  // 検索用の入力値が変更されたときにユーザーリストをフィルタリング
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredUsers(users);  // 検索ワードが空の場合は全ユーザーを表示
    } else {
      setFilteredUsers(
        users.filter(user =>
          user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.user_name_kana.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, users]);

  // APIからユーザーを取得する関数
  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>('http://localhost:8000/api/users/');
      setUsers(response.data);  // 取得したデータをstateに保存
      setFilteredUsers(response.data);  // フィルタリング用にも保存
    } catch (error) {
      console.error("ユーザーの取得中にエラーが発生しました", error);
    }
  };

  // 新しいユーザーを追加する関数
  const handleAddUser = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/users/', newUser);
      setUsers([...users, response.data]);  // 新規ユーザーをリストに追加
      setFilteredUsers([...users, response.data]);  // フィルタリング用リストにも追加
      setNewUser({  // フォームのフィールドをリセット
        uuid: '',
        user_id: '',
        user_name: '',
        user_name_kana: '',
        user_sex: '',
        user_birthday: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        emergency_contact_relationship: '',
      });
      setShowAddForm(false);  // フォームを閉じる
    } catch (error) {
      console.error("ユーザーの追加中にエラーが発生しました", error);
    }
  };

  // 編集するユーザーを選択する関数
  const handleEditUser = (userId: string) => {
    const userToEdit = users.find(user => user.user_id === userId);
    if (userToEdit) {
      setEditUser(userToEdit);  // 編集対象のユーザーをstateに保存
    }
  };

  // ユーザーを削除する関数
  const handleDeleteUser = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/users/${userId}/`);
      setUsers(users.filter(user => user.user_id !== userId));  // 削除されたユーザーをリストから除外
      setFilteredUsers(users.filter(user => user.user_id !== userId));  // フィルタリング用リストも更新
    } catch (error) {
      console.error("ユーザーの削除中にエラーが発生しました", error);
    }
  };

  // ユーザー情報を更新する関数
  const handleUpdateUser = async () => {
    if (editUser) {
      try {
        const response = await axios.put(`http://localhost:8000/api/users/${editUser.uuid}/`, editUser);
        setUsers(users.map(user => (user.uuid === editUser.uuid ? response.data : user)));  // 更新されたユーザー情報をリストに反映
        setFilteredUsers(users.map(user => (user.uuid === editUser.uuid ? response.data : user)));  // フィルタリング用リストも更新
        setEditUser(null);  // 編集モードを終了
      } catch (error) {
        console.error("ユーザーの更新中にエラーが発生しました", error);
      }
    }
  };

  // フィールドが適切に入力されているかチェックする関数
  const isFieldComplete = (value: string) => value !== '';

  // 全てのフィールドが入力されているかをチェックする関数
  const isFormComplete = (user: User) => Object.values(user).every(isFieldComplete);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">利用者管理</h1>
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
              利用者ID:
              <input
                type="text"
                value={editUser.user_id}  // 編集中のユーザーIDを表示
                onChange={(e) => setEditUser({ ...editUser, user_id: e.target.value })}  // 入力値を反映
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(editUser.user_id)} readOnly />
            </label>
            <label className="block mb-2">
              利用者名:
              <input
                type="text"
                value={editUser.user_name}  // 編集中のユーザー名を表示
                onChange={(e) => setEditUser({ ...editUser, user_name: e.target.value })}  // 入力値を反映
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(editUser.user_name)} readOnly />
            </label>
            <label className="block mb-2">
              ふりがな:
              <input
                type="text"
                value={editUser.user_name_kana}  // 編集中のユーザー名のカナ表記を表示
                onChange={(e) => setEditUser({ ...editUser, user_name_kana: e.target.value })}  // 入力値を反映
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(editUser.user_name_kana)} readOnly />
            </label>
            <label className="block mb-2">
              性別:
              <input
                type="text"
                value={editUser.user_sex}  // 編集中のユーザー性別を表示
                onChange={(e) => setEditUser({ ...editUser, user_sex: e.target.value })}  // 入力値を反映
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(editUser.user_sex)} readOnly />
            </label>
            <label className="block mb-2">
              生年月日:
              <input
                type="date"
                value={editUser.user_birthday}  // 編集中のユーザー生年月日を表示
                onChange={(e) => setEditUser({ ...editUser, user_birthday: e.target.value })}  // 入力値を反映
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(editUser.user_birthday)} readOnly />
            </label>
            <label className="block mb-2">
              緊急連絡者名:
              <input
                type="text"
                value={editUser.emergency_contact_name}  // 編集中の緊急連絡先名を表示
                onChange={(e) => setEditUser({ ...editUser, emergency_contact_name: e.target.value })}  // 入力値を反映
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(editUser.emergency_contact_name)} readOnly />
            </label>
            <label className="block mb-2">
              緊急連絡者のふりがな:
              <input
                type="text"
                value={editUser.user_name_kana}  // 編集中の緊急連絡者名のカナ表記を表示
                onChange={(e) => setEditUser({ ...editUser, user_name_kana: e.target.value })}  // 入力値を反映
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(editUser.user_name_kana)} readOnly />
            </label>
            <label className="block mb-2">
              緊急連絡者との関係:
              <input
                type="text"
                value={editUser.emergency_contact_relationship}  // 編集中の緊急連絡者との関係を表示
                onChange={(e) => setEditUser({ ...editUser, emergency_contact_relationship: e.target.value })}  // 入力値を反映
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(editUser.emergency_contact_relationship)} readOnly />
            </label>
            <label className="block mb-2">
              緊急連絡先電話番号:
              <input
                type="text"
                value={editUser.emergency_contact_phone}  // 編集中の緊急連絡先電話番号を表示
                onChange={(e) => setEditUser({ ...editUser, emergency_contact_phone: e.target.value })}  // 入力値を反映
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(editUser.emergency_contact_phone)} readOnly />
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
              利用者ID:
              <input
                type="text"
                value={newUser.user_id}  // 新規ユーザーIDを表示
                onChange={(e) => setNewUser({ ...newUser, user_id: e.target.value })}  // 入力値を反映
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(newUser.user_id)} readOnly />
            </label>
            <label className="block mb-2">
              利用者名:
              <input
                type="text"
                value={newUser.user_name}  // 新規ユーザー名を表示
                onChange={(e) => setNewUser({ ...newUser, user_name: e.target.value })}  // 入力値を反映
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(newUser.user_name)} readOnly />
            </label>
            <label className="block mb-2">
              ふりがな:
              <input
                type="text"
                value={newUser.user_name_kana}  // 新規ユーザー名のカナ表記を表示
                onChange={(e) => setNewUser({ ...newUser, user_name_kana: e.target.value })}  // 入力値を反映
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(newUser.user_name_kana)} readOnly />
            </label>
            <label className="block mb-2">
              性別:
              <input
                type="text"
                value={newUser.user_sex}  // 新規ユーザー性別を表示
                onChange={(e) => setNewUser({ ...newUser, user_sex: e.target.value })}  // 入力値を反映
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(newUser.user_sex)} readOnly />
            </label>
            <label className="block mb-2">
              生年月日:
              <input
                type="date"
                value={newUser.user_birthday}  // 新規ユーザー生年月日を表示
                onChange={(e) => setNewUser({ ...newUser, user_birthday: e.target.value })}  // 入力値を反映
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(newUser.user_birthday)} readOnly />
            </label>
            <label className="block mb-2">
              緊急連絡者名:
              <input
                type="text"
                value={newUser.emergency_contact_name}  // 新規緊急連絡先名を表示
                onChange={(e) => setNewUser({ ...newUser, emergency_contact_name: e.target.value })}  // 入力値を反映
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(newUser.emergency_contact_name)} readOnly />
            </label>
            <label className="block mb-2">
              緊急連絡者のふりがな:
              <input
                type="text"
                value={newUser.user_name_kana}  // 新規緊急連絡者名のカナ表記を表示
                onChange={(e) => setNewUser({ ...newUser, user_name_kana: e.target.value })}  // 入力値を反映
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(newUser.user_name_kana)} readOnly />
            </label>
            <label className="block mb-2">
              緊急連絡者との関係:
              <input
                type="text"
                value={newUser.emergency_contact_relationship}  // 新規緊急連絡者との関係を表示
                onChange={(e) => setNewUser({ ...newUser, emergency_contact_relationship: e.target.value })}  // 入力値を反映
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(newUser.emergency_contact_relationship)} readOnly />
            </label>
            <label className="block mb-2">
              緊急連絡先電話番号:
              <input
                type="text"
                value={newUser.emergency_contact_phone}  // 新規緊急連絡先電話番号を表示
                onChange={(e) => setNewUser({ ...newUser, emergency_contact_phone: e.target.value })}  // 入力値を反映
                className="border p-2 rounded w-full"
              />
              <input type="checkbox" checked={isFieldComplete(newUser.emergency_contact_phone)} readOnly />
            </label>
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                onClick={handleAddUser}  // ユーザー追加処理を実行
                className={`bg-green-500 text-white px-4 py-2 rounded ${!isFormComplete(newUser) ? 'opacity-50 cursor-not-allowed' : ''}`}  // フォームが未完了の場合はボタンを無効化
                disabled={!isFormComplete(newUser)}
              >
                追加
              </button>
              <button onClick={() => setShowAddForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded">キャンセル</button>
            </div>
          </div>
        </div>
      )}

      {/* 選択されたユーザーの詳細表示 */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl h-full overflow-auto">
            <h2 className="text-3xl mb-4">利用者詳細</h2>
            <p className="text-xl"><strong>利用者ID:</strong> {selectedUser.user_id}</p>
            <p className="text-xl"><strong>名前:</strong> {selectedUser.user_name} ({selectedUser.user_name_kana})</p>
            <p className="text-xl"><strong>性別:</strong> {selectedUser.user_sex}</p>
            <p className="text-xl"><strong>生年月日:</strong> {selectedUser.user_birthday}</p>
            <p className="text-xl"><strong>緊急連絡者:</strong> {selectedUser.emergency_contact_name} ({selectedUser.emergency_contact_name})</p>
            <p className="text-xl"><strong>緊急連絡者との関係:</strong> {selectedUser.emergency_contact_relationship}</p>
            <p className="text-xl"><strong>緊急連絡電話番号:</strong> {selectedUser.emergency_contact_phone}</p>
            <button onClick={() => setSelectedUser(null)} className="bg-gray-500 text-white px-4 py-2 rounded mt-4">閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;

