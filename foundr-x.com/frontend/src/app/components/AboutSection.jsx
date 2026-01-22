"use client";

import React, { useState } from "react";
import styles from "./aboutSection.module.css";
import sectionsData from "./sectionsData";

export default function AboutSection() {
  const sectionNames = Object.keys(sectionsData);
  const [activeIndex, setActiveIndex] = useState(0);

  const cards = sectionsData[sectionNames[activeIndex]];

 
  const reversedCards = [...cards].reverse();


  const repeatedCards = [];
  const REPEAT_COUNT = 6;
  for (let i = 0; i < REPEAT_COUNT; i++) {
    
    repeatedCards.push(...reversedCards, { isSeparator: true });
  }

  return (
    <section id= "services" className={styles.container}>
      <div className={styles.aboutHeader}>
        <h1>خدماتنا</h1>
        <h2>
          <b>FOUNDR-X</b> شركة متخصصة في تقديم حلول التكنولوجيا والتطوير الشامل،
          تأسست في سوريا لتكون شريكاً استراتيجياً في رحلة التحوّل الرقمي.
        </h2>

      
        <div className={styles.buttonsRow}>
          {sectionNames.map((name, idx) => (
            <button
              key={name}
              className={`${styles.button} ${
                idx === activeIndex ? styles.active : ""
              }`}
              onClick={() => setActiveIndex(idx)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

   
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {repeatedCards.map((item, idx) =>
            item.isSeparator ? (
          
              <div className={styles.separatorBox} key={`sep-${idx}`}>
                <img src="/image/ll.png" alt="separator" />
              </div>
            ) : (
              <div className={styles.cardBox} key={idx}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
