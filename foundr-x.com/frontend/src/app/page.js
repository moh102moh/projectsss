"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import "./globals.css";
import Image from "next/image";
import AboutSection from "./components/AboutSection";
import OurprojectSection from "./components/OurprojectSection";
import OurValues from "./components/OurValues";
import Footer from "./components/Footer";
import ContactUs from "./components/ContactUs";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div dir="rtl">
      {/* ==================== NAVBAR ==================== */}
      <nav className="navbar">
        <div className="navbar-logo">
  <a href="#home" onClick={() => setMenuOpen(false)}>
    <Image
      src="/image/png-36.png"
      alt="X-Foundr Logo"
      width={250}
      height={80}
      className="logo-img"
    />
  </a>
</div>


        {/* زر القائمة */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="toggle menu"
        >
          ☰
        </button>

        {/* روابط القائمة */}
        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          {/* زر الإغلاق */}
          <button
            className="close-btn"
            onClick={() => setMenuOpen(false)}
            aria-label="close menu"
          >
            ×
          </button>

          <ul className="nav-links">
            <li><a href="#home" onClick={() => setMenuOpen(false)}>الرئيسية</a></li>
            <li><a href="#services" onClick={() => setMenuOpen(false)}>خدماتنا</a></li>
            <li><a href="#projects" onClick={() => setMenuOpen(false)}>مشاريعنا</a></li>
            <li><a href="/packages" onClick={() => setMenuOpen(false)}>الباقات</a></li>
            <li><a href="#portfolio" onClick={() => setMenuOpen(false)}>مقالاتنا</a></li>
          </ul>

          <a
            href="#contact"
            className="contact-btn"
            onClick={() => setMenuOpen(false)}
          >
            تواصل معنا
          </a>
        </div>
      </nav>

      {/* خلفية غامقة لما القائمة مفتوحة */}
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}

      {/* ==================== HERO SECTION ==================== */}
      <section id="home" className="hero-section" style={{ position: "relative", zIndex: 100 }}>
        <div className="hero-content">
          <h1 className="hero-title">قُـــد الـتَـغـييــر</h1>
          <br />
          <h3 className="hero-subtitle">
            نُصمم المستقبل بلمسات خبراء فاوندر إكس لنضع نجاحك في المقام الأول
          </h3>
          <h3 className="hero-subtitle">
            ونصنع معاً هوية تحقق رؤيتك في عالم الأعمال.
          </h3>

          <div className="hero-button-container">
            <a
              href="https://wa.me/963988959363"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-button"
            >
              أحجز خدمة
            </a>
          </div>
        </div>

        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="/image/robot.mp4" type="video/mp4" />
          المتصفح لا يدعم تشغيل الفيديو.
        </video>
        <div className="hero-overlay"></div>
      </section>

      {/* باقي الأقسام */}
      <div style={{ position: "relative", zIndex: 100 }}>
        <AboutSection />
      </div>
      <div style={{ position: "relative", zIndex: 100 }}>
        <OurprojectSection />
      </div>
      <div style={{ position: "relative", zIndex: 4 }}>
        <OurValues />
      </div>
      <div style={{ position: "relative", zIndex: 3 }}>
        <ContactUs />
      </div>
      <div style={{ position: "relative", zIndex: 2 }}>
        <Footer />
      </div>
    </div>
  );
}
