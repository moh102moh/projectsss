import React, { useState } from "react";
import styles from "./idef.module.css";

const logos = [
  {
    id: 1,
    title: "Ropicks",
    desc: "Ropicks هي منصة تجارة إلكترونية تقنية، تمنحك تجربة تسوق ذكية تضم كل ما تحتاجه في عالم التكنولوجيا، وصولًا إلى أحدث الابتكارات الإلكترونية.نجمع بين التنوع والجودة والابتكار في مكان واحد، لتجد كل ما تبحث عنه من أجهزة ذكية، وإكسسوارات إلكترونية، وأدوات تقنية حديثة تلبي احتياجاتك اليومية والمهنية.نحرص على أن تكون تجربتك سلسة، آمنة، وذكية بفضل نظام تسوق متطور يوفّر خيارات دفع مرنة، شحن سريع، وخدمة دعم فني متكاملة.",
    mainImage: "/image/IPAD_INTRO2.jpg",
    images: ["/image/WEB 2.jpg", "/image/WEB 1.jpg", "/image/WEB 3.jpg"],
    thumb: "/image/logo3 png.png",
    link: "https://www.behance.net/gallery/234728795/Ropicks-E-commerce", 
  },
  {
    id: 2,
    title: "Shafaq",
    desc: "يقدّم تطبيق شفق حلّ ذكي ومتكامل يهدف إلى تسهيل إدارة خدمات الإنترنت والمدفوعات الرقميةيجمع بين خدمات الموبايل، الراوتر، والواي فاي في نظام واحد، مع إمكانية سداد فواتير الإنترنت بسرعة وسلاسة.تم تطوير الفكرة لتطبيق موحد يتميز بواجهات حديثة تضع راحة المسـتخدم في المقام الأول، وتجمع الخدمات الأساسية في مكان واحد، ويلبي احتياجات فئات متعددة تشمل الأفراد، الشركات، الطلاب، الموظفيـن، ورواد الأعمال.",
    mainImage: "/image/3.jpg",
    images: ["/image/presentation1.jpg", "/image/presentation.png", "/image/presentation3.jpg"],
    thumb: "/image/logo.png",
    link: "https://www.behance.net/gallery/234728795/Shafaq-App", 
  },
  {
    id: 3,
    title: "Check In Syria",
    desc: "نحن في Check In Syria نؤمن أن حجز مكان للإقامة يجب أن يكون سهلاً مثل الرحلة نفسها. مهمتنا هي ربط المسافرين بأماكن إقامة مختارة بعناية تجمع بين الراحة، الثقافة، والانتماء. من خلال دمج التكنولوجيا الذكية مع فهم عميق للضيافة، نقدّم تجربة حجز سلسة وموثوقة، تتجاوز القوائم والأسعار لتمنحك شعوراً بالترحيب والانتماء أينما كنت. رحلتك تبدأ من هنا، ومع كل تشيك إن نصنع لك تجربة أكثر بساطة وإنسانية" ,
    mainImage: "/image/CISWEB6.jpg",
    images: ["/image/CISWEB2.jpg", "/image/CISWEB4.jpg", "/image/cisweb5.jpg"],
    thumb: "/image/logo1.png",
    link: "https://www.behance.net/gallery/234728795/الهوية", 
  },
];

export default function IdentitySection() {
  const [active, setActive] = useState(1);
  const [order, setOrder] = useState([0, 1, 2]);

  const handleClick = (index) => {
    if (index === 1) return;

    const newOrder = [...order];
    [newOrder[index], newOrder[1]] = [newOrder[1], newOrder[index]];
    setOrder(newOrder);
    setActive(newOrder[1]);
  };

  const activeLogo = logos[order[1]];

  return (
    <div className={styles.identitySection}>
      <div className={styles.logosBar}>
        {order.map((logoIndex, i) => {
          const logo = logos[logoIndex];
          const isActive = i === 1;
          return (
            <div
              key={logo.id}
              className={`${styles.logoContainer}`}
              onClick={() => handleClick(i)}
              style={{
                transform: isActive ? "scale(1.4)" : "scale(0.9) translateY(30px)",
                zIndex: isActive ? 10 : 1,
                transition: "all 0.6s ease",
              }}
            >
              <img src={logo.thumb} alt={logo.title} className={styles.logoThumb} />
            </div>
          );
        })}
      </div>

      <div className={styles.logoDetailsMain} dir="rtl">
        <h2 className={styles.logoTitle}>{activeLogo.title}</h2>
        <div className={styles.mainImageContainer}>
          <img
            src={activeLogo.mainImage}
            alt={activeLogo.title}
            className={styles.mainImage}
          />
          <a href={activeLogo.link} className={styles.arrowContainer} target="_blank" rel="noopener noreferrer">
            <span className={styles.arrowText}>للمزيد</span>
            <div className={styles.arrow}></div>
          </a>
        </div>
        <p className={styles.logoDesc}>{activeLogo.desc}</p>

        <div className={styles.threeImagesRow}>
          {activeLogo.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={activeLogo.title}
              className={styles.smallImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
