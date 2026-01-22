"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import styles from "./OurValues.module.css";

const videoTextSteps = [
  { left: { title: "الابتكار", desc: "نحوّل الأفكار إلى رؤى واقعية تغير المستقبل." }, right: { title: "التميز", desc: "هو ما يجعل كل مشروع يحمل بصمتنا الخاصة." } },
  { left: { title: "الثقة", desc: "نبنيها من خلال المصداقية والالتزام في كل تفصيل." }, right: { title: "السرعة", desc: "ننفذ بدقة وسرعة دون المساس بالجودة." } },
  { left: { title: "البساطة", desc: "هي جوهر كل ما نصممه ونبنيه." } },
];

const cardsData = [
  { id: 0, title: "مرحلة الاستكشاف", desc: "نغوص عميقًا في تفاصيل مشروعك لفهم رؤيتك وتحدياتك.", img: "/image/WHITE2.png" },
  { id: 1, title: "التخطيط الاستراتيجي", desc: "نصمم خطة تنفيذ ذكية ومتكاملة مبنية على أهداف واضحة.", img: "/image/BLACK3.png" },
  { id: 2, title: "الإبداع والتنفيذ", desc: "نحوّل الأفكار إلى إنجازات ملموسة من التصميم إلى البرمجة.", img: "/image/BLUE4.png" },
  { id: 3, title: "المتابعة والتطوير المستمر", desc: "نرافقك بخطوات ثابتة بعد الإطلاق لضمان نجاح مستدام.", img: "/image/ORANGE5.png" },
];

export default function OurValues() {
  const sectionRef = useRef(null);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const totalStages = 1 + videoTextSteps.length + 1 + cardsData.length;
  const imageStageStart = 1 + videoTextSteps.length;

  const [stage, setStage] = useState(0);
  const [stageProg, setStageProg] = useState(0);


  useEffect(() => {
    const onResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollTop = Math.max(0, -rect.top);
      const vh = window.innerHeight || windowSize.height || 1;
      const raw = scrollTop / vh;
      const st = Math.min(totalStages - 1, Math.floor(raw));
      const prog = Math.min(1, Math.max(0, raw - st));
      setStage(st);
      setStageProg(prog);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [windowSize.height, totalStages]);


  let videoOpacity = 1;
  if (stage > imageStageStart) videoOpacity = 0;
  else if (stage === imageStageStart) videoOpacity = Math.max(0, 1 - stageProg * 3.4);

  const cardWidth = windowSize.width < 900 ? 180 : 320;
  const cardGap = windowSize.width < 900 ? 28 : 120;

  const cardsProgressRaw = useMemo(() => {
    if (stage < imageStageStart + 1) return 0;
    const rel = (stage - (imageStageStart + 1)) + stageProg;
    const slowed = rel / 1.6;
    return Math.max(0, Math.min(cardsData.length, slowed));
  }, [stage, stageProg, imageStageStart]);

  const stepWidth = cardWidth + cardGap;
  const scrollerTranslatePx = +Math.min(cardsData.length, cardsProgressRaw) * stepWidth;
  const scrollerLeftPx = windowSize.width ? (windowSize.width / 2 - cardWidth / 2) : 0;

  const scrollerVisible = stage > imageStageStart && stage <= imageStageStart + 1 + cardsData.length;

  const imagePeelProgress = (index) => {
    const start = index * 0.5;
    const end = start + 1;
    const local = (cardsProgressRaw - start) / (end - start);
    return Math.min(1, Math.max(0, local));
  };

  const fadeStart = imageStageStart + 1 + cardsData.length - 0.9;
  const globalRaw = stage + stageProg;
  const endFadeProgress = Math.min(1, Math.max(0, (globalRaw - fadeStart) / 0.9));

  return (
    <section ref={sectionRef} className={styles.section} style={{ height: `${(totalStages + 1) * 100}vh` }}>
      <div className={styles.fixedWrapper}>

      {/* 🎥 الفيديو */}
<motion.video
  src={windowSize.width < 900 ? "/image/mobile.mp4" : "/image/xrotate.mp4"}
  autoPlay
  muted
  loop
  playsInline
  className={styles.bgVideo}
  style={{
    opacity:
      stage === imageStageStart
        ? Math.max(0, 1 - stageProg * 2.2)
        : stage > imageStageStart
        ? 0
        : 1,
    transition: "opacity 0.9s ease-in-out",
  }}
/>


{/* 🖼️ الصورة التي تظهر بعد الفيديو */}
<motion.div
  aria-hidden
  initial={{ opacity: 0, scale: 1.03 }}
  animate={{
    opacity:
      stage === imageStageStart
        ? stageProg
        : stage > imageStageStart && stage < imageStageStart + 1
        ? Math.max(0, 1 - stageProg * 1.5)
        : 0,
    scale:
      stage === imageStageStart
        ? 1
        : stage > imageStageStart
        ? 1.02
        : 1.03,
  }}
  transition={{ duration: 0.8, ease: "easeInOut" }}
  style={{
    position: "absolute",
    inset: 0,
    zIndex: 6,
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: `url(/image/WIRE1.png)`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "contain",
  }}
/>

{/* 📝 النصوص */}
<div className={styles.videoTextWrapper}>
  {videoTextSteps.map((step, index) => {
    const stepStage = index + 1;
    const isActive = stage === stepStage;
    return (
      <React.Fragment key={index}>
        <motion.div
          className={styles.textLeft}
          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -40 }}
          transition={{ duration: 0.45 }}
        >
          {step.left && (
            <>
              <h3>{step.left.title}</h3>
              <p>{step.left.desc}</p>
            </>
          )}
        </motion.div>
        <motion.div
          className={styles.textRight}
          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 40 }}
          transition={{ duration: 0.45 }}
        >
          {step.right && (
            <>
              <h3>{step.right.title}</h3>
              <p>{step.right.desc}</p>
            </>
          )}
        </motion.div>
      </React.Fragment>
    );
  })}
