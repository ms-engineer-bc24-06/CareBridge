// "use client";

// import React from "react";
// import SignInPage from "./staff/signin/page";

// const Home: React.FC = () => {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
//       {/* `SignInPage` コンポーネントを表示 */}
//       <SignInPage />
//     </main>
//   );
// };

// export default Home;
// src/app/page.tsx
"use client";

import React from "react";
import Link from "next/link";

const Home: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <Link href="/staff/signin">
        <a className="text-blue-500 underline">Go to Sign In Page</a>
      </Link>
    </main>
  );
};

export default Home;




