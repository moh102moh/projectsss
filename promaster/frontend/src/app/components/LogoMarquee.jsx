// components/LogoMarquee.jsx
import React from 'react';
import styles from './ProMasterPartners.module.css';

// مسارات الشعارات الافتراضية - (يرجى تعديلها حسب موقعها في مشروعك)
const LOGO_PATHS = [
    '/image/fa.png', // مسار 1
    '/image/to.png',     // مسار 2
    '/image/kia.png',      // مسار 3
    '/image/au.jfif', // مسار 4
    '/image/ma.jfif',     // مسار 5
    '/image/ra.jfif',    // مسار 6
];

// دالة Render Logos: لإنشاء قائمة الشعارات (مرتين)
const renderLogos = () => {
    // نكرر القائمة مرتين: القائمة الأصلية + نسخة مطابقة لها
    // هذا التكرار ضروري لعمل animation: scroll-left 50% بسلاسة
    const logos = [...LOGO_PATHS, ...LOGO_PATHS];
    
    return logos.map((path, index) => (
        <div key={index} className={styles.logoItem}>
            {/* استخدام alt نصي يصف الشعار مهم لتحسين الوصول */}
            <img 
                src={path} 
                alt={`Partner Logo ${index % LOGO_PATHS.length + 1}`} 
            />
        </div>
    ));
};

export default function LogoMarquee() {
    return (
        <div className={styles.marqueeContainer}>
            <div className={styles.marqueeContent}>
                {renderLogos()}
            </div>
        </div>
    );
}