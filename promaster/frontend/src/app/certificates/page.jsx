// src/app/certificates/page.jsx
'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import '../globals.css';

import ProMasterCertificates from '../components/ProMasterCertificates.jsx';
import ProMasterFooter from '../components/ProMasterFooter.jsx';
import servicesStyles from '../components/ProMasterServices.module.css';

import { LanguageProvider, useLanguage } from '../components/LanguageProvider';

// Localized Navbar that consumes language from context
function Navbar() {
  const { lang, toggleLang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = {
    en: { main: 'MAIN', gallery: 'GALLERY', store: 'STORE', cert: 'CERTIFICATION', pricing: 'PRICING', contact: 'CONTACT' },
    ar: { main: 'الرئيسية', gallery: 'المعرض', store: 'المتجر', cert: 'الشهادات', pricing: 'الأسعار', contact: 'تواصل' }
  };

  return (
    <>
      <nav className={`${servicesStyles.navbar} ${lang === 'ar' ? servicesStyles.rtlNav : ''}`}>
        <div className={servicesStyles.logo}>
          <img src="/image/llogo.webp" alt="PROMASTER" />
        </div>

        <ul className={servicesStyles.navLinks}>
          <li><Link href="/" legacyBehavior><a className={servicesStyles.navLink}>{t[lang].main}</a></Link></li>
          <li><Link href="/gallery" legacyBehavior><a className={servicesStyles.navLink}>{t[lang].gallery}</a></Link></li>
          <li><Link href="/store" legacyBehavior><a className={servicesStyles.navLink}>{t[lang].store}</a></Link></li>
          <li>
            <Link href="/certificates" legacyBehavior>
              <a className={`${servicesStyles.navLink} ${servicesStyles.active}`}>{t[lang].cert}</a>
            </Link>
          </li>
          <li><Link href="/pricing" legacyBehavior><a className={servicesStyles.navLink}>{t[lang].pricing}</a></Link></li>
        </ul>

        <button
          className={servicesStyles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>

        <button
          className={servicesStyles.langToggle}
          onClick={toggleLang}
          aria-label="Toggle language"
          title={lang === 'en' ? 'العربية' : 'English'}
        >
          {lang === 'en' ? 'ع' : 'EN'}
        </button>
      </nav>

      {/* Side Menu */}
      {mobileMenuOpen && (
        <div
          className={servicesStyles.sideMenuOverlay}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className={servicesStyles.sideMenu} onClick={(e) => e.stopPropagation()}>
            <button className={servicesStyles.sideMenuClose} onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">×</button>

            <ul>
              <li><Link href="/" legacyBehavior><a onClick={() => setMobileMenuOpen(false)}>{t[lang].main}</a></Link></li>
              <li><Link href="/gallery" legacyBehavior><a onClick={() => setMobileMenuOpen(false)}>{t[lang].gallery}</a></Link></li>
              <li><Link href="/store" legacyBehavior><a onClick={() => setMobileMenuOpen(false)}>{t[lang].store}</a></Link></li>
              <li><Link href="/certificates" legacyBehavior><a className={servicesStyles.active} onClick={() => setMobileMenuOpen(false)}>{t[lang].cert}</a></Link></li>
              <li><Link href="/pricing" legacyBehavior><a onClick={() => setMobileMenuOpen(false)}>{t[lang].pricing}</a></Link></li>
              <li>
                <a href="#contact-form" onClick={(e) => {
                  e.preventDefault();
                  const contactSection = document.getElementById('contact-form');
                  if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}>{t[lang].contact}</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

// Wrapper that provides language context to the page
export default function CertificatesPageWrapper() {
  return (
    <LanguageProvider>
      <CertificatesPage />
    </LanguageProvider>
  );
}

// Actual page (consumes language from context and passes to child components)
function CertificatesPage() {
  const { lang } = useLanguage();

  return (
    <>
      <Head>
        <title>{lang === 'ar' ? 'PROMASTER | الشهادات' : 'PROMASTER | Certificates'}</title>
      </Head>

      <div className={servicesStyles.wrapper} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <Navbar />
        <ProMasterCertificates lang={lang} />
        <ProMasterFooter lang={lang} />
      </div>
    </>
  );
}
