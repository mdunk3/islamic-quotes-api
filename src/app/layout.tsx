import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "API Kutipan Islami Pendidikan - Hadits Shahih tentang Pendidikan",
  description: "Platform API publik gratis yang menyediakan 50 hadits shahih tentang pendidikan. Telah diverifikasi secara akademis untuk mendukung pendidikan karakter di sekolah Islam Indonesia.",
  keywords: [
    "hadits pendidikan", 
    "hadits shahih", 
    "API hadits", 
    "kutipan islami", 
    "pendidikan Islam",
    "hadits tentang ilmu",
    "API gratis",
    "Islamic education API",
    "REST API Islam"
  ],
  authors: [{ name: "Islamic Education Developer" }],
  creator: "Islamic Education Developer",
  publisher: "Islamic Quotes API",
  
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" }, // Fallback untuk browser yang tidak support SVG
    ],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://islamic-quotes-api.vercel.app",
    title: "API Kutipan Islami Pendidikan - 50 Hadits Shahih",
    description: "Platform API gratis dengan 50 hadits shahih tentang pendidikan. Lengkap dengan teks Arab, terjemahan Indonesia, dan penjelasan.",
    siteName: "Islamic Quotes API",
    images: [
      {
        url: "/logo.svg",
        width: 800,
        height: 600,
        alt: "Islamic Quotes API Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "API Kutipan Islami Pendidikan",
    description: "50 hadits shahih tentang pendidikan - API gratis untuk pengembang aplikasi Islam",
    images: ["/logo.svg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  category: "education",
  
  alternates: {
    canonical: "https://islamic-quotes-api.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#10b981" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
