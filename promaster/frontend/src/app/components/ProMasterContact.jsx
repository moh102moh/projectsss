// components/ProMasterBranches.jsx
'use client';

import React, { useState, useRef } from 'react';
import styles from './ProMasterContact.module.css';
import dynamic from 'next/dynamic';

const Globe3D = dynamic(() => import('./Globe3D'), { ssr: false });

// الفروع مع الأسماء العربية
const BRANCHES = [
  { name: 'ALMANAR', city: 'Riyadh', district: 'ALMANAR', arCity: 'الرياض', arDistrict: 'المنار' },
  { name: 'ALREMAL', city: 'Riyadh', district: 'ALREMAL', arCity: 'الرياض', arDistrict: 'الرمال' },
  { name: 'ALRAWDAH', city: 'Jeddah', district: 'ALRAWDAH', arCity: 'جدة', arDistrict: 'الروضة' }
];

// الترجمة
const t = {
  en: {
    firstName: 'FIRST NAME',
    firstNamePH: 'Enter Your Name',
    email: 'EMAIL',
    emailPH: 'Enter Your Email',
    countryCode: 'COUNTRY CODE',
    phone: 'PHONE NUMBER',
    phonePH: 'Enter Your Phone Number',
    service: 'SERVICE REQUIRED',
    servicePH: '--Choose a service--',
    notes: 'NOTES (optional)',
    notesPH: 'Any notes or special requests...',
    submit: 'GET IN TOUCH',
    statusMissing: '❌ Please fill all required fields and select a branch',
    statusSending: '⏳ Sending...',
    statusSuccess: '✅ Sent successfully!',
    statusError: '❌ Server error!',
    statusFail: '❌ Failed to connect to the server!',
  },
  ar: {
    firstName: 'الاسم',
    firstNamePH: 'أدخل اسمك',
    email: 'البريد الإلكتروني',
    emailPH: 'أدخل بريدك الإلكتروني',
    countryCode: 'رمز الدولة',
    phone: 'رقم الهاتف',
    phonePH: 'أدخل رقم الهاتف',
    service: 'الخدمة المطلوبة',
    servicePH: '--اختر خدمة--',
    notes: 'ملاحظات (اختياري)',
    notesPH: 'أي ملاحظات أو طلبات خاصة...',
    submit: 'إرسال الطلب',
    statusMissing: '❌ الرجاء ملء جميع الحقول المطلوبة وتحديد الفرع',
    statusSending: '⏳ جاري الإرسال...',
    statusSuccess: '✅ تم الإرسال بنجاح!',
    statusError: '❌ حدث خطأ في الخادم',
    statusFail: '❌ فشل الاتصال بالخادم، يرجى التأكد من تشغيل الباك-إند',
  }
};

