"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <Image
            src="/image/png-36.png"
            alt="X-Foundr Logo"
            width={250}
            height={80}
            className="logo-img"
          />
        </Link>
      </div>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="toggle menu"
      >
        ☰
      </button>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <button
          className="close-btn"
          onClick={() => setMenuOpen(false)}
          aria-label="close menu"
        >
          ×
        </button>

        <ul className="nav-links">
          <li><Link href="/" onClick={() => setMenuOpen(false)}>الرئيسية</Link></li>
          <li><a href="#services" onClick={() => setMenuOpen(false)}>خدماتنا</a></li>
          <li><a href="#projects" onClick={() => setMenuOpen(false)}>مشاريعنا</a></li>
          <li><Link href="/packages" onClick={() => setMenuOpen(false)}>الباقات</Link></li>
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

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}
    </nav>
  );
}



