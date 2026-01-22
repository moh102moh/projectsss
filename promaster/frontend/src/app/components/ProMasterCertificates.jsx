'use client';

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules"; 
import styles from "./ProMasterCertificates.module.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination"; 

// Localized ProMasterCertificates — responds to pm_lang in localStorage, document.documentElement.lang,
// and a custom 'pm_lang_change' event. It keeps original behavior while swapping UI and certificate
// text between English and Arabic when available.

export default function ProMasterCertificates({ lang: propLang = null }) {
  const certificates = [
    {
      id: 1,
      title: "SONAX – Germany",
      title_ar: 'SONAX – ألمانيا',
      desc: "Certified by SONAX, a leading global German brand in high-performance car care products.",
      desc_ar: 'معتمد من SONAX، العلامة التجارية الألمانية الرائدة في منتجات العناية العالية الأداء للسيارات.',
      img: "/image/11.jpeg",
    },
    {
      id: 2,
      title: "Koch-Chemie – Germany",
      title_ar: 'Koch-Chemie – ألمانيا',
      desc: "Certified by Koch-Chemie, a German pioneer in advanced chemical innovations for automotive care.",
      desc_ar: 'معتمد من Koch-Chemie، رائد ألماني في الابتكارات الكيميائية المتقدمة للعناية بالسيارات.',
      img: "/image/12.jpeg",
    },
    {
      id: 3,
      title: "DSTech – USA",
      title_ar: 'DSTech – الولايات المتحدة',
      desc: "Certified by DSTech, a U.S. provider of advanced technology solutions enhancing operational accuracy and service quality.",
      desc_ar: 'معتمد من DSTech، مزود أمريكي لحلول تكنولوجية متقدمة تعمل على تحسين الدقة التشغيلية وجودة الخدمة.',
      img: "/image/13.jpeg",
    },
    {
      id: 4,
      title: "D’AMBROSIO – Italy",
      title_ar: 'D’AMBROSIO – إيطاليا',
      desc: "Certified by D’AMBROSIO, an Italian specialist in professional automotive care solutions.",
      desc_ar: 'معتمد من D’AMBROSIO، متخصص إيطالي في حلول العناية الاحترافية بالسيارات.',
      img: "/image/15.jpeg",
    },
  ];

  // language init: prop -> localStorage -> document.lang -> default 'en'
  const getInitialLang = () => {
    if (propLang) return propLang;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('pm_lang');
        if (stored) return stored;
      } catch (e) { /* ignore */ }
      if (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang) {
        return document.documentElement.lang.startsWith('ar') ? 'ar' : 'en';
      }
    }
    return 'en';
  };

  const [lang, setLang] = useState(getInitialLang);
  const [active, setActive] = useState(certificates[0]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync with external language changes: storage, MutationObserver, custom event
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

  useEffect(() => {
    if (propLang && propLang !== lang) setLang(propLang);
  }, [propLang]);

  const t = {
    en: {
      headingA: 'OUR',
      headingB: 'CERTIFICATES',
      paragraph: 'We partner with world-class brands to bring you trusted, certified automotive solutions.',
    },
    ar: {
      headingA: 'شهادات',
      headingB: 'اعتمادنا',
      paragraph: 'نتعاون مع علامات تجارية عالمية لنقدم لكم حلول معتمدة وموثوقة في العناية بالسيارات.',
    }
  };

  const handleSwiperSlideChange = (swiper) => {
    const idx = swiper.activeIndex % certificates.length;
    setActive(certificates[idx]);
  };

  const getTitle = (c) => (lang === 'ar' ? (c.title_ar || c.title) : (c.title || c.title_ar));
  const getDesc = (c) => (lang === 'ar' ? (c.desc_ar || c.desc) : (c.desc || c.desc_ar));

  return (
    <div id="certificates" className={styles.container} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className={styles.title}>
        {lang === 'ar' ? `${t.ar.headingA} ` : `${t.en.headingA} `}
        <span>{lang === 'ar' ? t.ar.headingB : t.en.headingB}</span>
      </h1>

      <p className={styles.desc}>{lang === 'ar' ? t.ar.paragraph : t.en.paragraph}</p>

      {isMobile ? (
        <div className={styles.carouselWrapper}>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={true}
            spaceBetween={0}
            slidesPerView={1}
            centeredSlides={true}
            onSlideChange={handleSwiperSlideChange}
            initialSlide={0}
            className={styles.mySwiper}
          >
            {certificates.map((cert) => (
              <SwiperSlide key={cert.id}>
                <div className={`${styles.card} ${active?.id === cert.id ? styles.activeCard : ''}`}>
                  <span className={styles.rightHalf} />
                  <span className={styles.bottomLine} />
                  <img src={cert.img} alt={getTitle(cert)} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className={styles.grid}>
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className={`${styles.card} ${active?.id === cert.id ? styles.activeCard : ''}`}
              onClick={() => setActive(cert)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActive(cert); }}
            >
              <span className={styles.rightHalf} />
              <span className={styles.bottomLine} />
              <img src={cert.img} alt={getTitle(cert)} />
            </div>
          ))}
        </div>
      )}

      {active && (
        <div className={styles.popupBox}>
          <h2>{getTitle(active)}</h2>
          <p>{getDesc(active)}</p>
        </div>
      )}
    </div>
  );
}
