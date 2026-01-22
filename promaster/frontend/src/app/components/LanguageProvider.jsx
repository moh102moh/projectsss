// src/app/components/LanguageProvider.jsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {}
});

export function LanguageProvider({ children, initial = null }) {
  const getInitial = () => {
    if (initial) return initial;
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

  const [lang, setLangState] = useState(getInitial);

  // central setter that syncs localStorage, document.lang and notifies same-tab listeners
  const setLang = (next) => {
    setLangState(next);
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('pm_lang', next); } catch (e) {}
      window.dispatchEvent(new CustomEvent('pm_lang_change', { detail: { pm_lang: next } }));
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next === 'ar' ? 'ar' : 'en';
    }
  };

  const toggleLang = () => setLang(lang === 'en' ? 'ar' : 'en');

  // keep in sync with external changes (other tabs or parts of the app)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onStorage = (e) => {
      if (e.key === 'pm_lang') setLangState(e.newValue || 'en');
    };
    const onCustom = (ev) => {
      if (ev && ev.detail && ev.detail.pm_lang) setLangState(ev.detail.pm_lang);
    };

    const docEl = document.documentElement;
    const mo = new MutationObserver(() => {
      const dl = docEl.lang && docEl.lang.startsWith('ar') ? 'ar' : 'en';
      setLangState(dl);
    });
    mo.observe(docEl, { attributes: true, attributeFilter: ['lang'] });

    window.addEventListener('storage', onStorage);
    window.addEventListener('pm_lang_change', onCustom);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('pm_lang_change', onCustom);
      mo.disconnect();
    };
  }, []);

  // ensure document.lang/localStorage reflect current state on first mount
  useEffect(() => {
    try { if (typeof window !== 'undefined') localStorage.setItem('pm_lang', lang); } catch (e) {}
    if (typeof document !== 'undefined') document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
  }, []); // run once

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
