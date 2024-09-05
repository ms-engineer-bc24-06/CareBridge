'use client';
import React from 'react';
import WebPageHeader from '../../../components/WebPageHeader'; 
import WebHomePageMenuBar from '../../../components/webHomePageMenuBar'; 
import { useRouter } from 'next/navigation';

const Details: React.FC = () => {
  const router = useRouter(); 

  const handleContactClick = (): void => {
    router.push('/webHomePage/contact'); 
  };

  return (
    <div>
      <WebPageHeader /> 
      <WebHomePageMenuBar /> 
      
      <div
        style={{
          backgroundImage: "url('/images/homepage_background_staff.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          color: '#023059', 
          textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8)', 
          display: 'flex',
          alignItems: 'flex-start', 
          justifyContent: 'flex-end', 
          paddingRight: '3rem', 
          paddingTop: '2rem',
        }}
      >
        <div
          style={{
            padding: '3rem',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '10px',
            maxWidth: '50%',
            textAlign: 'left',
            animation: 'fadeInBox 1s ease-in-out forwards',
          }}
        >
          <h1 style={{ 
            fontSize: '2.8rem', 
            fontWeight: '700', 
            color: '#023059', 
            lineHeight: '1.3', 
            letterSpacing: '0.05em',
            opacity: 0, 
            animation: 'fadeInText 1s ease-in-out forwards',
            animationDelay: '1s'
          }}>
            - CareBridge -
          </h1>
          <h2 style={{ 
            fontSize: '2.0rem', 
            fontWeight: '600', 
            color: '#023059', 
            lineHeight: '1.3', 
            letterSpacing: '0.03em', 
            marginBottom: '2rem',
            opacity: 0, 
            animation: 'fadeInText 1.5s ease-in-out forwards',
            animationDelay: '1.5s'
          }}>
            介護現場と家族をつなぐ新しい架け橋
          </h2>
          <p style={{ 
            fontSize: '1.2rem', 
            fontWeight: '400', 
            color: '#023059', 
            lineHeight: '1.5', 
            letterSpacing: '0.02em', 
            marginBottom: '1.5rem',
            opacity: 0, 
            animation: 'fadeInText 2s ease-in-out forwards',
            animationDelay: '2s'
          }}>
            高齢化が進む中で、利用者の増加と介護人材の不足が顕著になっています。
          </p>
          <p style={{ 
            fontSize: '1.2rem', 
            fontWeight: '400', 
            color: '#023059', 
            lineHeight: '1.5', 
            letterSpacing: '0.02em', 
            marginBottom: '1.5rem',
            opacity: 0, 
            animation: 'fadeInText 2.5s ease-in-out forwards',
            animationDelay: '2.5s'
          }}> 
            この状況に対応するため、職員の負担を軽減し、家族との円滑な情報共有を実現するアプリを開発しました。
          </p>
          <p style={{ 
            fontSize: '1.2rem', 
            fontWeight: '400', 
            color: '#023059', 
            lineHeight: '1.5', 
            letterSpacing: '0.02em', 
            marginBottom: '1.5rem',
            opacity: 0, 
            animation: 'fadeInText 3s ease-in-out forwards',
            animationDelay: '3s'
          }}>
            CareBridge（ケアブリッジ）は、  <strong>介護情報を一元管理し、職員や介護家族の方がどこにいても、いつでも必要な情報に迅速にアクセスできる環境</strong>を提供します。
          </p>
        </div>
      </div>

      {/* サービスセクション */}
      <div
        id="services" 
        style={{
          padding: '4rem',
          backgroundColor: '#f7f7f7', 
          color: '#023059',
          borderRadius: '10px',
          maxWidth: '60%',
          margin: '4rem auto 0 auto', 
          textAlign: 'center', 
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
        }}
      >
        <h2>
          <img src="/images/webHomePage_services_icon.png" alt="Services" className="inline-block w-6 mr-2" />
          サービス
        </h2>
        <p>
          CareBridge（ケアブリ）は、介護現場と家族をシームレスにつなぎ、安心・信頼の情報共有を提供します。詳細はこちらをご覧ください。
        </p>

        {/* ここから追加されたコンテンツ */}
        <div style={{ marginTop: '4rem' }}>
  <h2>4つの情報共有ツール</h2>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div style={{ width: '100%', textAlign: 'center' }}>
      <div style={{ backgroundColor: 'white', color: '#FF8C00', padding: '1rem',border: '2px solid #FF8C00' }}>
        <h3>ケア記録</h3>
      </div>
      <img src="/images/webpage_care1.png" alt="ケア記録" style={{ width: '100%', height: 'auto' }} />
      <p>ケアの詳細な記録を管理できます。</p>
    </div>
    <div style={{ width: '100%', textAlign: 'center' }}>
    <div style={{ backgroundColor: 'white', color: '#FF8C00', padding: '1rem',border: '2px solid #FF8C00' }}> 
        <h3>ダッシュボード</h3>
      </div>
      <img src="/images/webpage_dashboad2.png" alt="ダッシュボード" style={{ width: '100%', height: 'auto' }} />
      <p>健康状態やケアの進捗を一目で確認できます。</p>
    </div>
    <div style={{ width: '100%', textAlign: 'center' }}>
    <div style={{ backgroundColor: 'white', color: '#FF8C00', padding: '1rem',border: '2px solid #FF8C00' }}>
        <h3>連絡ノート</h3>
      </div>
      <img src="/images/webpage_contact3.png" alt="連絡ノート" style={{ width: '100%', height: 'auto' }} />
      <p>介護施設からの連絡事項をリアルタイムで確認できます。</p>
    </div>
    <div style={{ width: '100%', textAlign: 'center' }}>
    <div style={{ backgroundColor: 'white', color: '#FF8C00', padding: '1rem',border: '2px solid #FF8C00' }}>
        <h3>お薬ノート</h3>
      </div>
      <img src="/images/webpage_medicine4.png" alt="お薬ノート" style={{ width: '100%', height: 'auto' }} />
      <p>処方薬の情報を簡単に管理。</p>
    </div>
  </div>
</div>

        {/* 問合せ/利用申込ボタン */}
        <button
          onClick={handleContactClick}
          style={{
            padding: '1rem 2rem',
            backgroundColor: 'white', 
            color: '#E78740', 
            border: '2px solid #E78740', 
            borderRadius: '5px',
            fontSize: '1rem',
            fontWeight: 'bold', 
            cursor: 'pointer',
            marginTop: '2rem',
          }}
        >
          問合せ/利用申込
        </button>
      </div>

      {/* 料金セクション */}
      <div
        id="pricing"
        style={{
          padding: '4rem',
          backgroundColor: '#f7f7f7', 
          color: '#023059',
          borderRadius: '10px',
          maxWidth: '60%',
          margin: '4rem auto 0 auto', 
          textAlign: 'center', 
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
        }}
      >
        <h2>
          <img src="/images/webHomePage_pricing_icon.png" alt="Pricing" className="inline-block w-6 mr-2" />
          料金
        </h2>
        <p style={{ 
          fontSize: '1.5rem', 
          fontWeight: '400', 
          color: '#023059', 
          lineHeight: '1.5', 
          marginBottom: '1.5rem',
        }}>
          月額 8800円
        </p>
        <p style={{ 
          fontSize: '1.2rem', 
          fontWeight: '400', 
          color: '#023059', 
          lineHeight: '1.5', 
          marginBottom: '1.5rem',
        }}>
          1ヶ月お試し無料
        </p>
      </div>

      {/* アクセスセクション */}
      <div
        id="access"
        style={{
          padding: '4rem',
          backgroundColor: '#f7f7f7',
          color: '#023059',
          borderRadius: '10px',
          maxWidth: '60%',
          margin: '4rem auto 0 auto',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2>
          <img src="/images/webHomePage_access_icon.png" alt="Access" className="inline-block w-6 mr-2" />
          アクセス (ACCESS)
        </h2>
        <p>〒107-0052　東京都港区赤坂7-7-7 AmiHills-777</p>
        <p>交通のご案内: 東京メトロ千代田線 乃木坂駅 徒歩6分</p>
        {/* Google Map の埋め込み */}
        <div style={{ marginTop: '2rem' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3241.2596015894464!2d139.73008407647535!3d35.67060933055627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1z5p2x5Lqs6YO95riv5Yy66LWk5Z2CNy03LTcgQW1pSGlsbHMtNzc3!5e0!3m2!1sja!2sjp!4v1724687251344!5m2!1sja!2sjp"
            width="600"
            height="450"
            style={{ border: '0' }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* 会社概要セクション */}
      <div
        id="companyInfo"
        style={{
          padding: '4rem',
          backgroundColor: '#f7f7f7',
          color: '#023059',
          borderRadius: '10px',
          maxWidth: '60%',
          margin: '4rem auto 0 auto',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2>
          <img src="/images/webHomePage_companyInfo_icon.png" alt="Company Info" className="inline-block w-6 mr-2" />
          会社概要 (COMPANY)
        </h2>
        {/* 会社概要の詳細情報 */}
        <div style={{ textAlign: 'left', marginTop: '2rem' }}>
          <p><strong>会社名:</strong> CareBridge</p>
          <p><strong>所在地:</strong> 東京都港区赤坂7-7-7 AmiHills-777</p>
          <p><strong>電話番号:</strong> 070-777-7777</p>
          <p><strong>FAX番号:</strong> 070-777-7778</p>
          <p><strong>URL:</strong> <a href="https://kaigosapuri.com/" style={{ color: '#023059' }}>https://kaigosapuri.com/</a></p>
          <p><strong>代表取締役:</strong> ななこ</p>
          <p><strong>専務取締役:</strong> あみ</p>
          <p><strong>常務取締役:</strong> はるか</p>
          <p><strong>資本金:</strong> 3万円</p>
          <p><strong>設立:</strong> 2027年7月7日</p>
          <p><strong>事業内容:</strong> 介護事業向け業務支援、データ分析、情報連携にかかるシステム開発、及びインフラ構築、企画、販売、運用保守</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInText {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInBox {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Details;
