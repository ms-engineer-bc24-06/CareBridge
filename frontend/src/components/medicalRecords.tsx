"use client";
import React, { useState, useEffect } from 'react';

// データ型の定義
type Note = {
  id: string;
  title: string;
  content: string;
  date: string;
};

const MedicalRecords: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newNote, setNewNote] = useState<Note>({ id: '', title: '', content: '', date: '' });

  // ダミーデータのロードと表示
  useEffect(() => {
    const fetchNotes = async () => {
      // ダミーデータ
      const dummyData: Note[] = [
        { id: '1', title: '初回訪問', content: '初めての訪問をしました。', date: '2023-07-01' },
        { id: '2', title: '次回訪問', content: '次回訪問は来週です。', date: '2023-07-08' },
      ];
      setNotes(dummyData);
      setLoading(false);
    };

    fetchNotes();
  }, []);

  const handleAddNote = () => {
    const newNoteWithId = { ...newNote, id: Date.now().toString() };
    setNotes([...notes, newNoteWithId]);
    setNewNote({ id: '', title: '', content: '', date: '' });
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">連絡事項管理</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">新しい連絡事項の追加</h2>

        <input
          type="date"
          value={newNote.date}
          onChange={(e) => setNewNote({ ...newNote, date: e.target.value })}
          className="border border-gray-300 p-2 mb-2 w-full"
        />
        
        <input
          type="text"
          placeholder="タイトル"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          className="border border-gray-300 p-2 mb-2 w-full"
        />
        <textarea
          placeholder="内容"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          className="border border-gray-300 p-2 mb-2 w-full"
        />

        <button onClick={handleAddNote} className="bg-blue-500 text-white p-2 rounded">追加</button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">日付</th>
            <th className="border border-gray-300 p-2">タイトル</th>
            <th className="border border-gray-300 p-2">内容</th>
            <th className="border border-gray-300 p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr key={note.id}>
              <td className="border border-gray-300 p-2">{note.date}</td>
              <td className="border border-gray-300 p-2">{note.title}</td>
              <td className="border border-gray-300 p-2">{note.content}</td>
              <td className="border border-gray-300 p-2">
                <button onClick={() => handleDeleteNote(note.id)} className="text-red-500">削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicalRecords;

