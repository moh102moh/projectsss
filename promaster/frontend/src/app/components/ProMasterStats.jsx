// components/ProMasterStats.jsx
'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ProMasterStats.module.css';

gsap.registerPlugin(ScrollTrigger);

// بيانات إحصائيات بالإنجليزي + العربي
const statsData = [
    { target: 10000, suffix: 'K\u207A', label: { en: 'COSTUMERS', ar: 'العملاء' } },
    { target: 4, suffix: '', label: { en: 'AWARDS', ar: 'الجوائز' } },
    { target: 12, suffix: 'Y\u207A', label: { en: 'EXPERIENCE', ar: 'الخبرة' } },
    { target: 3, suffix: '', label: { en: 'BRANCHES', ar: 'الفروع' } },
];

const formatNumber = (num, suffix) => {
    if (suffix.includes('K')) {
        return (num / 1000).toFixed(0) + 'K' + (suffix.includes('\u207A') ? '\u207A' : '');
    }
    return num + suffix;
};

export default function ProMasterStats({ lang = 'en' }) { // lang: 'en' أو 'ar'
    const statsContainerRef = useRef(null);
    const countRefs = useRef([]);

    useEffect(() => {
        if (!statsContainerRef.current) return;

        ScrollTrigger.create({
            trigger: statsContainerRef.current,
            start: "top 80%",
            onEnter: () => {
                countRefs.current.forEach((ref, index) => {
                    if (ref) {
                        const targetValue = statsData[index].target;
                        const suffix = statsData[index].suffix;
                        gsap.fromTo(ref,
                            { innerHTML: 0 },
                            {
                                innerHTML: targetValue,
                                duration: 2,
                                ease: "power2.out",
                                snap: "innerHTML",
                                onUpdate: function() {
                                    ref.innerHTML = formatNumber(this.targets()[0].innerHTML, suffix);
                                }
                            }
                        );
                    }
                });
            },
            once: true,
        });

        return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }, []);

    return (
        <div 
            className={styles.statsSection} 
            ref={statsContainerRef}
            dir={lang === 'ar' ? 'rtl' : 'ltr'} // تحويل الاتجاه عند العربية
            style={{ textAlign: lang === 'ar' ? 'right' : 'center' }}
        >
            <div className={styles.statsGrid}>
                {statsData.map((stat, index) => (
                    <div className={styles.statCard} key={index}>
                        <div
                            className={styles.statNumber}
                            ref={el => countRefs.current[index] = el}
                        >
                            0
                        </div>
                        <div className={styles.statLabel}>
                            {lang === 'ar' ? stat.label.ar : stat.label.en}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
