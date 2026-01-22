'use client';

import React, { useState, useRef, useEffect } from 'react';
import { services } from './servicesData.js';
import styles from './ProMasterServices.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// dynamic imports (kept as direct imports in your original)
import ProMasterAbout from "./ProMasterAbout.jsx";
import ProMasterStats from "./ProMasterStats.jsx";
import ProMasterContact from './ProMasterContact.jsx';
import ProMasterFooter from './ProMasterFooter.jsx';

const heroCards = [
  {
    title: 'New Product from Promaster',
    subtitle: 'Interior Ceramic An advanced interior ceramic coating specifically engineered to protect all interior surfaces of your vehicle.',
    title_ar: 'منتج جديد من بروماستر',
    subtitle_ar: 'طلاء سيراميك داخلي متطور مصمم لحماية جميع الأسطح الداخلية لمركبتك.',
    iconUrl: '/image/BOTT.png'
  },
  {
    title: 'Promaster New Year Offer!',
    subtitle: 'Celebrate the New Year with 40% OFF on all our services.A limited-time opportunity to experience premium car care standards.',
    title_ar: 'عرض السنة الجديدة من بروماستر!',
    subtitle_ar: 'احتفل بالعام الجديد بخصم 40% على جميع خدماتنا. فرصة محدودة لتجربة معايير العناية الفاخرة للسيارات.',
    iconUrl: '/image/ukguk.png'
  },
  {
    title: 'Complete Protection Package',
    subtitle: 'Comprehensive protection for your vehicle, including free flatbed pickup and delivery at no additional cost.',
    title_ar: 'باقة الحماية الكاملة',
    subtitle_ar: 'حماية شاملة لمركبتك، تشمل استلام وتسليم على سيارة سطح مجاني بدون تكلفة إضافية.',
    iconUrl: '/image/qqqq.png'
  },
];

