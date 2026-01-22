"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./PackagesPage.module.css"; 

const WHATSAPP_LINK = "https://wa.me/963988959363"; 
const PRICE_PLACEHOLDER = "تواصل للاستفسار"; 

const packagesData = [

  {
    title: "باقات المواقع والمتاجر الإلكترونية",
    description: "اختر الباقة التي تناسب أعمالك",
    id: "web_dev",
    packages: [
      {
        name: "الباقة الأساسية",
        tagline: "مثالية للمشاريع الصغيرة والمتوسطة",
        price: PRICE_PLACEHOLDER,
        features: [
          "إنشاء موقع بلغة واحدة",
          "حجز دومين لمدة سنة",
          "استضافة لمدة سنة",
          "5 عناوين بريد إلكتروني",
          "تصميم متجاوب مع جميع الأجهزة",
          "تصميم 5 صفحات",
        ],
      },
      {
        name: "باقة الأعمال",
        tagline: "خيار مثالي للشركات الراغبة في التوسع و الاحترافية",
        price: PRICE_PLACEHOLDER,
        features: [
          "إنشاء موقع بلغة واحدة",
          "حجز دومين لمدة سنة",
          "استضافة لمدة سنة",
          "5 عناوين بريد إلكتروني",
          "تصميم متجاوب مع جميع الأجهزة",
          "تصميم من 10 إلى 15 صفحة",
          "شهادة أمان SSL",
          { text: "تحسين محركات البحث SEO", highlight: true }, 
          "كتابة محتوى احترافي متوافق مع معايير SEO",
          "6 مقالات شهرية متوافقة مع SEO",
        ],
      }, 
      {
        name: "باقة المتاجر الإلكترونية",
        tagline: "للانطلاق في عالم التجارة الإلكترونية",
        price: PRICE_PLACEHOLDER,
        features: [
          "إنشاء موقع بلغة واحدة",
          "حجز دومين لمدة سنة",
          "استضافة لمدة سنة",
          "5 عناوين بريد إلكتروني",
          "بناء لوحة تحكم Dashboard",
          "تصميم متجاوب مع جميع الأجهزة",
          "تصميم 5 صفحات",
        ],
      },
    ],
    customization: true,
  },

  {
    title: "باقات سوشيال ميديا",
    description: "اختر الباقة التي تناسب أعمالك",
    id: "social_media",
    packages: [
      {
        name: "باقة الظهور",
        tagline: "(شهر)",
        price: PRICE_PLACEHOLDER,
        features: [
          "تحليل النشاط التجاري ودراسة المنافسين",
          "تحديد المنصات الأنسب للتسويق",
          "خطة محتوى شهرية",
          "12 بوست (منها 4 ريلز)",
          "12 ستوري مع خطة تفاعلية مخصصة",
          "الرد الترحيبي الآلي في الحسابات",
          "تقرير شهري للأداء",
        ],
      },
      {
        name: "باقة النمو",
        tagline: "(شهر)",
        price: PRICE_PLACEHOLDER,
        features: [
          "تحليل النشاط التجاري ودراسة المنافسين",
          "تحديد المنصات الأنسب للتسويق",
          "خطة محتوى شهرية",
          "15 بوست (منها 4 ريلز)",
          "15 ستوري مع خطة تفاعلية مخصصة",
          "الرد الترحيبي الآلي في الحسابات",
          "إدارة الردود الآلية على التعليقات (فيسبوك، إنستغرام، واتساب، تيك توك)",
          "تقرير شهري للأداء",
        ],
      },
      {
        name: "باقة الأعمال الاحترافية",
        tagline: "(شهر)",
        price: PRICE_PLACEHOLDER,
        features: [
          "تحليل النشاط التجاري ودراسة المنافسين",
          "تحديد المنصات الأنسب للتسويق",
          "خطة محتوى شهرية متكاملة",
          "26 منشور (منها 8 ريلز)",
          "26 ستوري مع خطة تفاعلية مخصصة",
          "الرد الترحيبي الآلي في الحسابات",
          "إدارة الردود الآلية على التعليقات (فيسبوك، إنستغرام، واتساب، تيك توك)",
          "تقرير شهري تفصيلي مع توصيات للتحسين",
          "فيديو إعلاني بالذكاء الاصطناعي AI لمنتجك أو خدمتك",
        ],
      },
    ],
    customization: true,
  },

  {
    title: "باقة الحملات الإعلانية الممولة (شهرية)",
    description: "مثالية للشركات التي ترغب في الوصول المباشر لجمهورها عبر إعلانات ممولة فعّالة",
    id: "ads_campaigns",
    packages: [
      {
        name: "الحملات الإعلانية الممولة",
        tagline: "إعلانات شهرية فعّالة",
        price: PRICE_PLACEHOLDER,
        features: [
          "دراسة المشروع وتحديد أهداف واضحة",
          "تحديد ميزانية الحملة",
          "إنشاء خطة إعلانية مع جدول محتوى (بوستات + ريلز) وتصاميم متوافقة مع الهوية البصرية",
          "تهيئة الحساب الإعلاني وضبط الاستهداف للجمهور المناسب",
          "إطلاق الحملات مع اختبارات A/B وتحسين دوري للأداء",
          "تقرير شهري مفصل يتضمن تحليل النتائج و توصيات للتحسين",
          "الرد الترحيبي الآلي",
          "تنفيذ الحملة على منصة واحدة من اختيارك",
          "جلسة استشارية شهرية لمراجعة الأداء مع العميل",
        ],
      },
    ],
    customization: true,
  },
];

