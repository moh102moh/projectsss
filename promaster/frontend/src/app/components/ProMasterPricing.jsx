"use client";
import React, { useState, useEffect } from "react";
import styles from "./ProMasterPricing.module.css";

export default function ProMasterPricing() {
  // قراءة اللغة من localStorage مثل بقية الصفحات
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pm_lang") || "en";
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("pm_lang", lang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "ar" ? "ar" : "en";
    }
  }, [lang]);

  // الترجمات لكل النصوص
  const t = {
    en: {
      headerTitle: "OUR PACKAGES",
      headerDesc:
        "Explore our premium car care packages designed to protect, enhance, and maintain your vehicle's performance and appearance.",
      bookBtn: "BOOK NOW",
      packages: [
        {
          title: "Economy Package",
          price: "2594 RIYALS",
          features: [
            "ULTRA class thermal insulator",
            "Master Guard Standard Front Protection",
            "Nano Silent",
            "Nano ceramic for rims",
            "Nano ceramic for glass",
            "Interior cabin protection",
            "Plastic pedal covers",
            "Security windshield protection",
          ],
        },
        {
          title: "Economy Package",
          price: "2494 RIYALS",
          features: [
            "ULTRA class thermal insulator",
            "Master Guard Standard Front Protection",
            "Nano Silent",
            "Nano ceramic for rims",
            "Nano ceramic for glass",
            "Interior cabin protection",
            "Plastic pedal covers",
            "Security windshield protection",
          ],
        },
        {
          title: "Master Express Package",
          price: "1999 RIYALS",
          features: [
            "ULTRA class thermal insulator",
            "Master Guard Standard Front Protection",
            "Interior nano ceramic",
            "Nano Ceramic Sealant Exterior",
            "Plastic pedal covering",
          ],
        },
        {
          title: "Premium Shield",
          price: "3200 RIYALS",
          features: [
            "Full body protection",
            "Ceramic Pro 9H",
            "Interior deep clean",
            "Rim coating",
            "Windshield protection",
          ],
        },
        {
          title: "Gold Package",
          price: "4500 RIYALS",
          features: [
            "Lifetime warranty",
            "Annual maintenance",
            "Scratch resistance",
            "High gloss finish",
            "Leather treatment",
          ],
        },
        {
          title: "Silver Package",
          price: "1500 RIYALS",
          features: [
            "Exterior polishing",
            "Interior vacuum",
            "Wax coating",
            "Tire dressing",
            "Window cleaning",
          ],
        },
        {
          title: "Basic Wash",
          price: "500 RIYALS",
          features: [
            "Hand wash",
            "Tire shine",
            "Interior dusting",
            "Glass cleaning",
            "Quick wax",
          ],
        },
        {
          title: "Detailing Pro",
          price: "2800 RIYALS",
          features: [
            "Engine bay cleaning",
            "Seat shampoo",
            "Carpet extraction",
            "Odor removal",
            "Headlight restoration",
          ],
        },
        {
          title: "Ultimate Care",
          price: "5500 RIYALS",
          features: [
            "All-inclusive service",
            "Pick-up & Drop-off",
            "Loaner car",
            "Premium ceramic coating",
            "Full interior detail",
          ],
        },
      ],
    },
    ar: {
      headerTitle: "باقاتنا",
      headerDesc:
        "استكشف باقات العناية بالسيارات المميزة لدينا المصممة لحماية مركبتك وتحسين أدائها ومظهرها.",
      bookBtn: "احجز الآن",
      packages: [
        {
          title: "باقة اقتصادية",
          price: "2594 ريال",
          features: [
            "عازل حراري من فئة ULTRA",
            "حماية أمامية قياسية Master Guard",
            "ناانو صامت",
            "طلاء نانو للإطارات",
            "طلاء نانو للزجاج",
            "حماية المقصورة الداخلية",
            "غطاء دواسات بلاستيكي",
            "حماية الزجاج الأمامي",
          ],
        },
        {
          title: "باقة اقتصادية",
          price: "2494 ريال",
          features: [
            "عازل حراري من فئة ULTRA",
            "حماية أمامية قياسية Master Guard",
            "ناانو صامت",
            "طلاء نانو للإطارات",
            "طلاء نانو للزجاج",
            "حماية المقصورة الداخلية",
            "غطاء دواسات بلاستيكي",
            "حماية الزجاج الأمامي",
          ],
        },
        {
          title: "باقة ماستر إكسبرس",
          price: "1999 ريال",
          features: [
            "عازل حراري من فئة ULTRA",
            "حماية أمامية قياسية Master Guard",
            "طلاء نانو داخلي",
            "طلاء نانو خارجي Sealant",
            "غطاء دواسات بلاستيكي",
          ],
        },
        {
          title: "درع بريميوم",
          price: "3200 ريال",
          features: [
            "حماية الجسم بالكامل",
            "Ceramic Pro 9H",
            "تنظيف داخلي عميق",
            "طلاء الإطارات",
            "حماية الزجاج الأمامي",
          ],
        },
        {
          title: "الباقة الذهبية",
          price: "4500 ريال",
          features: [
            "ضمان مدى الحياة",
            "صيانة سنوية",
            "مقاومة الخدوش",
            "لمسة نهائية لامعة",
            "معالجة الجلد",
          ],
        },
        {
          title: "الباقة الفضية",
          price: "1500 ريال",
          features: [
            "تلميع خارجي",
            "تنظيف داخلي بالفراغ",
            "طلاء شمع",
            "تلميع الإطارات",
            "تنظيف الزجاج",
          ],
        },
        {
          title: "غسيل أساسي",
          price: "500 ريال",
          features: [
            "غسيل يدوي",
            "تلميع الإطارات",
            "تنظيف داخلي",
            "تنظيف الزجاج",
            "شمع سريع",
          ],
        },
        {
          title: "تلميع احترافي",
          price: "2800 ريال",
          features: [
            "تنظيف المحرك",
            "تنظيف المقاعد",
            "استخراج السجاد",
            "إزالة الروائح",
            "ترميم المصابيح الأمامية",
          ],
        },
        {
          title: "العناية القصوى",
          price: "5500 ريال",
          features: [
            "خدمة شاملة",
            "استلام وتسليم السيارة",
            "سيارة بديلة",
            "طلاء سيراميك مميز",
            "تنظيف داخلي كامل",
          ],
        },
      ],
    },
  };

  return (
    <div className={styles.container} dir={lang === "ar" ? "rtl" : "ltr"}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span>{t[lang].headerTitle.split(" ")[0]}</span>{" "}
          {t[lang].headerTitle.split(" ").slice(1).join(" ")}
        </h1>
        <p className={styles.desc}>{t[lang].headerDesc}</p>
      </header>

      <div className={styles.grid}>
        {t[lang].packages.map((pkg, index) => (
          <div key={index} className={styles.card}>
            <div>
              <h3 className={styles.cardTitle}>{pkg.title}</h3>
              <div className={styles.cardPrice}>{pkg.price}</div>
              <ul className={styles.featuresList}>
                {pkg.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>

            <button className={styles.bookBtn}>
              {t[lang].bookBtn}
              <span className={styles.arrowIcon}>↗</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
