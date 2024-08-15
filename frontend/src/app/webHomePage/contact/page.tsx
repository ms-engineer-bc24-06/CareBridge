'use client';

import React, { useState } from 'react';
import styles from '../styles/ContactForm.module.css';

type FormData = {
  inquiryType: string[];
  message: string;
  companyName: string;
  officeName: string;
  officeType: string;
  postalCode: string;
  address: string;
  name: string;
  kanaName: string;
  phoneNumber: string;
  email: string;
  confirmEmail: string;
  agreePrivacy: boolean;
  errors: {
    [key in keyof Omit<FormData, 'errors'>]?: string;
  };
};

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    inquiryType: [],
    message: '',
    companyName: '',
    officeName: '',
    officeType: '',
    postalCode: '',
    address: '',
    name: '',
    kanaName: '',
    phoneNumber: '',
    email: '',
    confirmEmail: '',
    agreePrivacy: false,
    errors: {},
  });

  const formatPostalCode = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 7);
    if (cleaned.length > 3) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    }
    return cleaned;
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else if (cleaned.length <= 11) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    }
    return cleaned.slice(0, 13); // 最大13文字に制限
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === 'postalCode') {
        formattedValue = formatPostalCode(value);
    } else if (name === 'phoneNumber') {
        formattedValue = formatPhoneNumber(value);
    }

    setFormData({
        ...formData,
        [name as keyof FormData]: formattedValue,  // 型キャストを追加
        errors: { ...formData.errors, [name as keyof FormData]: '' },  // 型キャストを追加
    });
  };

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        [name as keyof FormData]: [...(formData[name as keyof FormData] as string[]), value] as any,
      });
    } else {
      setFormData({
        ...formData,
        [name as keyof FormData]: (formData[name as keyof FormData] as string[]).filter((item) => item !== value) as any,
      });
    }
  };

  const validateForm = () => {
    const newErrors: FormData['errors'] = {};
    if (!formData.companyName) newErrors.companyName = '必須項目です';
    if (!formData.postalCode) newErrors.postalCode = '必須項目です';
    if (!formData.address) newErrors.address = '必須項目です';
    if (!formData.name) newErrors.name = '必須項目です';
    if (!formData.kanaName) newErrors.kanaName = '必須項目です';
    if (!formData.phoneNumber) newErrors.phoneNumber = '必須項目です';
    if (!formData.email) newErrors.email = '必須項目です';
    if (!formData.confirmEmail) newErrors.confirmEmail = '必須項目です';
    if (formData.email !== formData.confirmEmail) newErrors.confirmEmail = 'メールアドレスが一致しません';

    setFormData({ ...formData, errors: newErrors });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert('お問合せ送信完了しました。');
      console.log('Form Data Submitted:', formData);
      // ここでフォームデータを処理する
    }
  };

  return (
    <div className={styles.contactForm}>
      <h1 className={styles.mainTitle}>CareBridgeお問い合せ</h1>
      <form onSubmit={handleSubmit}>
        <section>
          <h2 className={styles.sectionTitle}>お問い合せ内容</h2>
          <div>
            <label><input type="checkbox" name="inquiryType" value="利用申込を希望する" onChange={handleCheckBoxChange} /> 利用申込を希望する</label><br />
            <label><input type="checkbox" name="inquiryType" value="資料請求" onChange={handleCheckBoxChange} /> 資料請求</label><br />
            <label><input type="checkbox" name="inquiryType" value="デモを希望する" onChange={handleCheckBoxChange} /> デモを希望する</label><br />
            <label><input type="checkbox" name="inquiryType" value="詳しい話を聞きたい" onChange={handleCheckBoxChange} /> 詳しい話を聞きたい</label><br />
            <label><input type="checkbox" name="inquiryType" value="その他" onChange={handleCheckBoxChange} /> その他</label>
          </div>
          <div>
            <label>内容</label>
            <textarea name="message" value={formData.message} onChange={handleChange} />
          </div>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>お客様情報</h2>
          <div>
            <label>法人名<span className={styles.required}>*</span></label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="例：株式会社CareBridge" />
            {formData.errors.companyName && <p className={styles.error}>{formData.errors.companyName}</p>}
          </div>
          <div>
            <label>事業所名</label>
            <input type="text" name="officeName" value={formData.officeName} onChange={handleChange} placeholder="例：特別養護はるか老人ホーム" />
          </div>
          <div>
            <label>事業所形態</label>
            <input type="text" name="officeType" value={formData.officeType} onChange={handleChange} />
          </div>
          <div>
            <label>郵便番号<span className={styles.required}>*</span></label>
            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="例：107-0052" />
            {formData.errors.postalCode && <p className={styles.error}>{formData.errors.postalCode}</p>}
          </div>
          <div>
            <label>住所<span className={styles.required}>*</span></label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="例：東京都港区赤坂7-7-7 AmiHills-777" />
            {formData.errors.address && <p className={styles.error}>{formData.errors.address}</p>}
          </div>
          <div>
            <label>お名前<span className={styles.required}>*</span></label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="例：飯沼 春歌" />
            {formData.errors.name && <p className={styles.error}>{formData.errors.name}</p>}
          </div>
          <div>
            <label>ふりがな<span className={styles.required}>*</span></label>
            <input type="text" name="kanaName" value={formData.kanaName} onChange={handleChange} placeholder="例：いいぬま はるか" />
            {formData.errors.kanaName && <p className={styles.error}>{formData.errors.kanaName}</p>}
          </div>
          <div>
            <label>電話番号<span className={styles.required}>*</span></label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="例：777-7777-7777" />
            {formData.errors.phoneNumber && <p className={styles.error}>{formData.errors.phoneNumber}</p>}
          </div>
          <div>
            <label>メールアドレス<span className={styles.required}>*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="例：haruka@carebridge.com" />
            {formData.errors.email && <p className={styles.error}>{formData.errors.email}</p>}
          </div>
          <div>
            <label>メールアドレス（確認用）<span className={styles.required}>*</span></label>
            <input type="email" name="confirmEmail" value={formData.confirmEmail} onChange={handleChange} />
            {formData.errors.confirmEmail && <p className={styles.error}>{formData.errors.confirmEmail}</p>}
          </div>
        </section>

        {/* プライバシーポリシー */}
        <section>
          <div className={styles.privacyPolicyBox}>
            <h2>個人情報保護方針</h2>
            <p>
              当社は、個人情報の保護に努め、お客様の個人情報を適切に取り扱うことをお約束します。当社は、以下の方針に基づき、個人情報の収集、利用、管理を行います。
            </p>
            <p>
              1. 個人情報の収集は、適法かつ公正な手段によって行います。収集する情報は、必要な範囲に限定します。
            </p>
            <p>
              2. 収集した個人情報は、当社の業務遂行に必要な範囲内で利用し、目的外の利用は行いません。
            </p>
            <p>
              3. 当社は、個人情報の漏洩、改ざん、紛失を防止するために、適切な管理措置を講じます。
            </p>
            <p>
              4. お客様からの個人情報に関する苦情や相談に対して、迅速かつ適切に対応します。
            </p>
          </div>
          <div>
            <label>
              <input type="checkbox" name="agreePrivacy" checked={formData.agreePrivacy} onChange={(e) => setFormData({ ...formData, agreePrivacy: e.target.checked })} /> 個人情報保護方針に同意する
            </label>
          </div>
        </section>

        <section>
          <button type="submit" disabled={!formData.agreePrivacy}>送信</button>
        </section>
      </form>
    </div>
  );
};

export default Contact;
