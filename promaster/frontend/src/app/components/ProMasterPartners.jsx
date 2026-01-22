// components/ProMasterPartners.jsx
'use client';

import React from 'react';
import styles from './ProMasterPartners.module.css';
import LogoMarquee from './LogoMarquee'; // استدعاء مكون الشريط

export default function ProMasterPartners() {
    return (
        <section className={styles.partnersSection}>
            {/* المحتوى النصي في المنتصف */}
            <div className={styles.contentWrapper}>
                <h2 className={styles.mainText}>
                    TRUSTED BY INDUSTRY LEADERS & GLOBAL PARTNERS
                </h2>
                <p className={styles.subText}>
                    Our dedication to excellence ensures we partner only with brands that meet the highest standards of quality and innovation in car care.
                </p>
            </div>
            
            {/* شريط اللوغوهات المتحرك */}
            <LogoMarquee />

        </section>
    );
}