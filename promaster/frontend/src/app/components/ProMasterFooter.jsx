'use client';

import React from 'react';
import styles from './ProMasterFooter.module.css';
import FooterVideoModel from './FooterVideoModel.jsx';

// الفروع ثنائية اللغة
const BRANCHES = [
  { en: 'Al Manar', ar: 'المنار' },
  { en: 'Al Remal', ar: 'الرمال' },
  { en: 'Al Rawdah', ar: 'الروضة' }
];

// روابط الشركة ثنائية اللغة
const COMPANY_LINKS = [
  { label: { en: 'Store', ar: 'المتجر' }, href: '/store' },
  { label: { en: 'About Us', ar: 'من نحن' }, href: '#about' },
  { label: { en: 'Pricing', ar: 'الأسعار' }, href: '/pricing' },
  { label: { en: 'Certification', ar: 'الشهادات' }, href: '/certificates' }
];

const SOCIAL_LINKS = ['Facebook', 'Instagram', 'TikTok', 'Snapchat'];
const PHONES = ['0534876664', '0508420947', '0502009579'];

function toWaLink(localNumber) {
  const digits = String(localNumber).replace(/\D/g, '');
  const intl = digits.replace(/^0/, '966');
  return `https://wa.me/${intl}`;
}

export default function ProMasterFooter({ lang = 'en' }) {
  const isAr = lang === 'ar';

  return (
    <footer 
      className={styles.footerContainer} 
      dir={isAr ? 'rtl' : 'ltr'} 
      style={{ textAlign: isAr ? 'right' : 'left' }}
    >

      {/* Watermark LEFT only */}
      <div className={styles['watermark-left']} aria-hidden="true" />

      {/* MAIN */}
      <div className={styles.footerMainLayout}>

        {/* LEFT */}
        <div className={styles.sideGroup}>
          <div className={styles.column}>
            <h4 className={styles.title}>{isAr ? 'لنتحدث' : 'LET’S TALK'}</h4>
            <p className={styles.text}>
              {isAr 
                ? 'هل لديك سؤال أو تحتاج مساعدة؟\nفريقنا جاهز لمساعدتك.' 
                : 'Have a question or need help?\nOur team is ready to assist you.'
              }
            </p>
            <a href="#schedule" className={styles.actionLink}>
              {isAr ? 'جدولة مكالمة' : 'SCHEDULE A CALL'}
            </a>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>{isAr ? 'الفروع' : 'BRANCHES'}</h4>
            <ul className={styles.list}>
              {BRANCHES.map((b, i) => (
                <li key={i}>{isAr ? b.ar : b.en}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* CENTER model */}
        <div className={styles.centerModel}>
          <div className={styles.modelInner} id="promaster-model-inner">
            <FooterVideoModel />
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.sideGroup}>
          <div className={styles.column}>
            <h4 className={styles.title}>{isAr ? 'واتساب' : 'WHATSAPP'}</h4>
            <ul className={styles.list}>
              {PHONES.map((p, i) => (
                <li key={i}>
                  <a
                    href={toWaLink(p)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsapp}
                  >
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>{isAr ? 'الشركة' : 'COMPANY'}</h4>
            <ul className={styles.list}>
              {COMPANY_LINKS.map((l, i) => (
                <li key={i}>
                  <a href={l.href}>{isAr ? l.label.ar : l.label.en}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      <div className={styles.divider} />

      <div className={styles.socialSection}>
        <h4 className={styles.title}>{isAr ? 'تابعنا' : 'FOLLOW US'}</h4>
        <div className={styles.socialLinks}>
          {SOCIAL_LINKS.map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      </div>

      {/* Payments in white frame */}
      <div className={styles.paymentLogosContainer}>
        <div className={styles.paymentLogosWrapper}>
          <img src="/image/TTT.png" alt="Tamara" />
          <img src="/image/tappy.webp" alt="Tappy" />
          <img src="/image/miss.png" alt="Mispay" />
          <img src="/image/visa.png" alt="Visa" />
          <img src="/image/masterCard.png" alt="MasterCard" />
        </div>
      </div>

      <p className={styles.copyright}>
        © {isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved'}, PROMASTER 2026
      </p>

    </footer>
  );
}
