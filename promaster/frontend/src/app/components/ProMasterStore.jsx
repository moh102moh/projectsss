'use client';

import React, { useState, useEffect, useRef } from "react";
import "./ProMasterStoreStyles.css";

// ProMasterStore.jsx — localized: reacts to `pm_lang` localStorage, document.documentElement.lang,
// or a passed prop `lang`. It preserves original logic and data; UI strings and category labels
// are translated when possible. Product-level Arabic fallbacks are used when provided on the product object.

export default function ProMasterStore({ lang: propLang = null }) {
  // initialize language: prefer prop, then localStorage, then document.lang, then 'en'
  const getInitialLang = () => {
    if (propLang) return propLang;
    if (typeof window !== 'undefined') {
      try {
        const s = localStorage.getItem('pm_lang');
        if (s) return s;
      } catch (e) { /* ignore */ }
      if (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang) {
        return document.documentElement.lang.startsWith('ar') ? 'ar' : 'en';
      }
    }
    return 'en';
  };

  const [lang, setLang] = useState(getInitialLang);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [brokenImgs, setBrokenImgs] = useState({});
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingProduct, setComingProduct] = useState(null);
  const loadedRef = useRef(new Set());

  // UI translations
  const t = {
    en: {
      bigSaleTitle: 'BIG SALE',
      bigSaleSub: 'ON FIRST PURCHASE',
      heroParagraph: 'THERE IS MANY OF OFFERS AND SALES SO CHECK THEM OUT NOW.',
      orderNow: 'ORDER NOW',
      categoryTitle: 'CATEGORY',
      allProducts: 'ALL PRODUCTS',
      noProducts: 'No products available in this category right now.',
      reviewsTextSuffix: 'REVIEWS',
      addedToCart: 'added to cart (demo).',
      modalHome: 'Home',
      modalBack: 'Back',
      comingSoon: 'COMING SOON',
      modalOrderNow: 'ORDER NOW',
      modalBook: 'BOOK SERVICE',
      main: 'Main',
      back: 'Back'
    },
    ar: {
      bigSaleTitle: 'تخفيضات كبرى',
      bigSaleSub: 'على أول عملية شراء',
      heroParagraph: 'هناك العديد من العروض والتخفيضات، تحقق منها الآن.',
      orderNow: 'اطلب الآن',
      categoryTitle: 'التصنيف',
      allProducts: 'جميع المنتجات',
      noProducts: 'لا توجد منتجات متوفرة في هذا التصنيف حالياً.',
      reviewsTextSuffix: 'مراجعات',
      addedToCart: 'أضيفت إلى السلة (تجريبي).',
      modalHome: 'الرئيسية',
      modalBack: 'رجوع',
      comingSoon: 'قريباً',
      modalOrderNow: 'اطلب الآن',
      modalBook: 'حجز خدمة',
      main: 'الرئيسية',
      back: 'رجوع'
    }
  };

  // categories with optional Arabic names
  const categories = [
    { id: "ALL", name: "ALL PRODUCTS", name_ar: 'جميع المنتجات' },
    { id: "FINISHING", name: "FINISHING", name_ar: 'التشطيب' },
    { id: "PPF", name: "PPF", name_ar: 'حماية الطلاء (PPF)' },
    { id: "CERAMIC", name: "CERAMIC", name_ar: 'سيراميك' },
    { id: "INTERIOR", name: "INTERIOR", name_ar: 'الداخلية' },
    { id: "POLISHING", name: "POLISHING", name_ar: 'تلميع' },
    { id: "SHAMPOO", name: "SHAMPOO", name_ar: 'شامبو' },
    { id: "WHEELS", name: "WHEELS", name_ar: 'العجلات' },
    { id: "WINDOW FILM", name: "WINDOW FILMS", name_ar: 'فيلم الزجاج' },
  ];

  // products (kept as original but with optional Arabic fields when helpful)
  const products = [
    { id: 1, category: "FINISHING", title: "PLASTIC TRIM CERAMIC", title_ar: 'طلاء بلاستيك', subTitle: "PLASTIC TRIM CERAMIC", price: "300 RIYALS", price_ar: '300 ريال', rating: 5, images: ["/image/Artboard1.jpg"], type: "FINISHING", desc: "طلاء نانوي للزجاج يوفر حماية ضد الخدوش والماء والملوثات. سهل التطبيق ويوفر رؤية أوضح أثناء المطر.", desc_en: 'Nano glass coating providing scratch, water and contaminant protection. Easy to apply and improves wet-weather visibility.', stories: [{ title: "قصة التطبيق", text: "تم تطبيقه على 40 سيارة خلال موسم الأمطار وقلل من نقاط المياه بنسبة 80%." }, { title: "Customer experience", text: "Customer Mohammed saw better night-time visibility after use." }] },
    { id: 2, category: "PPF", title: "DIAMOND SHLELD", title_ar: 'درع الماس', subTitle: "DIAMOND SHLELD", price: "150 RIYALS", price_ar: '150 ريال', rating: 5, images: ["/image/Artboard2.jpg"], type: "PPF", desc: "حماية متطورة للجلد مع مكونات ترطيبية تمنع التشقق وتحفظ مظهر الجلد لوقت طويل.", desc_en: 'Advanced protection with moisturizing ingredients to prevent cracking and preserve leather look.', stories: [{ title: "النتيجة خلال شهر", text: "الجلد حافظ على لونه ولم تظهر عليه تشققات بعد الاستخدام المتكرر." }, { title: "Technician tip", text: "Moisturize leather before application for best results." }] },
    { id: 3, category: "CERAMIC", title: "CERAMIC GRAPHENE", title_ar: 'سيراميك جرافين', subTitle: "CERAMIC GRAPHENE", price: "220 RIYALS", price_ar: '220 ريال', rating: 5, images: ["/image/Artboard3.jpg"], type: "CERAMIC", desc: "شمع نانو عالي التقنية يمنح لمعانًا عميقًا وحماية من الأشعة UV والرواسب لأسابيع.", desc_en: 'High-tech nano wax delivers deep shine and UV/residue protection for weeks.', stories: [{ title: "اختبار الطقس", text: "حافظ الشمع على لمعان السيارة بعد أسبوعين من التعرض للشمس." }, { title: "Quick trial", text: "Easy to apply and clean, popular among small workshops." }] },
    { id: 4, category: "INTERIOR", title: "INTERIOR CERAMIC", title_ar: 'سيراميك داخلي', subTitle: "INTERIOR CERAMIC", price: "450 RIYALS", price_ar: '450 ريال', rating: 5, images: ["/image/Artboard4.jpg"], type: "INTERIOR", desc: "طقم احترافي بتقنية الجرافين لصلابة 9H ومقاومة كيميائية ممتازة لمهنيي التلميع.", desc_en: 'Professional graphene kit with 9H hardness and excellent chemical resistance for detailers.', stories: [{ title: "ورشة محترفة", text: "استخدمه مهنيونا على 10 سيارات لنتائج ثابتة وطويلة الأمد." }, { title: "Notes", text: "Good for users wanting long-lasting protection without frequent re-application." }] },
    { id: 5, category: "POLISHING", title: "POLISHING MEDIUM", title_ar: 'تلميع متوسط', subTitle: "POLISHING MEDIUM", price: "80 RIYALS", price_ar: '80 ريال', rating: 5, images: ["/image/Artboard5.jpg"], type: "POLISHING", desc: "مجموعة مناديل مايكروفايبر ناعمة وممتصة — مناسبة للتلميع والتجفيف بدون خدش.", desc_en: 'Set of soft absorbent microfiber cloths — ideal for polishing and drying without scratching.' , stories: [{ title: "استخدام منزلي", text: "أصبحت هذه المناشف خيار الأسر للعناية بالسيارة أسبوعيًا." }, { title: "Cleaning", text: "Washes easily without losing softness." }] },
    { id: 6, category: "POLISHING", title: "POLISHING 4IN1", title_ar: 'تلميع 4 في 1', subTitle: "POLISHING 4IN1", price: "160 RIYALS", price_ar: '160 ريال', rating: 4, images: ["/image/Artboard6.jpg"], type: "POLISHING", desc: "بوليش نهائي يزيل الخدوش الخفيفة ويمنح سطحًا ناعمًا خالياً من دوامات الفرشاة.", desc_en: 'Final polish removes light scratches and leaves a swirl-free finish.', stories: [{ title: "قبل وبعد", text: "أزال علامات التلميع الطفيفة وأعاد اللمعان خلال جلسة واحدة." }] },
    { id: 7, category: "POLISHING", title: "POLISHING HEAVY", title_ar: 'تلميع ثقيل', subTitle: "POLISHING HEAVY", price: "190 RIYALS", price_ar: '190 ريال', rating: 5, images: ["/image/Artboard7.jpg"], type: "POLISHING", desc: "شمع هجين يجمع بين الحماية اللمعية وسهولة التطبيق للمستخدم العادي والمحترف.", desc_en: 'Hybrid wax combining protective shine and ease of use for both pros and consumers.' , stories: [{ title: "مدة الحماية", text: "حماية متوسطة إلى طويلة على حسب ظروف الاستخدام." }] },
    { id: 8, category: "POLISHING", title: "POLISHING MIRROR", title_ar: 'تلميع مرايا', subTitle: "POLISHING MIRROR", price: "320 RIYALS", price_ar: '320 ريال', rating: 5, images: ["/image/Artboard8.jpg"], type: "POLISHING", desc: "طقم تنظيف شامل مع أدوات وإكسسوارات للوصول لأدق الأماكن داخلياً وخارجياً.", desc_en: 'Comprehensive cleaning kit with tools and accessories to reach tight spots.' , stories: [{ title: "لماذا مفيد؟", text: "يجمع الأدوات الأساسية للمبتدئ والخبير بترتيب ذكي." }, { title: "تجربة", text: "عدد قليل من العملاء أبلغوا عن تحسن ملحوظ في مظهر الداخلية." }] },
    { id: 9, category: "FINISHING", title: "IRON REMOVER", title_ar: 'مزيل الحديد', subTitle: "IRON REMOVER", price: "95 RIYALS", price_ar: '95 ريال', rating: 4, images: ["/image/Artboard9.jpg"], type: "FINISHING", desc: "سبراي تعزيري لطلاء السيراميك يعطي طبقة حماية مؤقتة ولمعانًا سريعًا.", desc_en: 'Boost spray for ceramic paint giving temporary protection and quick shine.' , stories: [{ title: "سهل وسريع", text: "مناسب للموعد السريع قبل استلام السيارة." }] },
    { id: 10, category: "SHAMPOO", title: "CERAMIC SHAMPOO", title_ar: 'شامبو سيراميك', subTitle: "CERAMIC SHAMPOO", price: "75 RIYALS", price_ar: '75 ريال', rating: 4, images: ["/image/Artboard10.jpg"], type: "SHAMPOO", desc: "حماية التابلوه والمقابض من الشمس والتشقق دون لمعة مصطنعة.", desc_en: 'Protects dashboard and handles from sun and cracking without artificial shine.' , stories: [{ title: "نصائح", text: "امسح السطح أولًا ثم ضع طبقة رقيقة للحصول على نتيجة مطابقة." }] },
    { id: 11, category: "INTERIOR", title: "INTERIOR CLEANER", title_ar: 'منظف داخلي', subTitle: "INTERIOR CLEANER", price: "260 RIYALS", price_ar: '260 ريال', rating: 5, images: ["/image/Artboard11.jpg"], type: "INTERIOR", desc: "ممانع صدأ قوي للهيكل السفلي — مقاوم للماء والملح والمواد الكيميائية.", desc_en: 'Strong rust inhibitor for chassis — water, salt and chemical resistant.' , stories: [{ title: "الاختبار", text: "استخدم على سيارات في المناطق الساحلية وكانت النتائج ممتازة." }] },
    { id: 12, category: "PPF", title: "PPF MOUNTING LIQUID", title_ar: 'سائل التركيب PPF', subTitle: "PPF MOUNTING LIQUID", price: "25 RIYALS",price_ar: '25 ريال', rating: 5, images: ["/image/Artboard12.jpg"], type: "PPF", desc: "مطبّق عملي لتوزيع الشمع والطلاء بسهولة وبتحكم أفضل.", desc_en: 'Practical applicator for wax and polish distribution with better control.' , stories: [{ title: "سهولة التطبيق", text: "شكل مربع مريح للتحكم والضغط أثناء التوزيع." }] },
    { id: 13, category: "WHEELS", title: "WHEEL CLEANER", title_ar: 'منظف العجلات', subTitle: "WHEEL CLEANER", price: "40 RIYALS", price_ar: '40 ريال', rating: 4, images: ["/image/Artboard13.jpg"], type: "WHEELS", desc: "باد قطع لإزالة الخدوش العميقة قبل التنعيم واللمعان النهائي.", desc_en: 'Pads for removing deep scratches before final smoothing and shine.' , stories: [{ title: "مناسب للماكينات", text: "يعمل بشكل جيد مع ماكينات القطع المزدوجة." }] },
    { id: 14, category: "WHEELS", title: "TIRE COAT", title_ar: 'طلاء الإطارات', subTitle: "TIRE COAT", price: "110 RIYALS", price_ar: '110 ريال', rating: 4, images: ["/image/Artboard14.jpg"], type: "WHEELS", desc: "سبراي سيالنت لحماية سريعة تمنع التصاق الأوساخ وتسهّل التنظيف.", desc_en: 'Liquid sealant spray for quick protection that prevents dirt adhesion.' , stories: [{ title: "أداة سريعة", text: "خيار سريع لمن يريد حماية مؤقتة بين الجلسات." }] },
    { id: 15, category: "FINISHING", title: "TRIM SPRAY", title_ar: 'سبراي التشطيب', subTitle: "TRIM SPRAY", price: "50 RIYALS", price_ar: '50 ريال', rating: 5, images: ["/image/Artboard15.jpg"], type: "FINISHING", desc: "منظف زجاج يزيل الأوساخ والدهون من دون ترك خطوط.", desc_en: 'Glass cleaner removing dirt and grease without streaks.' , stories: [{ title: "أوصى به الفنيون", text: "مثالي للنوافذ الداخلية والخارجية قبل التلميع." }] },
    { id: 16, category: "INTERIOR", title: "LEATHER COAT", title_ar: 'طلاء الجلد', subTitle: "LEATHER COAT", price: "130 RIYALS", price_ar: '130 ريال', rating: 4, images: ["/image/Artboard16.jpg"], type: "INTERIOR", desc: "كيـت صيانة للحفاظ على مدة طلائ السيراميك مع أدوات تنظيف لطيفة.", desc_en: 'Maintenance kit to preserve ceramic coating longevity with gentle cleaners.' , stories: [{ title: "حافظ على المستقبل", text: "يضمن استمرارية فعالية الطلاء دون الحاجة لإعادة تطبيق متكرر." }] },
    { id: 17, category: "SHAMPOO", title: "WASH SOAP", title_ar: 'صابون غسيل', subTitle: "WASH SOAP", price: "90 RIYALS", price_ar: '90 ريال', rating: 4, images: ["/image/Artboard17.jpg"], type: "SHAMPOO", desc: "منعش للقماش يزيل الروائح ويخفف البقع بخطوة واحدة.", desc_en: 'Fabric refresher removing odors and light stains in one step.' , stories: [{ title: "نتيجة سريعة", text: "رائحة منعشة واستعادة نسيج القماش دون تلاشي." }] },
    { id: 18, category: "FINISHING", title: "CERAMIC DETAILS", title_ar: 'تفاصيل السيراميك', subTitle: "CERAMIC DETAILS", price: "60 RIYALS", price_ar: '60 ريال', rating: 5, images: ["/image/Artboard18.jpg"], type: "FINISHING", desc: "سبراي لمعان وإحكام للعجلات يحمي من التشقق والتلاشي.", desc_en: 'Shine and seal spray for wheels protecting against cracking and fading.' , stories: [{ title: "لمعان يدوم", text: "بعد التطبيق يبقى اللمعان لعدة أيام مع مقاومة الأمطار." }] },
    { id: 19, category: "PPF", title: "PAINT PROTECTION FILM", title_ar: 'فيلم حماية الطلاء', subTitle: "PAINT PROTECTION FILM", price: "70 RIYALS", price_ar: '70 ريال', rating: 5, images: ["/image/Artboard19.jpg"], type: "PPF", desc: "طقم فرش مختلفة الأحجام للوصول للأماكن الضيقة وتنظيفها بفاعلية.", desc_en: 'Kit of brushes of different sizes to reach tight areas effectively.' , stories: [{ title: "تفاصيل دقيقة", text: "يساعد على تنظيف الشقوق والمنافذ بدقة دون خدش." }] },
    { id: 20, category: "WINDOW FILM", title: "CAR WINDOW FILM", title_ar: 'فيلم زجاج السيارة', subTitle: "CAR WINDOW FILM", price: "60 RIYALS", price_ar: '60 ريال', rating: 5, images: ["/image/Artboard20.jpg"], type: "WINDOW FILM", desc: "طقم فرش مختلفة الأحجام للوصول للأماكن الضيقة وتنظيفها بفاعلية.", desc_en: 'Kit of brushes of different sizes to reach tight areas effectively.' , stories: [{ title: "تفاصيل دقيقة", text: "يساعد على تنظيف الشقوق والمنافذ بدقة دون خدش." }] },
  ];

  const filteredProducts = activeCategory === "ALL" ? products : products.filter((p) => p.type === activeCategory);

  // -----------------------
  // smart preloader logic (unchanged)
  // -----------------------
  useEffect(() => {
    let cancelled = false;

    const addPreloadLink = (url) => {
      try {
        if (!url || typeof document === 'undefined') return;
        if (document.querySelector(`head link[rel="preload"][href="${url}"]`)) return;
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);
      } catch (e) { /* ignore */ }
    };

    const preloadImage = (src) => new Promise((resolve) => {
      if (!src) return resolve(false);
      if (loadedRef.current.has(src)) return resolve(true);
      const img = new Image();
      img.onload = () => {
        loadedRef.current.add(src);
        resolve(true);
      };
      img.onerror = () => {
        setBrokenImgs(prev => ({ ...prev, [src]: true }));
        loadedRef.current.add(src);
        resolve(false);
      };
      img.src = src;
    });

    const preloadInBatches = async (urls = [], concurrency = 3) => {
      const q = urls.slice();
      const workers = new Array(Math.min(concurrency, q.length)).fill(null).map(async () => {
        while (q.length && !cancelled) {
          const url = q.shift();
          if (!url) continue;
          await preloadImage(url);
        }
      });
      await Promise.all(workers);
    };

    const heroAndSidebar = [
      '/images/product-bottle.png',
      '/image/Artboard22.jpg'
    ];

    const allProductImages = products.flatMap(p => (p.images || []));
    const unique = Array.from(new Set([...heroAndSidebar, ...allProductImages]));

    const priority = [];
    if (unique.length) {
      priority.push(unique[0]);
      for (let i = 0, count = 0; i < products.length && count < 6; i++) {
        const s = products[i].images && products[i].images[0];
        if (s && !priority.includes(s)) {
          priority.push(s);
          count++;
        }
      }
    }

    priority.forEach(addPreloadLink);

    (async () => {
      await preloadInBatches(priority, 4);
      if (cancelled) return;
      const remaining = unique.filter(u => !priority.includes(u));
      const doRemaining = () => preloadInBatches(remaining, 2);
      if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(() => { if (!cancelled) doRemaining(); }, { timeout: 2000 });
      } else {
        setTimeout(() => { if (!cancelled) doRemaining(); }, 1000);
      }
    })();

    return () => { cancelled = true; };

  }, []); // run once on mount

  // preload images when switching category
  useEffect(() => {
    let cancelled = false;
    const currentImages = (activeCategory === 'ALL' ? products : products.filter(p => p.type === activeCategory))
      .flatMap(p => (p.images || []));
    const unique = Array.from(new Set(currentImages));
    const preload = (url) => new Promise((res) => {
      if (!url) return res(false);
      if (loadedRef.current.has(url)) return res(true);
      const img = new Image();
      img.onload = () => { loadedRef.current.add(url); res(true); };
      img.onerror = () => { setBrokenImgs(prev => ({ ...prev, [url]: true })); loadedRef.current.add(url); res(false); };
      img.src = url;
    });

    (async () => {
      for (const url of unique) {
        if (cancelled) break;
        await preload(url);
      }
    })();

    return () => { cancelled = true; };
  }, [activeCategory]);

  // key handling
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (comingSoonOpen) closeComing();
        if (modalOpen) closeModal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [comingSoonOpen, modalOpen]);

  const renderStars = (count) => "★".repeat(count) + "☆".repeat(5 - count);

  function openModal(prod) {
    setSelectedProduct(prod);
    setGalleryIndex(0);
    setComingProduct(prod);
    setComingSoonOpen(true);
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedProduct(null);
    document.body.style.overflow = "";
  }

  function closeComing() {
    setComingSoonOpen(false);
    setComingProduct(null);
    setSelectedProduct(null);
    document.body.style.overflow = "";
  }

  function modalGoHome() {
    setActiveCategory("ALL");
    closeModal();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function comingGoHome() {
    setActiveCategory("ALL");
    closeComing();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // keep component in sync with external language changes:
  // 1) watch localStorage (if changed in other tabs), 2) watch document.documentElement.lang via MutationObserver.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onStorage = (e) => {
      if (e.key === 'pm_lang') {
        setLang(e.newValue || 'en');
      }
    };
    window.addEventListener('storage', onStorage);

    // observe document.lang changes (useful when other component sets document.documentElement.lang)
    const docEl = document.documentElement;
    const mo = new MutationObserver(() => {
      const dl = docEl.lang && docEl.lang.startsWith('ar') ? 'ar' : 'en';
      setLang(dl);
    });
    mo.observe(docEl, { attributes: true, attributeFilter: ['lang'] });

    // listen for a custom event (optionally dispatched by other components)
    const onCustom = (ev) => {
      if (ev && ev.detail && ev.detail.pm_lang) setLang(ev.detail.pm_lang);
    };
    window.addEventListener('pm_lang_change', onCustom);

    return () => {
      window.removeEventListener('storage', onStorage);
      mo.disconnect();
      window.removeEventListener('pm_lang_change', onCustom);
    };
  }, []);

  // also respond to propLang changes if provided
  useEffect(() => {
    if (propLang && propLang !== lang) setLang(propLang);
  }, [propLang]);

  // helpers to pick localized fields from product
  const getTitle = (p) => (lang === 'ar' ? (p.title_ar || p.title) : (p.title || p.title_ar));
  const getSub = (p) => (lang === 'ar' ? (p.subTitle_ar || p.subTitle) : (p.subTitle || p.subTitle_ar));
  const getPrice = (p) => (lang === 'ar' ? (p.price_ar || p.price) : (p.price || p.price_ar));
  const getDesc = (p) => (lang === 'ar' ? (p.desc || p.desc_en) : (p.desc_en || p.desc));

  return (
    <div className="pm-container" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* HERO */}
      <div className="heroGrid">
        <div
          className="bigBanner"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(0,0,0,0.75), rgba(0,0,0,0.95)), url('/images/product-bottle.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right bottom",
            backgroundColor: "#000",
          }}
        >
          <div className="bannerText">
            <h2>
              {t[lang].bigSaleTitle}
              <br />
              <span style={{ color: "#FFD700" }}>{t[lang].bigSaleSub}</span>
            </h2>
            <p>{t[lang].heroParagraph}</p>
            <button className="orderBtn">{t[lang].orderNow}</button>
          </div>
        </div>

        <div className="sideBanners">
          <div className="smallBanner" style={{ backgroundImage: "url('/image/Artboard22.jpg')" }}>
            <div className="smallBannerContent">
              <h3>
                {lang === 'ar' ? 'حماية العجلة' : 'PROTECT YOUR WHEEL'}
                <br />
                <span style={{ color: "#FFD700" }}>{lang === 'ar' ? 'بطلاء الإطارات' : 'WITH TIRE COAT'}</span>
              </h3>
              <button className="smallBtn">{t[lang].orderNow}</button>
            </div>
          </div>
          <div className="smallBanner" style={{ backgroundImage: "url('/image/Artboard22.jpg')" }}>
            <div className="smallBannerContent">
              <h3>
                {lang === 'ar' ? 'تنظيف داخلي عميق' : 'INTERIOR'}
                <br />
                <span style={{ color: "#FFD700" }}>{lang === 'ar' ? 'تنظيف داخلي عميق' : 'DEEP CLEANING'}</span>
              </h3>
              <button className="smallBtn">{t[lang].orderNow}</button>
            </div>
          </div>
        </div>
      </div>

      {/* STORE LAYOUT */}
      <div className="storeLayout">
        <aside className="sidebar">
          <div className="sidebarBox">
            <h3 className="sidebarTitle">{t[lang].categoryTitle}</h3>
            <ul className="categoryList">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className={`catItem ${activeCategory === cat.id ? "activeCat" : ""}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {lang === 'ar' ? (cat.name_ar || cat.name) : (cat.name || cat.name_ar)} <span>›</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="productsGrid" role="list">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((prod) => {
              const raw = prod.images && prod.images[0];
              const bgUrl = raw && !brokenImgs[raw] ? raw : "/images/product-bottle.png";
              return (
                <article
                  key={prod.id}
                  className="productCard bgCard"
                  role="listitem"
                  aria-label={getTitle(prod)}
                  onClick={() => openModal(prod)}
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.12), rgba(0,0,0,0.02)), url(${bgUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: "#0b0b0b",
                    willChange: "transform, opacity",
                    transform: "translateZ(0)",
                  }}
                >
                  <div className="cardOverlay" />
                  <div className="cardContent">
                    <div className="prodInfoTop">
                      <div className="prodCategory">{getSub(prod)}</div>
                      <h3 className="prodTitle">{getTitle(prod)}</h3>
                      <div className="rating">{renderStars(prod.rating)} ({t[lang].reviewsTextSuffix})</div>
                    </div>

                    <div className="cardFooter">
                      <span className="price">{getPrice(prod)}</span>
                      <button
                        className="cartBtn"
                        aria-label={`Add ${getTitle(prod)} to cart`}
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`${getTitle(prod)} ${t[lang].addedToCart}`);
                        }}
                      >
                        🛒
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div style={{ color: "#888", gridColumn: "1/-1", textAlign: "center", padding: "50px" }}>
              {t[lang].noProducts}
            </div>
          )}
        </main>
      </div>

      {/* MODAL (keeps original structure but localized) */}
      {modalOpen && selectedProduct && (
        <div className="modalOverlay" role="dialog" aria-modal="true" aria-label={`${getTitle(selectedProduct)} details`}>
          <div className="modalTopButtons">
            <button className="modalHome" onClick={() => modalGoHome()}>
              {t[lang].modalHome}
            </button>
            <button className="modalBack" onClick={() => closeModal()}>
              {t[lang].modalBack}
            </button>
          </div>

          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <div className="modalInner centeredModal">
              <div className="modalMainImage single modalImageNoFrame">
                <img
                  src={(selectedProduct.images && selectedProduct.images[0]) || "/images/product-bottle.png"}
                  alt={`${getTitle(selectedProduct)}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/900x600/050505/FFD700?text=PROD";
                  }}
                  loading="eager"
                />
              </div>

              <div className="modalInfo centerText">
                <h2 className="modalTitle">{getTitle(selectedProduct)}</h2>
                <p className="modalSubtitle">
                  {getSub(selectedProduct)} • {getPrice(selectedProduct)}
                </p>
                <div className="modalRating">{renderStars(selectedProduct.rating)} ({t[lang].reviewsTextSuffix})</div>

                <p className="modalDesc">{getDesc(selectedProduct)}</p>

                <div style={{ marginTop: 12 }}>
                  <div className="storiesTitle">{lang === 'ar' ? 'قصص وتجارب' : 'Stories & Experiences'}</div>
                  <div className="storiesList">
                    {selectedProduct.stories && selectedProduct.stories.length ? (
                      selectedProduct.stories.map((s, i) => (
                        <div className="storyCard" key={i}>
                          <h4>{s.title}</h4>
                          <p>{s.text}</p>
                        </div>
                      ))
                    ) : (
                      <div className="storyCard">
                        <h4>{lang === 'ar' ? 'لا توجد قصص' : 'No stories'}</h4>
                        <p>{lang === 'ar' ? 'لم يتم إضافة قصص لهذا المنتج بعد.' : 'No stories added for this product yet.'}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="modalActions">
                  <button
                    className="orderBtnModal"
                    onClick={() => {
                      alert(`${getTitle(selectedProduct)} ${t[lang].modalOrderNow}`);
                    }}
                  >
                    {t[lang].modalOrderNow}
                  </button>
                  <button
                    className="bookBtnModal"
                    onClick={() => {
                      alert(`${getTitle(selectedProduct)} ${t[lang].modalBook}`);
                    }}
                  >
                    {t[lang].modalBook}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modalBackdrop" onClick={closeModal} />
        </div>
      )}

      {/* COMING SOON OVERLAY */}
      {comingSoonOpen && comingProduct && (
        <div className="comingOverlay" role="dialog" aria-modal="true" aria-label="Coming soon">
          <div className="comingBox" onClick={(e) => e.stopPropagation()}>
            <div className="comingTitle" aria-hidden>
              {t[lang].comingSoon.toUpperCase()}
            </div>
            <div className="comingSubtitle" style={{ color: "#ccc", marginTop: 8 }}>
              {lang === 'ar' ? (comingProduct.title_ar || comingProduct.title) : (comingProduct.title)}
            </div>

            <div className="comingButtons" style={{ marginTop: 26 }}>
              <button className="orderBtnModal" onClick={() => comingGoHome()}>
                {t[lang].main}
              </button>
              <button
                className="bookBtnModal"
                style={{ border: "1px solid rgba(255,255,255,0.12)", marginLeft: 12 }}
                onClick={() => closeComing()}
              >
                {t[lang].back}
              </button>
            </div>
          </div>

          <div className="modalBackdrop" onClick={closeComing} />
        </div>
      )}
    </div>
  );
}