const serviceCards = [
  {
    id: 1,
    num: '01',
    title: 'PPF (Paint Protection Film)',
    title_ar: 'أفلام الحماية المطاطية',
    description: 'High-flexibility, ultra-durable protective films precisely molded to wrap your vehicle’s body, shielding the original paint from scratches and daily wear. They provide a strong protective barrier that keeps your car looking new for as long as possible.',
    description_ar: 'أفلام حماية مرنة ومقاومة جداً مصممة لتغليف جسم السيارة لحماية الطلاء الأصلي من الخدوش والاهتراء اليومي. توفر حاجزًا قويًا يحافظ على مظهر سيارتك وكأنها جديدة.',
    images: ['/image/ppf.jpg','/image/55.jpeg','/image/56.jpeg','/image/57.jpeg','/image/58.jpeg'],
    video: '/image/vv.mp4'
  },
  {
    id: 2,
    num: '02',
    title: 'Nano Graphene Ceramic',
    title_ar: 'حماية الطلاء بتقنية الجرافين',
    description: 'An advanced coating technology based on nano particles that forms an exceptionally hard protective layer. It delivers superior resistance against scratches, fading, and harsh environmental contaminants, while adding a deep, glossy shine that enhances the paint and makes cleaning easier.',
    description_ar: 'تقنية طلاء متقدمة تعتمد على جزيئات نانو لتشكيل طبقة واقية صلبة للغاية. توفر مقاومة ممتازة للخدوش وتلاشي اللون والملوثات، وتمنح لمعانًا عميقًا يسهل تنظيفه.',
    images: ['/image/ceramic-graphene.jpg','/image/55.jpeg','/image/56.jpeg','/image/57.jpeg','/image/58.jpeg'],
    video: '/image/vv.mp4'
  },
  {
    id: 3,
    num: '03',
    title: 'CWF(Car Window Film)',
    title_ar: 'تظليل حراري للنوافذ',
    description: 'High-performance window films that give your car a refined appearance while providing effective insulation against heat and harmful UV rays. They ensure a more comfortable driving experience and protect the interior with optimal clarity in all conditions.',
    description_ar: 'طلاءات عالية الأداء للإطارات تعطي مظهرًا أنيقًا وتوفر مقاومة للحرارة والأشعة فوق البنفسجية الضارة. تضمن تجربة قيادة مريحة وتحمي الداخل بوضوح مثالي.',
    images: ['/image/window.jpg','/image/55.jpeg','/image/56.jpeg','/image/57.jpeg','/image/58.jpeg'],
    video: '/image/vv.mp4'
  },
  {
    id: 4,
    num: '04',
    title: 'Tire Coating',
    title_ar: 'حماية الإطارات',
    description: 'An innovative protection layer that combines rubberized coating with graphene oxide particles to create an exceptionally strong and glossy barrier. It increases surface hardness, boosts water repellency, and enhances resistance to weathering, giving your car a long-lasting, eye-catching shine.',
    description_ar: 'طبقة حماية مبتكرة تجمع بين طلاء مطاطي وجزيئات أكسيد الجرافين لخلق حاجز قوي ولامع. تزيد من صلابة السطح وتقاوم الماء وتمنح لمعانًا طويل الأمد.',
    images: ['/image/wheel.jpg','/image/55.jpeg','/image/56.jpeg','/image/57.jpeg','/image/58.jpeg'],
    video: '/image/wheel.jpg'
  },
  {
    id: 5,
    num: '05',
    title: 'Interior Chair',
    title_ar: 'تنجيد داخلي',
    description: 'Comprehensive upholstery solutions that include repairing, replacing, and upgrading your vehicle’s interior fabrics. We use premium materials and meticulous finishing to deliver enhanced comfort and a renewed, refined interior look that reflects your personal style.',
    description_ar: 'حلول شاملة لتنجيد المقاعد تتضمن الإصلاح والاستبدال والترقية بمواد فاخرة وتشطيبات دقيقة لتوفير راحة ومظهر داخلي أنيق.',
    images: ['/image/chair.jpg','/image/55.jpeg','/image/56.jpeg','/image/57.jpeg','/image/58.jpeg'],
    video: '/image/vv.mp4'
  },
  {
    id: 6,
    num: '06',
    title: 'Leather Flooring',
    title_ar: 'أرضيات جلد',
    description: 'Installation of high-definition dash cameras that record every moment of your journey. They provide added security, accurate incident documentation, and peace of mind with smart features and crystal-clear footage.',
    description_ar: 'تركيب كاميرات داش عالية الجودة لتسجيل كل لحظة. توفر أمانًا إضافيًا وتوثيقًا دقيقًا للحوادث وراحة بال مع لقطات واضحة.',
    images: ['/image/matt.jpg','/image/55.jpeg','/image/56.jpeg','/image/57.jpeg','/image/58.jpeg'],
    video: '/image/vv.mp4'
  },
  {
    id: 7,
    num: '07',
    title: 'Dash Cam',
    title_ar: 'داش كام',
    description: 'Luxurious leather flooring options designed to elevate your car’s interior with a premium touch. Highly durable and easy to maintain, making them an ideal choice for enhancing both the look and protection of your car’s cabin.',
    description_ar: 'خيارات أرضيات جلدية فاخرة لرفع مستوى داخلية سيارتك بلمسة راقية. متينة وسهلة الصيانة لحماية ومظهر أفضل.',
    images: ['/image/camera.jpg','/image/55.jpeg','/image/56.jpeg','/image/57.jpeg','/image/58.jpeg'],
    video: '/image/vv.mp4'
  },
  {
    id: 8,
    num: '08',
    title: 'Interior Sound & Heat Insulation',
    title_ar: 'عوازل صوت وحرارة داخل السيارة',
    description: 'A complete insulation system that reduces external noise and minimizes heat transfer into the cabin. It delivers a quieter, more comfortable driving experience—especially valuable in hot weather and busy traffic environments.',
    description_ar: 'نظام عزل كامل يقلل الضوضاء الخارجية ويقلل انتقال الحرارة إلى المقصورة. يمنح تجربة قيادة أهدأ وأكثر راحة، خاصة في الطقس الحار والزحام.',
    images: ['/image/noise.jpg','/image/55.jpeg','/image/56.jpeg','/image/57.jpeg','/image/58.jpeg'],
    video: '/image/vv.mp4'
  }
];

