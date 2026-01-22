import "./globals.css";
import { IBM_Plex_Sans } from "next/font/google";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin", "arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://foundr-x.com"),

  title: {
    default: "FOUNDR-X",
    template: "%s | FOUNDR-X",
  },

  description:
    "خدمات رقمية متكاملة — ابدأ خطوتك الأولى كمؤسس مع فاوندر اكس. شركة متخصصة في تأسيس الشركات، البرمجة، التصميم، التسويق، والتصوير الاحترافي.",

  keywords: [
    "تأسيس شركات",
    "خدمات رقمية",
    "برمجة",
    "تصميم",
    "تسويق إلكتروني",
    "تصوير",
    "مونتاج",
    "هوية بصرية",
    "فاوندر اكس",
    "FOUNDR-X",
  ],

  openGraph: {
    title: "FOUNDR-X | Digital Solutions Company",
    description:
      "Empowering your business with development, marketing, and creative digital solutions.",
    siteName: "FOUNDR-X",
    type: "website",
    url: "https://foundr-x.com",
    locale: "ar_AR",
    images: [
      {
        url: "/image/ll.png",
        width: 1200,
        height: 630,
        alt: "FOUNDR-X Logo",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={ibmPlexSans.variable}>
        {children}
      </body>
    </html>
  );
}
