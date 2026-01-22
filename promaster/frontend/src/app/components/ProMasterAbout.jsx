'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ProMasterAbout.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function ProMasterAbout({ lang }) {
    const canvasRef = useRef(null);
    const contentRef1 = useRef(null);
    const contentRef2 = useRef(null);
    const contentRef3 = useRef(null);
    const wrapperRef = useRef(null);

    // --- منطق اللغة ---


    // كائن الترجمة
    const t = {
        en: {
            journey_yellow: "OUR",
            journey_white: "JOURNEY",
            about_title: "ABOUT US",
            about_desc: "Promaster was founded in 2013 with a vision to keep pace with developments in the field of car care in the Kingdom of Saudi Arabia. Over the years, we have expanded our services while continuously improving our techniques and adopting the latest technologies to meet the growing demands of the automotive care market. Today, Promaster stands as a symbol of excellence, recognized for its commitment to delivering unparalleled car care services.",
            foundation_title: "FOUNDATION DAY",
            foundation_desc: "Promaster is one of the leading names in the field of car care in the Kingdom of Saudi Arabia, providing professional and comprehensive car care solutions with over 11 years of experience. We combine the latest technologies with precision and attention to detail, earning the trust of car enthusiasts seeking the highest standards of vehicle care.",
            experience_title: "EXPERIENCE",
            experience_desc: "At Promaster, we aspire to be the first choice for every car owner seeking the best care and protection services. Our goals include becoming the leading provider of comprehensive car care services in the Kingdom, delivering innovative and sustainable solutions, ensuring customer satisfaction, and continuously investing in the latest technologies and best industry practices."
        },
        ar: {
            journey_yellow: "رحلتنا",
            journey_white: "نحو التميز",
            about_title: "من نحن",
            about_desc: "تأسست بروماستر في عام 2013 برؤية لمواكبة التطورات في مجال العناية بالسيارات في المملكة العربية السعودية. على مر السنين، قمنا بتوسيع خدماتنا مع تحسين تقنياتنا باستمرار واعتماد أحدث التقنيات لتلبية المتطلبات المتزايدة لسوق العناية بالسيارات. واليوم، تقف بروماستر كرمز للتميز، ومعترف بها لالتزامها بتقديم خدمات عناية بالسيارات لا مثيل لها.",
            foundation_title: "يوم التأسيس",
            foundation_desc: "تعد بروماستر واحدة من الأسماء الرائدة في مجال العناية بالسيارات في المملكة العربية السعودية، حيث تقدم حلولاً احترافية وشاملة للعناية بالسيارات بخبرة تمتد لأكثر من 11 عاماً. نحن نجمع بين أحدث التقنيات والدقة والاهتمام بالتفاصيل، مما كسبنا ثقة عشاق السيارات الباحثين عن أعلى معايير العناية بالمركبات.",
            experience_title: "خبرتنا",
            experience_desc: "في بروماستر، نطمح لأن نكون الخيار الأول لكل مالك سيارة يبحث عن أفضل خدمات العناية والحماية. وتشمل أهدافنا أن نصبح المزود الرائد لخدمات العناية الشاملة بالسيارات في المملكة، وتقديم حلول مبتكرة ومستدامة، وضمان رضا العملاء، والاستثمار المستمر في أحدث التقنيات وأفضل الممارسات في الصناعة."
        }
    };

    useEffect(() => {
        if (!canvasRef.current || !wrapperRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 800;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.outputEncoding = THREE.sRGBEncoding;
        canvasRef.current.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 0.2));
        const keyLight = new THREE.DirectionalLight(0xffffff, 2);
        keyLight.position.set(5, 10, 10);
        scene.add(keyLight);
        const rimLight = new THREE.DirectionalLight(0xffffff, 1.5);
        rimLight.position.set(-10, 5, -5);
        scene.add(rimLight);
        const fillLight = new THREE.PointLight(0xffffff, 1.2, 100);
        fillLight.position.set(0, 2, 5);
        scene.add(fillLight);

        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        new RGBELoader().load(
            'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_indoor_clean_1k.hdr',
            (hdrEquirect) => {
                const envMap = pmremGenerator.fromEquirectangular(hdrEquirect).texture;
                scene.environment = envMap;
                hdrEquirect.dispose();
                pmremGenerator.dispose();
            }
        );

        let proModel = null;

        const handleResponsiveScale = () => {
            if (!proModel) return;
            const width = window.innerWidth;
            let s = 1;
            if (width <= 480) s = 0.6;
            else if (width <= 1024) s = 0.80;
            else s = 1;
            proModel.scale.set(s, s, s);
        };

        const loader = new GLTFLoader();
        loader.load(
            '/image/finall asset.glb',
            (glb) => {
                proModel = glb.scene;
                scene.add(proModel);

                proModel.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshPhysicalMaterial({
                            color: 0x5e460b,
                            metalness: 1.0,
                            roughness: 0.3,
                            reflectivity: 1.0,
                            clearcoat: 1.0,
                            clearcoatRoughness: 0.1,
                            envMapIntensity: 2.5,
                        });
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                handleResponsiveScale();
                window.addEventListener('resize', handleResponsiveScale);
                gsap.set(canvasRef.current, { opacity: 0 });

                ScrollTrigger.create({
                    trigger: wrapperRef.current,
                    start: "top 58%",
                    onEnter: () => gsap.set(canvasRef.current, { opacity: 1 }),
                    onLeaveBack: () => gsap.set(canvasRef.current, { opacity: 0 }),
                    invalidateOnRefresh: true
                });

                gsap.to(canvasRef.current, {
                    opacity: 0,
                    scrollTrigger: {
                        trigger: `.${styles.experienceSection}`,
                        start: "bottom 90%",
                        end: "bottom 60%",
                        scrub: true,
                        invalidateOnRefresh: true
                    }
                });

                modelMove();
                ScrollTrigger.refresh();
            },
            undefined,
            (err) => console.error('GLTF load error', err)
        );

        const arrPositionModel = [
            { id: 'banner', position: { x: 0, y: -20, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
            { id: 'about-us', position: { x: -70, y: -1, z: -5 }, rotation: { x: 0, y: 3.5, z: 0 } },
            { id: 'foundation-day', position: { x: 70, y: -1, z: -5 }, rotation: { x: 0, y: -0.7, z: 0 } },
            { id: 'experience', position: { x: -70, y: -1, z: 0 }, rotation: { x: 0, y: 0.5, z: 0 } },
        ];

        const modelMove = () => {
            if (!proModel) return;
            const sections = Array.from(document.querySelectorAll(`.${styles.section}`));
            if (!sections.length) return;

            const viewportCenter = window.innerHeight / 2;
            let closest = { id: 'banner', distance: Infinity };

            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                const sectionCenter = rect.top + rect.height / 2;
                const dist = Math.abs(sectionCenter - viewportCenter);
                if (dist < closest.distance) {
                    closest = { id: section.getAttribute('data-id'), distance: dist };
                }
            });

            const activePos = arrPositionModel.find((val) => val.id === closest.id) || arrPositionModel[0];
            if (activePos) {
                gsap.to(proModel.position, {
                    x: activePos.position.x,
                    y: activePos.position.y,
                    z: activePos.position.z,
                    duration: 1,
                    ease: "power1.out"
                });
                gsap.to(proModel.rotation, {
                    x: activePos.rotation.x,
                    y: activePos.rotation.y,
                    z: activePos.rotation.z,
                    duration: 1,
                    ease: "power1.out"
                });
            }
        };

        window.addEventListener('scroll', modelMove);

        const cardRefs = [contentRef1, contentRef2, contentRef3];
        cardRefs.forEach((ref, index) => {
            if (ref.current) {
                gsap.fromTo(ref.current,
                    { opacity: 0, x: index % 2 === 0 ? 100 : -100 },
                    {
                        opacity: 1, x: 0, duration: 1,
                        scrollTrigger: {
                            trigger: ref.current,
                            start: "top 80%",
                            end: "bottom 20%",
                            toggleActions: "play reverse play reverse",
                            invalidateOnRefresh: true
                        }
                    }
                );
            }
        });

        const handleResizeAndRefresh = () => {
            handleResponsiveScale();
            ScrollTrigger.refresh();
            modelMove();
        };

        window.addEventListener('resize', handleResizeAndRefresh);
        window.addEventListener('orientationchange', handleResizeAndRefresh);

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            window.removeEventListener('scroll', modelMove);
            window.removeEventListener('resize', handleResponsiveScale);
            window.removeEventListener('resize', handleResizeAndRefresh);
            window.removeEventListener('orientationchange', handleResizeAndRefresh);
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            try {
                if (canvasRef.current && renderer && renderer.domElement) {
                    canvasRef.current.removeChild(renderer.domElement);
                }
            } catch (e) {}
            try { renderer.dispose(); } catch (e) {}
        };

    }, []);

    return (
        <div 
            className={`${styles.aboutWrapper} ${lang === 'ar' ? styles.rtl : ''}`} 
            id="about-section" 
            ref={wrapperRef}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
            <div ref={canvasRef} className={styles.container3D}></div>

            {/* ===== Banner ===== */}
            <div className={styles.section} data-id="banner">
                <div className={styles.headerLeft}>
                    <h2>
                        <span className={styles.yellow}>{t[lang].journey_yellow}</span> {t[lang].journey_white}
                    </h2>
                </div>
            </div>

            {/* ===== About Us ===== */}
            <div className={`${styles.section} ${styles.aboutUsSection}`} data-id="about-us">
                <div className={styles.contentBox} ref={contentRef1}>
                    <div className={styles.cardHeader}>
                        <div className={styles.number}>01</div>
                        <div className={styles.name}>{t[lang].about_title}</div>
                    </div>

                    <div className={styles.description}>
                        <p>{t[lang].about_desc}</p>
                    </div>
                </div>
            </div>

            {/* ===== Foundation Day ===== */}
            <div className={`${styles.section} ${styles.foundationSection}`} data-id="foundation-day">
                <div className={styles.contentBox} ref={contentRef2}>
                    <div className={styles.cardHeader}>
                        <div className={styles.number}>02</div>
                        <div className={styles.name}>{t[lang].foundation_title}</div>
                    </div>

                    <div className={styles.description}>
                        <p>{t[lang].foundation_desc}</p>
                    </div>
                </div>
            </div>

            {/* ===== Experience ===== */}
            <div className={`${styles.section} ${styles.experienceSection}`} data-id="experience">
                <div className={styles.contentBox} ref={contentRef3}>
                    <div className={styles.cardHeader}>
                        <div className={styles.number}>03</div>
                        <div className={styles.name}>{t[lang].experience_title}</div>
                    </div>

                    <div className={styles.description}>
                        <p>{t[lang].experience_desc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}