const reviewCards = [
  { name: 'ABDULRAHMAN Al',data:'منذ 5 أيام', text:'السلام عليكم ورحمة الله وبركاتهتجربتي في بروماستر كانت ممتازة منذ لحظة الاستقبال حتى تسليم السيارة. فريق العمل محترف للغاية ويستخدم أحدث التقنيات والمواد ذات الجودة العالية.الخدمة كانت سريعة ومنظمة، والأسعار كانت شفافة ومناسبة. بالإضافة إلى ذلك، لاحظت اهتماماً كبيراً بالتفاصيل مع ضمان نظافة السيارة على أعلى مستوى.أنصح به بشدة وشكر خاص لشيخ علي يعطيه العافيه على ُُحُسن التعامل' , avatar: '/image/ukguk.png' },
  
  { name: 'amar abdalhafez',data:'منذ 4 أيام', text: 'خدمة ممتازة ونوصي بهم بشدة ، والفنيين ممتازين والاخ الفاتح السوداني مسؤول الادارة تعامل ممتاز وخدمة جيدة ، واستفسرنا من باقي الخدمات لديهم شرحه وافي وملم بكل تفاصيل عمله', avatar: '/image/ukguk.png' },
  { name: 'sultan Khazaee',data:'منذ 3 أشهر', text: 'الصدق ، دقه ف المواعيد وسرعه تنفيذ ولباقه واحترام منهم وشغل الصدق يشكرون عليه ، شكرا لكم 🙏🤝 …', avatar: '/image/ukguk.png' },
    { name: 'سامي',data:'منذ شهر ', text: 'اشتغلت عندهم تلميع داخلي وخارجي وكانت السيارة بحالة صعبة شوي واخذ الشغل 3 أيام عمل وشغل مرضي  وشكرا للأخ عبدالعليم والستف الي شغالين معه على الشغل الجميل', avatar: '/image/ukguk.png' },

      { name: '/4\ kū',data:'منذ 6 أيام', text:'والله نتيجة ممتازة رحت اكثر من محل الصدق لفتني السعر مقابل الجودة وتوكلت على الله والحمدلله ما ندمت راح يتم التعديل ان ظهرت ملاحظات بعد التركيب ولكن للان كل شي ممتاز', avatar: '/image/ukguk.png' },

        { name: 'Sweet Heart',data:'منذ 12 يوم', text: ' ابدعتم بكل شي بصراحه من الوكاله عليكم شغلكم روعه واستقبال واهتمام بكل التفاصيل الاستاذه رزان والموظف المسؤول عن التسليم الله يعطيكم العافيه ولاغلطه', avatar: '/image/ukguk.png' },

          { name: 'Ansel Bantuas',data:' منذ 16 ساعة', text: ' Wow this pro master was amazing. They have a very clean satisfying job. Also they are really care about the client even they have a lot of client they make faster to finish  your car as soon as possible. Thank you so much specially to miss hanin for the amazing and very understandable explaination. More client to come. 🫡 …', avatar: '/image/ukguk.png' },

  { name: 'Sultan',data:'منذ شهرين ', text: 'ياناس ماشاءالله تبارك الرحمن شغلهم جووووده الوالد راضي بشكل عن الشغل والله لا احكي لكم  عن الاستاذ عبدالعليم والله اسلوب وتعامل واخلاق ياناس والله حطيت الموتر وانا مرتاح', avatar: '/image/ukguk.png' },
  { name: 'Anas Ali',data:'منذ يوم', text: 'شغلهم فن… وتركيبهم إتقان،التظليل مضبوط… وكأنه من المصنع مكان.العزل أمريكي… جودة ما لها مثيل،وسعرهم منافس… يخليك ترجع لهم كل جيل.وبعد الشغل… غسّلوا السيارة ونظفوها بإحسان،وأشكر الموظفة رزان والأستاذ عبد العليم على الاهتمام والمتابعة مع العميل بكل ود وامتنان.بصراحة… برو ماستر اسم على مسمى في كل زمان', avatar: '/image/ukguk.png' },
];

