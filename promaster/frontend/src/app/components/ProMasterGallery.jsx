'use client';

import React, { useState, useEffect } from 'react';
import styles from './ProMasterGallery.module.css';
import Link from 'next/link';

// Localized gallery — responds to pm_lang localStorage, document.documentElement.lang, or a passed prop `lang`.
// Titles/subtitles include Arabic fallbacks (title_ar, subtitle_ar). The component watches storage and a custom
// `pm_lang_change` event so it stays in sync with the rest of your app when the language toggle is used.

const GALLERY_ITEMS = [
  {
    id: 1,
    title: '2025 Design',
    title_ar: 'تصميم 2025',
    subtitle: 'Professional Touch',
    subtitle_ar: 'لمسة احترافية',
    img: 'https://promaster-sa.net/wp-content/uploads/2025/11/Untitled-2.jpg',
  },
  {
    id: 2,
    title: 'Ceramic Shine',
    title_ar: 'لمعان سيراميك',
    subtitle: 'Glossy Finish',
    subtitle_ar: 'لمسة لامعة',
    img: 'https://promaster-sa.net/wp-content/uploads/2025/11/2.jpg',
  },
  {
    id: 3,
    title: 'Wheel Coating',
    title_ar: 'طلاء العجلات',
    subtitle: 'Premium Finish',
    subtitle_ar: 'لمسة نهائية فاخرة',
    img: 'https://promaster-sa.net/wp-content/uploads/2025/11/6.jpg',
  },
  {
    id: 4,
    title: 'Tinted Glass',
    title_ar: 'زجاج مظلل',
    subtitle: 'Protection & Privacy',
    subtitle_ar: 'حماية وخصوصية',
    img: 'https://promaster-sa.net/wp-content/uploads/2025/11/3.jpg',
  },
  {
    id: 5,
    title: 'Luxury Interior',
    title_ar: 'داخلية فاخرة',
    subtitle: 'Elegant Detailing',
    subtitle_ar: 'تفاصيل أنيقة',
    img: 'https://promaster-sa.net/wp-content/uploads/2025/11/5.jpg',
  },
  {
    id: 6,
    title: 'Dash Camera',
    title_ar: 'كاميرا داش',
    subtitle: 'Recording & Convenience',
    subtitle_ar: 'تسجيل وراحة',
    img: 'https://promaster-sa.net/wp-content/uploads/2025/11/4.jpg',
  },
];

export default function ProMasterGallery({ lang: propLang = null }) {
  const getInitialLang = () => {
    if (propLang) return propLang;
    if (typeof window !== 'undefined') {
      try {
        const s = localStorage.getItem('pm_lang');
        if (s) return s;
      } catch (e) { /* ignore */ }
      if (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang) {
        return document.documentElement.lang.startsWith('ar') ? 'ar' : 'en';
      }
    }
    return 'en';
  };

  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    if (propLang && propLang !== lang) setLang(propLang);
  }, [propLang]);

  // keep in sync with other components: storage, mutation observer, custom event
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onStorage = (e) => {
      if (e.key === 'pm_lang') setLang(e.newValue || 'en');
    };
    window.addEventListener('storage', onStorage);

    const docEl = document.documentElement;
    const mo = new MutationObserver(() => {
      const dl = docEl.lang && docEl.lang.startsWith('ar') ? 'ar' : 'en';
      setLang(dl);
    });
    mo.observe(docEl, { attributes: true, attributeFilter: ['lang'] });

    const onCustom = (ev) => {
      if (ev && ev.detail && ev.detail.pm_lang) setLang(ev.detail.pm_lang);
    };
    window.addEventListener('pm_lang_change', onCustom);

    return () => {
      window.removeEventListener('storage', onStorage);
      mo.disconnect();
      window.removeEventListener('pm_lang_change', onCustom);
    };
  }, []);

  const texts = {
    en: {
      heading: 'Latest Designs',
      paragraph: 'A curated selection of our work — click any image to view it in full size.',
      cta: 'Book a Consultation or Contact Us',
    },
    ar: {
      heading: 'أحدث التصاميم',
      paragraph: 'مجموعة منتقاة من أعمالنا — انقر على أي صورة لعرضها بالحجم الكامل.',
      cta: 'احجز استشارة أو تواصل معنا',
    }
  };

  const getTitle = (item) => (lang === 'ar' ? (item.title_ar || item.title) : (item.title || item.title_ar));
  const getSubtitle = (item) => (lang === 'ar' ? (item.subtitle_ar || item.subtitle) : (item.subtitle || item.subtitle_ar));

  return (
    <section className={styles.gallerySection} id="gallery" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className={styles.header}>
        <h1>{texts[lang].heading}</h1>
        <p>{texts[lang].paragraph}</p>
      </div>

      <div className={styles.grid}>
        {GALLERY_ITEMS.map((item) => (
          <article key={item.id} className={styles.card}>
            <a href={item.img} target="_blank" rel="noreferrer">
              <div className={styles.imageWrapper}>
                <img src={item.img} alt={getTitle(item)} />
                <div className={styles.overlay} aria-hidden>
                  <div>
                    <h3>{getTitle(item)}</h3>
                    <p>{getSubtitle(item)}</p>
                  </div>
                </div>
              </div>
            </a>
          </article>
        ))}
      </div>

      <div className={styles.ctaRow}>
        <Link href="/contact" legacyBehavior>
          <a className={styles.ctaButton}>{texts[lang].cta}</a>
        </Link>
      </div>
    </section>
  );
}
