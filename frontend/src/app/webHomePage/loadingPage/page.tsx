'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LoadingPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // 4秒後に詳細ページにリダイレクト
    const timer = setTimeout(() => {
      router.push('/webHomePage/details');
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#F7FAFC',
      flexDirection: 'column'
    }}>
      <img 
        src="/images/fav_icon.png" 
        alt="App Icon" 
        style={{ width: '70px', height: '70px', animation: 'fadeIn 1s ease-in-out' }} 
      />
      <h1 style={{
        marginTop: '20px',
        fontSize: '50px',
        color: '#023059',
        opacity: 0,
        animation: 'fadeInText 1.5s ease-in-out 1s forwards' 
      }}>
        CareBridge
      </h1>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInText {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;