export default function ProMasterServices() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // language state: initialize from localStorage if available
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pm_lang') || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('pm_lang', lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
    }
  }, [lang]);

  const changeCard = (direction) => {
    setCurrentIndex(prev => {
      let newIndex = prev + direction;
      if (newIndex >= heroCards.length) newIndex = 0;
      if (newIndex < 0) newIndex = heroCards.length - 1;
      return newIndex;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => changeCard(1), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const activeCardData = heroCards[currentIndex];

  const reviewWrapperRef = useRef(null);
  const handleReviewHover = (isHovering) => {
    if (reviewWrapperRef.current) {
      reviewWrapperRef.current.style.animationPlayState = isHovering ? 'paused' : 'running';
    }
  };

  const doubledReviews = [...reviewCards, ...reviewCards];

  // helper to split first word (stable even if only one word)
  const splitFirstWord = (str) => {
    const parts = String(str).split(' ');
    const first = parts.shift();
    const rest = parts.join(' ');
    return { first, rest };
  };

  // translations for static texts
  const t = {
    en: {
      main: 'MAIN',
      gallery: 'GALLERY',
      about: 'ABOUT US',
      store: 'STORE',
      cert: 'CERTIFICATION',
      pricing: 'PRICING',
      contact: 'CONTACT US',
      goPrimary: 'Go Confidence',
      years: '12 Years Of Expertise',
      sub1: 'To Keep Your Car Protected',
      sub2: 'At The Highest Levels',
      ourServices: 'OUR SERVICES',
      servicesDesc: `We offer professional car care solutions that guarantee your vehicle superior protection, smart maintenance, and a refreshed appearance.`,
      reviewsDesc: `Your trust is the source of our excellence.`,
      mainBtn: 'Main',
      closeBtn: 'Close',
      requestService: 'Request service',
      serviceNumPrefix: 'Service #'
    },
    ar: {
      main: 'الرئيسية',
      gallery: 'المعرض',
      about: 'عن الشركة',
      store: 'المتجر',
      cert: 'الشهادات',
      pricing: 'الأسعار',
      contact: 'تواصل معنا',
      goPrimary: 'انطلق بثقة',
      years: '12 سنة من الخبرة',
      sub1: 'للحفاظ على سيارتك محمية',
      sub2: 'بأعلى المعايير',
      ourServices: 'خدماتنا',
      servicesDesc: `نقدّم حلول عناية احترافية تضمن لسيارتك حماية عالية، صيانة ذكية، ومظهراً متجدّداً.`,
      reviewsDesc: `ثقتكم مصدر تميّزنا `,
      mainBtn: 'الرئيسية',
      closeBtn: 'إغلاق',
      requestService: 'طلب الخدمة',
      serviceNumPrefix: 'الخدمة #'
    }
  };

  const openServicePage = (service) => {
    // نفتح صفحة الخدمة داخل app/router path اللي وضعته داخل components
    // المسار النهائي: /components/services/[id]?lang=...
    router.push(`/services/${service.id}?lang=${lang}`);
  };

  return (
    <div className={`${styles.wrapper} ${lang === 'ar' ? styles.rtl : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* HERO SECTION */}
      <div className={styles.heroSection}>
        {/* NAVBAR */}
        <nav className={styles.navbar}>
          <div className={styles.logo}><img src="/image/llogo.webp" alt="PROMASTER" /></div>

          <ul className={styles.navLinks}>
            <li><a href="#" className={styles.active}>{t[lang].main}</a></li>
            <li><a href="/gallery">{t[lang].gallery}</a></li>
            <li><a href="#about">{t[lang].about}</a></li>
            <li><a href="/store" >{t[lang].store}</a></li>
            <li><a href="/certificates" >{t[lang].cert}</a></li>
            <li><a href="/pricing">{t[lang].pricing}</a></li>
          </ul>

          <div className={styles.contactLink}>
            <a href="#contact-form" onClick={(e) => { e.preventDefault(); const contactSection = document.getElementById('contact-form'); if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' }); }}>{t[lang].contact}</a>
          </div>

          {/* language toggle */}
          <button
            className={styles.langToggle}
            onClick={() => setLang(prev => prev === 'en' ? 'ar' : 'en')}
            aria-label="Toggle language"
            title={lang === 'en' ? 'العربية' : 'English'}
          >
            {lang === 'en' ? 'ع' : 'EN'}
          </button>

          <button
            className={styles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>
        </nav>

        {/* SIDE MENU OVERLAY */}
        {mobileMenuOpen && (
          <div
            className={styles.sideMenuOverlay}
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className={styles.sideMenu} onClick={(e) => e.stopPropagation()}>
              <button className={styles.sideMenuClose} onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">×</button>

              <ul>
                <li><a href="#" className={styles.active}>{t[lang].main}</a></li>
                <li><a href="/gallery">{t[lang].gallery}</a></li>
                <li><a href="#about" onClick={() => setMobileMenuOpen(false)}>{t[lang].about}</a></li>
                <li><a href="/store" onClick={() => setMobileMenuOpen(false)}>{t[lang].store}</a></li>
                <li><a href="/certificates" onClick={() => setMobileMenuOpen(false)}>{t[lang].cert}</a></li>
                <li><a href="/pricing" onClick={() => setMobileMenuOpen(false)}>{t[lang].pricing}</a></li>
                <li>
                  <a href="#contact-form" onClick={(e) => {
                     e.preventDefault();
                     const contactSection = document.getElementById('contact-form');
                     if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
                     setMobileMenuOpen(false);
                  }}>{t[lang].contact}</a>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* HERO TEXT */}
        <div className={styles.heroText}>
          <h1 className={styles.goPrimary}>
            {t[lang].goPrimary}
            <span className={styles.inlineDots} aria-hidden="true">
              <span className={styles.dot}>•</span><span className={styles.dot}>•</span><span className={styles.dot}>•</span>
            </span>
          </h1>

          <h1 className={styles.whiteLarge}>{t[lang].years}</h1>

          <h1 className={styles.whiteLargeSub}>
            <span className={styles.yellowText}>{t[lang].sub1}</span>
            <span className={styles.yellowText}>{t[lang].sub2}</span>
          </h1>
        </div>

        {/* HERO VIDEO (background) */}
        <div className={styles.heroVideoWrapper} aria-hidden="true">
          <video
            className={styles.heroVideoDesktop}
            src="/image/carrrrrr.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <video
            className={styles.heroVideoMobile}
            src="/image/ccarr.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>

        {/* slider cards (positioned over video at right-bottom) */}
        <div className={styles.sliderStackContainer}>
          <div className={`${styles.glassCard} ${styles.emptyCard}`}>
            <div className={styles.emptyCardContent}>
              {heroCards[(currentIndex - 1 + heroCards.length) % heroCards.length][ lang === 'ar' && heroCards[(currentIndex - 1 + heroCards.length) % heroCards.length].title_ar ? 'title_ar' : 'title' ]}
            </div>
          </div>

          <div className={`${styles.glassCard} ${styles.activeCard}`}>
            <div className={styles.cardIcon}><img src={activeCardData.iconUrl} alt="icon" /></div>
            <div className={styles.cardText} key={currentIndex}>
              <h4>{ lang === 'ar' && activeCardData.title_ar ? activeCardData.title_ar : activeCardData.title }</h4>
              <h4>{ lang === 'ar' && activeCardData.subtitle_ar ? activeCardData.subtitle_ar : activeCardData.subtitle }</h4>
            </div>
            <div className={styles.navArrows}>
              <span className={styles.arrowBtn} onClick={() => changeCard(-1)}>▲</span>
              <span className={styles.arrowBtn} onClick={() => changeCard(1)}>▼</span>
            </div>
          </div>

          <div className={`${styles.glassCard} ${styles.emptyCard}`}>
            <div className={styles.emptyCardContent}>
              {heroCards[(currentIndex + 1) % heroCards.length][ lang === 'ar' && heroCards[(currentIndex + 1) % heroCards.length].title_ar ? 'title_ar' : 'title' ]}
            </div>
          </div>
        </div>
      </div>

      {/* SERVICES SECTION (immediately after hero, no extra gap) */}
      <div className={styles.servicesSection}>
        <div className={styles.servicesHeader}>
          <div className={styles.headerLeft}>
            {/* nowrapHeader prevents breaking on small screens */}
            <h2 className={styles.nowrapHeader}>
              {(() => {
                const { first, rest } = splitFirstWord(t[lang].ourServices);
                return (
                  <>
                    <span className={styles.yellow}>{first}</span>
                    {rest ? ` ${rest}` : ''}
                  </>
                );
              })()}
            </h2>
            <p>
              { t[lang].servicesDesc }
            </p>
          </div>
        </div>

        <div className={styles.servicesGrid}>
          {serviceCards.map((service) => (
            <div
              key={service.id}
              className={styles.serviceCard}
              role="button"
              tabIndex={0}
              onClick={() => openServicePage(service)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openServicePage(service); }}
              style={{cursor: 'pointer'}}
            >
              <div className={styles.cardNumber}>{service.num}</div>
              <img src={service.images[0]} alt={service.title} />
              <div className={styles.cardGradientOverlay}></div>
              <div className={styles.cardContent}>
                <h3>{ lang === 'ar' && service.title_ar ? service.title_ar : service.title }</h3>
                <span className={styles.arrowIcon}>↗</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className={styles.reviewsSection}>
        <div className={styles.headerLeft}>
          {/* ترجمة العنوان: OUR REVIEWS -> آراء عملائنا */}
          <h2>
            <span className={styles.yellow}>
              {lang === 'ar' ? 'آراء' : 'OUR'}
            </span>
            {lang === 'ar' ? ' عملائنا' : ' REVIEWS'}
          </h2>
          <p>{t[lang].reviewsDesc}</p>
        </div>

        {/* حاوية الحركة - ستظل LTR دائماً بفضل الـ CSS */}
        <div
          className={styles.reviewsScroller}
          onMouseEnter={() => handleReviewHover(true)}
          onMouseLeave={() => handleReviewHover(false)}
        >
          <div className={styles.reviewsWrapper} ref={reviewWrapperRef}>
            {doubledReviews.map((review, i) => (
              <div className={styles.reviewCard} key={`review-${i}`}>
                <div className={styles.reviewHeader}>
                  <img src={review.avatar} alt={review.name} className={styles.avatar} />
                  <div className={styles.reviewInfo}>
                    <h4>{review.name}</h4>
                    <div className={styles.stars}>★★★★★</div>
                    <span className={styles.reviewDate}>
                {review.data}
              </span>
                  </div>
                </div>
                <p>"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ABOUT / STATS / CONTACT / FOOTER */}
      <div id="about"><ProMasterAbout lang={lang} /></div>
      <div id="stats"><ProMasterStats lang={lang} /></div>
      <div id="contact-form"><ProMasterContact lang={lang} /></div>
      <div id="conta"><ProMasterFooter lang={lang} /></div>

      {/* المودال أُزيل بالكامل — الآن نفتح صفحة الخدمة بدلاً منه */}
    </div>
  );
}