</div>



{stage > imageStageStart && stage + stageProg < imageStageStart + 1 + cardsData.length && (
  <div className={styles.imageStackWrapper} aria-hidden>
    {cardsData.map((c, idx) => {
      const peel = imagePeelProgress(idx);
      const clipRight = `${(1 - peel) * 100}%`;
      return (
        <motion.div
          key={"imgfull_" + idx}
          className={styles.imageFull}
          style={{
            backgroundImage: `url(${c.img})`,
            clipPath: `inset(0 0 0 ${clipRight})`,
            WebkitClipPath: `inset(0 0 0 ${clipRight})`,
            opacity: Math.max(0, 1 - (cardsProgressRaw - (cardsData.length - 0.4)) * 3),
            transition: "opacity 0.3s linear",
          }}
        />
      );
    })}
  </div>
)}

        {/* الكروت */}
        <div
          className={styles.cardScroller}
          style={{
            left: scrollerLeftPx,
            transform: `translateX(${scrollerTranslatePx}px)`,
            opacity: scrollerVisible ? 1 - endFadeProgress : 0,
            pointerEvents: scrollerVisible ? "auto" : "none",
          }}
        >
          {cardsData.map((c, idx) => {
            const offset = idx - cardsProgressRaw;
            const visible = offset >= -2 && offset <= 5;
            const translateX = (offset + 1) * (cardWidth + cardGap);
            const peel = offset >= 0 && offset <= 1 ? Math.min(1, offset * 2) : offset < 0 ? 1 : 0.3;

            return (
              <motion.div
                key={"card_" + idx}
                className={styles.card}
                style={{
                  opacity: visible
            ? idx === cardsData.length - 1
              ? 1 
              : 1 - Math.abs(offset) * 0.4
            : 0,
                transform: `translateX(${-translateX}px) translateY(${peel * -10}px) rotate(${peel * 1}deg)`,

                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  pointerEvents: visible ? "auto" : "none",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: visible ? 100 - Math.abs(offset) : 0,
                }}
              >
                <div className={styles.cardContent}>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

  
    </section>
  );
} 