"use client";
import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className={styles.footerContainer}>

      {/* =========================================
          DESKTOP VIEW 
      ========================================= */}
      <div className={styles.desktopWrapper}>

        {/* صورة اللوجو الضخمة */}
        <div className={styles.desktopLogoRow}>
          <Image 
            src="/image/png-37.png"
            alt="FOUNDR-X Logo"
            className={styles.desktopLogoImage}
            width={1600}
            height={400}
            priority
          />
        </div>

        {/* روابط السوشال النصية */}
   <div className={styles.desktopLinksText}>
     <a href="https://www.instagram.com/foundr_x_agency">Instagram</a>
  <a href="https://www.behance.net/foundrdesign1">Behance</a>
  <a href="https://www.facebook.com/share/1DgSYdvyAg" >Facebook</a>
  <a href="https://www.linkedin.com/company/foundr-x-business-company" >LinkedIn</a>
  <a href="https://www.snapchat.com/add/foundrx" >Snapchat</a>
  <a href="https://www.tiktok.com/@foundrx1">TikTok</a>
  <a href="https://www.youtube.com/@foundr_x">YouTube</a>
  <a href="https://www.behance.net/foundrdesign1">Behance</a>
   
</div>

        {/* معلومات */}
      <div className={styles.desktopContact}>
  <h3 className={styles.desktopContactHeader}>تواصل معنا</h3>

  <div className={styles.desktopContactRow}>
    <span>📧</span>
    <a href="mailto:Info@foundr-x.com">Info@foundr-x.com</a>
  </div>

  <div className={styles.desktopContactRow}>
    <span>📞</span>
    <a href="https://wa.me/963988959363">963-988959363+</a>
  </div>

  <div className={styles.desktopContactRow}>
    <span>📍</span>
    <p>دمشق، سوريا</p>

  </div>
       <p className={styles.footerCopy}>© 2025 FOUNDR-X. All rights reserved.</p>
</div>

      </div>

      {/* =========================================
          MOBILE VERSION (بدون تغيير)
      ========================================= */}
      <div className={styles.mobileWrapper}>
        <h1 className={styles.mobileTitle}>FOUNDR-X</h1>

        <div className={styles.mobileLinksRow}>
            <a href="https://www.instagram.com/foundr_x_agency">Instagram</a>
  <a href="https://www.behance.net/foundrdesign1">Behance</a>
  <a href="https://www.facebook.com/share/1DgSYdvyAg" >Facebook</a>
  <a href="https://www.linkedin.com/company/foundr-x-business-company" >LinkedIn</a>
          <a href="https://www.snapchat.com/add/foundrx">Snapchat</a>
          <a href="https://www.behance.net/foundrdesign1">Behance</a>
          <a href="https://www.tiktok.com/@foundrx1">Tiktok</a>
          <a href="https://www.youtube.com/@foundr_x">YouTube</a>
        </div>

        <div className={styles.mobileContact}>
          <h3 className={styles.contactHeader}>تواصل معنا</h3>

          <div className={styles.contactRow}>
            <span className={styles.icon}>📧</span>
            <a href="mailto:Info@foundr-x.com">Info@foundr-x.com</a>
          </div>

          <div className={styles.contactRow}>
            <span className={styles.icon}>📞</span>
            <a href="https://wa.me/963988959363">963-988959363+</a>
          </div>

          <div className={styles.contactRow}>
            <span className={styles.icon}>📍</span>
            <p>دمشق،سوريا</p>
          </div>
        </div>

        <p className={styles.footerCopy}>© 2025 FOUNDR-X. All rights reserved.</p>
      </div>
    </footer>
  );
}
