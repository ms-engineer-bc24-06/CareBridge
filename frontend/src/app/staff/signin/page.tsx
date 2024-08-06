
// "use client";
// import React, { useState } from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../../../lib/firebaseConfig";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// const SignInPage: React.FC = () => {
//   const router = useRouter();
//   const [userId, setUserId] = useState<string>(""); // emailからuserIdに変更
//   const [password, setPassword] = useState<string>("");
//   const [error, setError] = useState<string>("");

//   const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const email = `${userId}@example.com`; // ユーザーIDをメールアドレス形式に変換

//     try {
//       console.log("Attempting sign in with email:", email);
//       await signInWithEmailAndPassword(auth, email, password);
//       console.log("Sign in successful, redirecting to /dashboard");
//       router.push("/staff/dashboard"); // 修正: "/dashbord" から "/dashboard" へ
//     } catch (error) {
//       setError("ログインできませんでした。ユーザーIDとパスワードを確認してください。");
//     }
//   };

//   return (
//     <div className="text-center" style={{ backgroundColor: "white", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
//       <h1 className="text-3xl mb-12">ログイン</h1>
//       <form onSubmit={handleSignIn} className="w-[300px] mx-auto">
//         <div className="mb-4">
//           <label htmlFor="userId" className="block text-gray-700 text-lg mb-1">ユーザーID</label>
//           <input
//             type="text"
//             id="userId" // email から userId に変更
//             className="w-full border border-gray-300 p-3 rounded-lg text-lg"
//             value={userId} // email から userId に変更
//             onChange={(e) => setUserId(e.target.value)} // email から userId に変更
//             required
//             placeholder="ユーザーIDを入力してください"
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="password" className="block text-gray-700 text-lg mb-1">パスワード</label>
//           <input
//             type="password"
//             id="password"
//             className="w-full border border-gray-300 p-3 rounded-lg text-lg"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             placeholder="パスワードを入力してください"
//           />
//         </div>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         <button type="submit" className="px-6 py-3 border border-gray-700 text-lg rounded-xl bg-gray-200 hover:bg-gray-300">ログイン</button>
//       </form>
//       <div className="mt-6">
//         <Link href="/reset-password" className="text-blue-500 hover:underline">
//           パスワードをお忘れの方はこちら
//         </Link>
//       </div>
//       <div className="mt-4">
//         <Link href="/privacy-policy" className="text-blue-500 hover:underline">
//           carebridge プライバシーポリシー
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default SignInPage;

"use client";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignInPage: React.FC = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string>(""); // emailからuserIdに変更
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = `${userId}@example.com`; // ユーザーIDをメールアドレス形式に変換

    try {
      console.log("Attempting sign in with email:", email);
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign in successful, redirecting to /dashboard");
      router.push("/staff/dashboard"); 
    } catch (error) {
      setError("ログインできませんでした。ユーザーIDとパスワードを確認してください。");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: 'url(/background.png)' }} // 背景画像を設定
    >
      <h1 className="text-4xl mb-12">ログイン</h1>
      <form onSubmit={handleSignIn} className="w-96 bg-white p-8 rounded-lg shadow-lg"> {/* w-96でフォームの幅を広げる */}
        <div className="mb-6">
          <label htmlFor="userId" className="block text-gray-700 text-xl mb-2">ユーザーID</label>
          <input
            type="text"
            id="userId"
            className="w-full border border-gray-300 p-4 rounded-lg text-xl"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            placeholder="ユーザーIDを入力してください"
          />
          <small className="text-gray-500">例: 123456</small>
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-xl mb-2">パスワード</label>
          <input
            type="password"
            id="password"
            className="w-full border border-gray-300 p-4 rounded-lg text-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="パスワードを入力してください"
          />
          <small className="text-gray-500">6文字以上のパスワードを入力してください</small>
        </div>
        {error && <p className="text-red-500 mb-6">{error}</p>}
        <button type="submit" className="w-full px-8 py-4 text-xl text-white bg-blue-500 rounded-xl hover:bg-blue-600">ログイン</button>
      </form>
      <div className="mt-6">
        <Link href="/reset-password" className="text-blue-500 hover:underline">
          パスワードをお忘れの方はこちら
        </Link>
      </div>
      <div className="mt-4">
        <Link href="/privacy-policy" className="text-blue-500 hover:underline">
          carebridge プライバシーポリシー
        </Link>
      </div>
    </div>
  );
};

export default SignInPage;