const PackageCard = ({ packageInfo }) => {
  const { name, tagline, features, price } = packageInfo;

  return (
    <div className={styles.packageCard}>
      <div className={styles.cardHeader}>
        <h3>{name}</h3>
        <p className={styles.tagline}>{tagline}</p>
        <div className={styles.priceDisplay}>
          {price === PRICE_PLACEHOLDER ? null : (
            <>
              {price} <span>ر.س</span>
            </>
          )}
        </div>
      </div>

      <ul className={styles.featuresList}>
        {features.map((feature, index) => {
          const featureText = typeof feature === 'string' ? feature : feature.text;
          const isHighlighted = typeof feature !== 'string' && feature.highlight;

          return (
            <li 
              key={index} 
              className={isHighlighted ? styles.highlightedFeature : ''}
            >
              <span className={styles.featureIcon}>✓</span>
              {featureText}
            </li>
          );
        })}
      </ul>

      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.bookButton}
      >
        احجز الباقة
      </a>
    </div>
  );
};

const PackageSection = ({ sectionData }) => (
  <section id={sectionData.id} className={styles.section} dir="rtl">
    <div className={styles.sectionHeader}>
      <h2>{sectionData.title}</h2>
      {sectionData.description && <p>{sectionData.description}</p>}
    </div>

    <div className={styles.packagesGrid}>
      {sectionData.packages.map((pkg, index) => (
        <PackageCard key={index} packageInfo={pkg} />
      ))}
    </div>

    
  </section>
);

export default function PackagesPage() {
  return (
    <div dir="rtl">
      <Navbar />
      <main style={{ padding: "0", minHeight: "80vh", backgroundColor: "#231f20" }}>
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <div className={styles.packagesHeader}>
    <h1>باقاتنا</h1>

    <a 
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.contactButton}
    >
        أحجز باقة خاصة
    </a>
</div>

          <a href="#web_dev"  className={styles.sectionButton}>باقات المواقع والمتاجر الإلكترونية</a>
          <a href="#social_media"  className={styles.sectionButton}>باقات سوشيال ميديا</a>
          <a href="#ads_campaigns"  className={styles.sectionButton}>باقات الحملات الإعلانية</a>
        </div>

        {packagesData.map((section) => (
          <PackageSection key={section.id} sectionData={section} />
        ))}
      </main>
      <Footer />
    </div>
  );
}

