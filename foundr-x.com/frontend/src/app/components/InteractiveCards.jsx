// components/InteractiveCards.jsx
"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./InteractiveCards.module.css";

const cardsData = [
  { id: 1, title: "Charlotte", price: "3,840 €", image: "https://picsum.photos/id/1018/1200/800", thumb: "https://picsum.photos/id/1018/400/300" },
  { id: 2, title: "Reno",      price: "3,950 €", image: "https://picsum.photos/id/1015/1200/800", thumb: "https://picsum.photos/id/1015/400/300" },
  { id: 3, title: "Lars",      price: "2,880 €", image: "https://picsum.photos/id/1025/1200/800", thumb: "https://picsum.photos/id/1025/400/300" },
  { id: 4, title: "Chelsea",   price: "3,670 €", image: "https://picsum.photos/id/1035/1200/800", thumb: "https://picsum.photos/id/1035/400/300" }
];

export default function InteractiveCards() {
  const [active, setActive] = useState(0);
  const scrollerRef = useRef(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const items = scroller.querySelectorAll("[data-index]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number(entry.target.dataset.index));
          }
        });
      },
      { root: scroller, threshold: 0.6 }
    );

    items.forEach((it) => obs.observe(it));
    return () => obs.disconnect();
  }, []);

  return (
    <section className={styles.wrapper}>
      <div className={styles.hero}>
        <AnimatePresence mode="wait">
          <motion.img
            key={cardsData[active].id}
            src={cardsData[active].image}
            alt={cardsData[active].title}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45 }}
            className={styles.heroImg}
          />
        </AnimatePresence>
      </div>

      <div className={styles.controls}>
        <div className={styles.scroller} ref={scrollerRef} aria-label="items">
          {cardsData.map((c, i) => (
            <div
              key={c.id}
              data-index={i}
              className={`${styles.card} ${i === active ? styles.active : ""}`}
            >
              <img src={c.thumb} alt={c.title} />
              <div className={styles.cardInfo}>
                <h4>{c.title}</h4>
                <p>{c.price}</p>
              </div>
            </div>
          ))}
        </div>

        <motion.form
          className={styles.form}
          initial={{ opacity: 0, y: 16 }}
          animate={active === cardsData.length - 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.45 }}
        >
          <h3>Schedule a demo</h3>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <textarea placeholder="Message" rows="3" />
          <button type="submit">Send</button>
        </motion.form>
      </div>
    </section>
  );
}
