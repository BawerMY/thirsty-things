import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const bricolage = localFont({
  src: "./fonts/BricolageGrotesque-latin.woff2",
  weight: "400 800",
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thirsty Things",
  description: "How much water it takes to make everyday stuff, counted in bottles.",
};

export const viewport: Viewport = {
  themeColor: "#06294a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={bricolage.variable}>
      <body>{children}</body>
    </html>
  );
}
