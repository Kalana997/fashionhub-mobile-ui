import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const brandSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-brand-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FashionHub — Brand Store",
  description: "Internship exercise for the FashionHub mobile commerce flow.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${brandSans.variable} h-full bg-white antialiased md:bg-[#EFF0F5]`}>
      <body className={`min-h-full bg-white md:bg-[#EFF0F5] ${brandSans.className}`}>{children}</body>
    </html>
  );
}
