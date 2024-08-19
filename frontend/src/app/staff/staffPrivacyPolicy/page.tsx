import React from 'react';

const StaffPrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">CareBridge  介護職員の皆様へ プライバシーポリシー</h1>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">1. はじめに</h2>
      <p>
        このプライバシーポリシーは、CareBridgeアプリケーションがどのようにして職員の個人情報を収集・使用・保護するかを説明するものです。
        当アプリを利用することで、職員は本ポリシーに同意したものとみなされます。
      </p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">2. 収集する情報</h2>
      <p>CareBridgeアプリでは、以下の職員情報を収集します。</p>
      <ul className="list-disc list-inside">
        <li>職員情報: 名前、施設情報、職員ID。</li>
        <li>業務関連情報: ケア記録の入力、業務の進捗管理。</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">3. 情報の利用目的</h2>
      <p>収集した情報は、以下の目的で使用されます。</p>
      <ul className="list-disc list-inside">
        <li>業務の管理</li>
        <li>認証と権限管理</li>
        <li>ケア記録の管理と共有</li>
        <li>施設の運営管理</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">4. 情報の共有</h2>
      <p>CareBridgeアプリは、職員の個人情報を第三者と共有する場合がありますが、その際には以下の状況に限ります。</p>
      <ul className="list-disc list-inside">
        <li>サービス提供に必要な場合</li>
        <li>法的義務がある場合</li>
        <li>職員の同意がある場合</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">5. 情報の保護</h2>
      <p>
        CareBridgeは、職員の個人情報を保護するために、暗号化、アクセス制御、安全なデータベースの使用などの対策を講じます。
      </p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">6. 職員の権利</h2>
      <p>
        職員は、自分の個人情報にアクセスし、修正、削除を要求する権利を有しています。また、情報の使用停止を求めることもできます。
      </p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">7. クッキーの使用</h2>
      <p>
        CareBridgeアプリでは、職員体験の向上やアプリのパフォーマンス向上のためにクッキーを使用する場合があります。
      </p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">8. プライバシーポリシーの変更</h2>
      <p>
        本ポリシーは必要に応じて変更されることがあります。変更があった場合、職員にはアプリ内通知またはメールでお知らせします。
      </p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">9. お問い合わせ先</h2>
      <p>プライバシーポリシーに関するご質問やご不明点がございましたら、以下の連絡先までお問い合わせください。</p>
      <p>
        会社名: CareBridge<br />
        所在地: 東京都港区赤坂7-7-7 AmiHills-777<br />
        電話番号: 070-777-7777<br />
        URL: <a href="https://kaigosapuri.com/" className="text-blue-500 hover:underline">https://kaigosapuri.com/</a><br />
        代表取締役: ななこ
      </p>
    </div>
  );
};

export default StaffPrivacyPolicy;
