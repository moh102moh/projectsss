'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import services from '../../components/servicesData.js'; 

export default function ServicePageClient() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const paramId = params?.id ?? null;
  const qpLang = searchParams ? searchParams.get('lang') : null;

  const [lang, setLang] = useState('en');
  const [service, setService] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const isMobileOrTablet = viewportWidth < 1200;

  // إعداد اللغة والاتجاه
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('pm_lang') : null;
    const initial = qpLang === 'ar' || qpLang === 'en' ? qpLang : (stored || 'en');
    setLang(initial);
  }, [qpLang]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [lang]);

  // مراقبة حجم الشاشة
  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // استخراج الخدمة
  const extractIdFromPath = () => {
    if (typeof window === 'undefined') return null;
    const parts = window.location.pathname.split('/').filter(Boolean);
    return parts.length ? parts[parts.length - 1] : null;
  };

  const findService = (rawId) => {
    if (!rawId) return null;
    let found = services.find(x => String(x.id) === String(rawId) || String(x.slug) === String(rawId));
    if (found) return found;
    const num = Number(rawId);
    if (!Number.isNaN(num)) {
      found = services.find(x => Number(x.id) === num || (x.slug && String(x.slug) === String(rawId)));
    }
    return found || null;
  };

  useEffect(() => {
    const idToTry = paramId || extractIdFromPath();
    if (!idToTry) return;
    const found = findService(idToTry);
    if (found) setService(found);
  }, [paramId]);

  if (!service) {
    return (
      <div style={{ padding: 60, color: '#eee', background: '#0b0b0b', minHeight: '100vh', textAlign: 'center' }}>
        <p>{lang === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}</p>
      </div>
    );
  }

  const isRtl = lang === 'ar';

  // --- دوال مساعدة للصور والنصوص ---
  const normalizedImages = (svc) => {
    const srcs = Array.isArray(svc.images) ? [...svc.images] : [];
    const want = (svc.slug === 'ppf' || svc.slug === 'cwf-window-film') ? 4 : 3;
    if (srcs.length === 0) {
      for (let i = 0; i < want; i++) srcs.push('/image/placeholder.jpg');
      return srcs;
    }
    while (srcs.length < want) {
      srcs.push(srcs[srcs.length - 1]);
    }
    return srcs.slice(0, want);
  };

  const splitIntoParagraphs = (text, maxParts = 3) => {
    if (!text) return [''];
    const byBlankLines = text.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
    if (byBlankLines.length > 0 && byBlankLines.length <= maxParts) return byBlankLines;
    const sentences = text.split(/(?<=[.؟!\n])\s+/u).map(s => s.trim()).filter(Boolean);
    return sentences;
  };

  const imgs = normalizedImages(service);
  const descText = isRtl ? (service.description_ar || service.description) : (service.description || '');
  const descParagraphs = splitIntoParagraphs(descText, 10); // زيادة الرقم لضمان عدم ضياع أي نص
  
  // دمج البيانات للتأكد من وجودها
  const details = isRtl ? (service.details_ar || {}) : (service.details_en || {});
  const categories = details.categories || [];
  const features = details.features || [];
  const overviewText = details.overview || '';

  // --- مكونات واجهة المستخدم ---

  const HeaderNav = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
      <Link href="/" style={{ color: '#FFD700', textDecoration: 'none', fontSize: '1rem', fontWeight: 700 }}>
        {isRtl ? '← العودة للرئيسية' : '← Back to Home'}
      </Link>
      <button onClick={() => {
        const newLang = lang === 'en' ? 'ar' : 'en';
        setLang(newLang);
        if (typeof window !== 'undefined') localStorage.setItem('pm_lang', newLang);
        const url = new URL(window.location.href); url.searchParams.set('lang', newLang);
        router.replace(`${url.pathname}${url.search}`);
      }} style={{ background: '#222', color: '#FFD700', border: '1px solid #FFD700', padding: '8px 18px', borderRadius: 8, fontWeight: 700 }}>
        {isRtl ? 'English' : 'العربية'}
      </button>
    </div>
  );

  const ActionButtons = (
    <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <a href="https://wa.me/966534876664" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', flex: isMobileOrTablet ? 1 : 'initial' }}>
        <button style={{
          width: '100%', padding: '12px 24px', borderRadius: 10, background: '#FFD700', color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '1.05rem'
        }}>{isRtl ? 'اطلب الخدمة الآن' : 'Order Now'}</button>
      </a>
      <a href="tel:+966534876664" style={{ textDecoration: 'none', flex: isMobileOrTablet ? 1 : 'initial' }}>
        <button style={{
          width: '100%', padding: '12px 24px', borderRadius: 10, background: 'transparent', color: '#FFD700', border: '2px solid #FFD700', fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem'
        }}>{isRtl ? 'اتصال مباشر' : 'Call Now'}</button>
      </a>
    </div>
  );

  // مكون لعرض القوائم بدون نقاط مزدوجة
  const FeatureList = ({ items }) => (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {items.map((f, idx) => (
        <li key={idx} style={{ marginBottom: 8, display: 'flex', alignItems: 'flex-start' }}>
          <span style={{ 
            color: '#FFD700', fontWeight: 'bold', fontSize: '1.2rem', lineHeight: '1.5rem',
            marginInlineEnd: 10, flexShrink: 0
          }}>•</span>
          <span style={{ color: '#ccc', fontSize: '1rem', lineHeight: 1.7 }}>{f}</span>
        </li>
      ))}
    </ul>
  );

  // --- العرض للشاشات الكبيرة (Desktop) ---
  const DesktopLayout = () => (
    <div style={{ display: 'flex', gap: 50, alignItems: 'flex-start' }}>
      {/* العمود النصي (يمين في العربي / يسار في الإنجليزي) */}
      <div style={{ flex: 1 }}>
        <h1 style={{ color: '#FFD700', fontSize: '2.8rem', marginBottom: 20, fontWeight: 800 }}>
          {isRtl ? (service.title_ar || service.title) : service.title}
        </h1>

        {/* الوصف الرئيسي */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 30 }}>
          {descParagraphs.map((p, i) => (
            <div key={i} style={{
              padding: '16px 20px',
              background: i === 0 ? 'linear-gradient(90deg, rgba(255,215,20,0.03), rgba(255,215,20,0.01))' : '#141414',
              borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)', color: '#ddd', lineHeight: 1.8,
              fontSize: '1.05rem'
            }}>
              <p style={{ margin: 0 }}>{p}</p>
            </div>
          ))}
        </div>

        {/* تفاصيل إضافية (Overview) مع دعم الأسطر الجديدة */}
        {overviewText && (
          <div style={{ marginBottom: 30 }}>
            <h3 style={{ color: '#FFD700', fontSize: '1.25rem', marginBottom: 12, borderBottom: '2px solid #FFD700', display: 'inline-block' }}>
              {isRtl ? 'نظرة عامة ' : 'Overview & Details'}
            </h3>
            <div style={{ color: '#ccc', fontSize: '1.05rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {overviewText}
            </div>
          </div>
        )}

        {/* المميزات */}
        <div style={{ marginBottom: 30 }}>
          <h3 style={{ color: '#FFD700', fontSize: '1.25rem', marginBottom: 12 }}>{isRtl ? 'الميزات الرئيسية' : 'Key Features'}</h3>
          <FeatureList items={features} />
        </div>

        {/* خيارات الضمان */}
        {categories.length > 0 && (
          <div style={{ background: '#111', padding: 20, borderRadius: 12, border: '1px solid #333' }}>
            <h4 style={{ color: '#FFD700', marginBottom: 15, fontSize: '1.1rem' }}>{isRtl ? 'خيارات الضمان' : 'Warranty Options'}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {categories.map((c, i) => (
                <div key={i} style={{ padding: '12px', background: '#1a1a1a', borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{c.name}</span>
                  <span style={{ color: '#FFD700', fontWeight: 800 }}>{c.warranty}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {ActionButtons}
      </div>

      {/* عمود الصور */}
      <div style={{ width: '450px', position: 'sticky', top: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {imgs.map((src, idx) => (
          <div key={idx} style={{
            borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)', height: idx === 0 ? 350 : 250
          }}>
            <img src={src} alt="Service" style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                 onError={(e) => { e.target.src = '/image/placeholder.jpg'; }} />
          </div>
        ))}
      </div>
    </div>
  );

  // --- العرض للشاشات الصغيرة والمتوسطة (Mobile/Tablet) ---
  const MobileLayout = () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* 1. العنوان */}
      <h1 style={{ color: '#FFD700', fontSize: '2rem', marginBottom: 16, fontWeight: 800, lineHeight: 1.3 }}>
        {isRtl ? (service.title_ar || service.title) : service.title}
      </h1>

      {/* 2. الصورة البارزة */}
      <div style={{ 
        width: '100%', height: 260, borderRadius: 14, overflow: 'hidden', marginBottom: 24,
        border: '1px solid rgba(255,215,20,0.2)', boxShadow: '0 8px 20px rgba(0,0,0,0.6)'
      }}>
        <img src={imgs[0]} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
             onError={(e) => { e.target.src = '/image/placeholder.jpg'; }} />
      </div>

      {/* 3. الوصف */}
      <div style={{ marginBottom: 24 }}>
        {descParagraphs.map((p, i) => (
          <p key={i} style={{ 
            color: '#ddd', fontSize: '1rem', lineHeight: 1.7, marginBottom: 12,
            padding: i === 0 ? '10px 14px' : 0,
            background: i === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
            borderRadius: 8, borderLeft: (i === 0 && !isRtl) ? '3px solid #FFD700' : 'none',
            borderRight: (i === 0 && isRtl) ? '3px solid #FFD700' : 'none'
          }}>
            {p}
          </p>
        ))}
      </div>

      {/* 4. خيارات الضمان (إذا وجدت) */}
      {categories.length > 0 && (
        <div style={{ marginBottom: 24, background: '#111', padding: 16, borderRadius: 12, border: '1px solid #333' }}>
          <h4 style={{ color: '#FFD700', marginBottom: 12, fontSize: '1.1rem' }}>{isRtl ? 'الفئات والضمان' : 'Categories & Warranty'}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
            {categories.map((c, i) => (
              <div key={i} style={{ padding: '10px', background: '#1c1c1c', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#fff', fontSize: '0.95rem' }}>{c.name}</span>
                <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{c.warranty}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. نظرة عامة وتفاصيل (النص الطويل الذي كان يختفي أو يظهر بشكل سيء) */}
      {overviewText && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: 10 }}>{isRtl ? 'تفاصيل إضافية' : 'More Details'}</h3>
          <div style={{ 
            color: '#ccc', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', 
            background: 'rgba(255,255,255,0.02)', padding: 14, borderRadius: 10 
          }}>
            {overviewText}
          </div>
        </div>
      )}

      {/* 6. المميزات (تم إصلاح النقاط المزدوجة هنا) */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ color: '#FFD700', marginBottom: 10 }}>{isRtl ? 'المميزات' : 'Features'}</h4>
        <FeatureList items={features} />
      </div>

      {/* 7. باقي الصور */}
      {imgs.length > 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {imgs.slice(1).map((src, idx) => (
            <div key={idx} style={{ height: 160, borderRadius: 10, overflow: 'hidden' }}>
              <img src={src} alt={`Extra ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                   onError={(e) => { e.target.src = '/image/placeholder.jpg'; }} />
            </div>
          ))}
        </div>
      )}

      {/* 8. الأزرار */}
      {ActionButtons}
    </div>
  );

  return (
    <div style={{ background: '#0b0b0b', color: '#eee', minHeight: '100vh', paddingBottom: 80, paddingTop: 20 }} dir={isRtl ? 'rtl' : 'ltr'}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 20px' }}>
        {HeaderNav}
        {isMobileOrTablet ? <MobileLayout /> : <DesktopLayout />}
      </div>
    </div>
  );
}