export default function ProMasterBranches({ lang = 'en' }) {
  const isAr = lang === 'ar';

  const [selectedBranch, setSelectedBranch] = useState('ALMANAR');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('+966');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [service, setService] = useState('');
  const [notes, setNotes] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const timeoutRef = useRef(null);

  const showStatusMessage = (message, duration = 2000) => {
    setStatusMessage(message);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setStatusMessage(''), duration);
  };

  const isSubmitEnabled =
    selectedBranch &&
    firstName.trim() !== '' &&
    email.trim() !== '' &&
    phoneNumber.trim() !== '' &&
    service.trim() !== '';

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setStatusMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSubmitEnabled) {
      showStatusMessage(t[lang].statusMissing);
      return;
    }

    showStatusMessage(t[lang].statusSending);

    const phone = `${phoneCode}${phoneNumber.replace(/\s+/g, '')}`;
    const formData = { firstName, email, phone, branch: selectedBranch, service, notes };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        showStatusMessage(data.message || t[lang].statusSuccess);
        setFirstName('');
        setEmail('');
        setPhoneCode('+966');
        setPhoneNumber('');
        setService('');
        setNotes('');
        setSelectedBranch('ALMANAR');
      } else {
        showStatusMessage(data.message || t[lang].statusError);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      showStatusMessage(t[lang].statusFail);
    }
  };

  const branchTitleMap = {
    ALMANAR: isAr ? 'فرع المنار' : 'AL MANAR BRANCH',
    ALREMAL: isAr ? 'فرع الرمال' : 'AL REMAL BRANCH',
    ALRAWDAH: isAr ? 'فرع الروضة' : 'ALRAWDAH BRANCH'
  };

  const branchContent = {
    title: branchTitleMap[selectedBranch],
    paragraphs: isAr
      ? [
          "استمتع بخدمة سيارات متميزة في فرعنا...",
          "لا تتردد بزيارة فروعنا في جميع أنحاء المملكة...",
          "نتطلع لاستقبالكم قريبًا في PROMASTER!",
        ]
      : [
          "Experience premium car care at our branch...",
          "Feel free to visit our branches across the Kingdom...",
          "We look forward to welcoming you at PROMASTER soon!",
        ]
  };

  return (
    <section className={`${styles.branchesSection} ${isAr ? styles.rtl : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
      <h1 className={styles.mainTitle}>
        <span className={styles.yellow}>{isAr ? 'قم بزيارة' : 'VISIT OUR'}</span> {isAr ? 'الفروع' : 'BRANCHES'}
      </h1>

      {/* أزرار الفروع */}
      <div className={styles.branchesWrapper}>
        {BRANCHES.map((branch) => (
          <button
            key={branch.name}
            className={`${styles.branchButton} ${selectedBranch === branch.name ? styles.selected : ''}`}
            onClick={() => handleBranchSelect(branch.name)}
          >
            <div style={{ fontSize: '1.5rem' }}>{isAr ? branch.arCity : branch.city}</div>
            <div style={{ fontSize: '1.1rem', color: '#eac400' }}>{isAr ? branch.arDistrict : branch.district}</div>
          </button>
        ))}
      </div>

      <div className={styles.contentGrid}>
        {/* النص/الفورم */}
        <div className={styles.textColumn}>
          <h2 className={styles.branchTitle}>{branchContent.title}</h2>
          {branchContent.paragraphs.map((text, index) => (
            <p key={index} className={styles.borderedParagraph}>{text}</p>
          ))}

          <form onSubmit={handleSubmit}>
            <div className={`${styles.formGroup} ${isAr ? styles.rtlForm : ''}`}>
              <div className={styles.inputWrapper}>
                <label htmlFor="firstName" className={styles.inputLabel}>{t[lang].firstName}</label>
                <input
                  type="text"
                  id="firstName"
                  placeholder={t[lang].firstNamePH}
                  className={styles.inputField}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputWrapper}>
                <label htmlFor="email" className={styles.inputLabel}>{t[lang].email}</label>
                <input
                  type="email"
                  id="email"
                  placeholder={t[lang].emailPH}
                  className={styles.inputField}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={`${styles.formGroup} phoneRow ${isAr ? styles.rtlForm : ''}`}>
              <div className={styles.inputWrapper}>
                <label className={styles.inputLabel}>{t[lang].countryCode}</label>
                <select
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  className={styles.selectField}
                >
                  <option value="+966">+966 (SA)</option>
                  <option value="+971">+971 (AE)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                </select>
              </div>

              <div className={styles.inputWrapper}>
                <label htmlFor="phone" className={styles.inputLabel}>{t[lang].phone}</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder={t[lang].phonePH}
                  className={styles.inputField}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.inputWrapperFull}>
                <label htmlFor="service" className={styles.inputLabel}>{t[lang].service}</label>
                <select
                  id="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className={styles.selectFieldFull}
                  required
                >
                  <option value="">{t[lang].servicePH}</option>
                  <option value="maintenance">Maintenance / صيانة</option>
                  <option value="detailing">Detailing / تنظيف داخلي وخارجي</option>
                  <option value="repair">Repair / تصليح</option>
                  <option value="inspection">Inspection / فحص</option>
                  <option value="other">Other / أخرى</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.inputWrapperFull}>
                <label htmlFor="notes" className={styles.inputLabel}>{t[lang].notes}</label>
                <textarea
                  id="notes"
                  placeholder={t[lang].notesPH}
                  className={styles.textareaField}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            {statusMessage && <p className={styles.statusMessage}>{statusMessage}</p>}

            <button
              type="submit"
              className={`${styles.submitButton} ${isSubmitEnabled ? styles.active : ''}`}
              disabled={!isSubmitEnabled}
            >
              {t[lang].submit}
            </button>
          </form>
        </div>

        {/* الكرة */}
        <div className={styles.visualColumn}>
          <div className={styles.globeWrapper}>
            <Globe3D />
          </div>
        </div>
      </div>
    </section>
  );
}
