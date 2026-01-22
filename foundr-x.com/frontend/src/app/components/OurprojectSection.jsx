"use client";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import IdentitySection from "./IdentitySection";
import styles from "./OurProject.module.css";

const OurprojectSection = () => {
  const [activeOverlay, setActiveOverlay] = useState(null);
  const router = useRouter();

  const folders = [
    { id: "f1", title: "مواقع إلكترونية", video: "/image/000.mp4", key: "web" },
    { id: "f2", title: "تطبيقات موبايل", video: "/image/0000.mp4", key: "app" },
    { id: "f3", title: "هويات بصرية", video: "/image/00000.mp4", key: "id" },
  ];


  const renderOverlay = () => {
    if (!activeOverlay) return null;

    return createPortal(
      <div className={styles.overlayRoot}>
        <div className={styles.overlayHeader}>
          <button
  className={styles.homeBtn}
  onClick={() => {
    window.location.href = "/";
  }}
>
  ⟵ الصفحة الرئيسية
</button>


          <button
            className={styles.backBtn}
            onClick={() => setActiveOverlay(null)}
          >
            ⟵ رجوع
          </button>
        </div>

        {activeOverlay === "web" && (
          <div className={styles.comingSoonWrap}>
            <h1 className={styles.comingSoonTitle}>Coming Soon</h1>
          </div>
        )}

        {activeOverlay === "app" && (
          <div className={styles.comingSoonWrap}>
            <h1 className={styles.comingSoonTitle}>Coming Soon</h1>
          </div>
        )}

        {activeOverlay === "id" && (
          <div className={styles.identityWrapper}>
            <IdentitySection />
          </div>
        )}
      </div>,
      document.body
    );
  };

  return (
    <section id="projects" className={styles.section} dir="rtl">
      <div className={styles.projectsTitle}>
        <h1>مشاريعنا</h1>
        <h2>
          الاستثمار في الابتكار الداخلي هو ما يمنحنا الريادة الحقيقية. لذلك،
          قمنا بإطلاق مشاريع رقمية مميزة تحمل بصمتنا الخاصة وتخدم قطاعات متعددة.
        </h2>
      </div>

      <div className={styles.cards}>
        {folders.map((f) => (
          <div
            key={f.id}
            className={styles.card}
            onClick={() => setActiveOverlay(f.key)}
          >
            <div className={styles.cardVideo}>
              <video
                src={f.video}
                autoPlay
                loop
                muted
                playsInline
                className={styles.video}
              />
            </div>
            <h2>{f.title}</h2>
          </div>
        ))}
      </div>

      {renderOverlay()}
    </section>
  );
};

export default OurprojectSection;
