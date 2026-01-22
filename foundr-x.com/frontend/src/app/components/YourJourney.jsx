"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./YourJourney.module.css";

export default function YourJourney() {
  const footerRef = useRef(null);

  useEffect(() => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <section ref={footerRef} className={styles.footerSection}>
      <div className={styles.footerContent}>
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className={styles.footerTitle}
        >
          FOUNDER X
        </motion.h1>

        <motion.div
          className={styles.footerLinks}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <a href="#" target="_blank">INSTAGRAM</a>
          <a href="#" target="_blank">FACEBOOK</a>
          <a href="#" target="_blank">SNAPCHAT</a>
          <a href="#" target="_blank">LINKEDIN</a>
          <a href="#" target="_blank">TIKTOK</a>
          <a href="#" target="_blank">TERMS & CONDITIONS</a>
          <a href="#" target="_blank">LET’S TALK</a>
        </motion.div>

        <p className={styles.footerCopy}>© 2025 FOUNDER X. All rights reserved.</p>
      </div>
    </section>
  );
}
