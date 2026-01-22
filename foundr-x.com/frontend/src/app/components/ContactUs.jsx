"use client";
import React, { useState, useEffect, useState as useReactState } from "react";
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import { motion } from "framer-motion";
import styles from "./ContactUs.module.css";

export default function ContactUs() {
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [phone, setPhone] = useState("");
  const [isLargeScreen, setIsLargeScreen] = useReactState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1200);
    };
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const service = e.target.service.value;
    const description = e.target.description.value.trim();

    if (!name || !email || !phone || !description) {
      setFormStatus({ type: "error", message: "❌ يرجى تعبئة جميع الحقول المطلوبة." });
      return;
    }

    try {
      const response = await fetch("https://foundr-x.com/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, service, description }),
      });

      const data = await response.json();
      if (response.ok) {
        setFormStatus({ type: "success", message: "✅ تم إرسال النموذج بنجاح!" });
        e.target.reset();
        setPhone("");
      } else {
        setFormStatus({ type: "error", message: data.message || "❌ حدث خطأ أثناء الإرسال." });
      }
    } catch (err) {
      console.error(err);
      setFormStatus({ type: "error", message: "❌ لا يمكن الاتصال بالخادم حالياً." });
    }

    setTimeout(() => setFormStatus({ type: "", message: "" }), 2500);
  };

  return (
    <section className={styles.contactSection} id="contact">
      <div className={styles.container}>

        <motion.div
          className={styles.imageBox}
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <img src="/image/robot.png" alt="Contact Us" />
        </motion.div>

       
        {isLargeScreen ? (
          <motion.div
            className={styles.formBox}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <FormContent
              handleSubmit={handleSubmit}
              phone={phone}
              setPhone={setPhone}
              formStatus={formStatus}
            />
          </motion.div>
        ) : (
          <div className={styles.formBox}>
            <FormContent
              handleSubmit={handleSubmit}
              phone={phone}
              setPhone={setPhone}
              formStatus={formStatus}
            />
          </div>
        )}
          <div className={styles.divider}></div>
      </div>
    
    </section>
  );
}

function FormContent({ handleSubmit, phone, setPhone, formStatus }) {
  return (
    <>
      <h2>تواصل معنا</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" name="name" placeholder="الاسم الكامل" required />
        <input type="email" name="email" placeholder="البريد الإلكتروني" required />
        <div className={styles.phoneContainer}>
          <PhoneInput
            country={'sa'}
            preferredCountries={[
              'sy', 'sa', 'ae', 'eg', 'lb', 'jo', 'iq', 'kw', 'qa',
              'om', 'bh', 'ma', 'dz', 'tn', 'sd', 'ye', 'ps', 'mr', 'so', 'dj', 'ly'
            ]}
            enableSearch={true}
            inputProps={{
              name: 'phone',
              required: true,
              placeholder: 'رقم الموبايل',
            }}
            containerClass={styles.phoneInputContainer}
            inputClass={styles.phoneInput}
            buttonClass={styles.flagButton}
            value={phone}
            onChange={(value) => setPhone(value)}
          />
        </div>
        <select name="service" required>
          <option value="">اختر الخدمة</option>
          <option value="مواقع إلكترونية">مواقع إلكترونية</option>
          <option value="تطبيقات موبايل">تطبيقات موبايل</option>
          <option value="هويات بصرية">هويات بصرية</option>
        </select>
        <textarea name="description" placeholder="اكتب رسالتك..." required></textarea>
        <button type="submit">إرسال</button>
      </form>

      {formStatus.type && (
        <motion.div
          className={`${styles.status} ${formStatus.type === "success" ? styles.success : styles.error}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          {formStatus.message}
        </motion.div>
      )}
         
    </>
  );
}
