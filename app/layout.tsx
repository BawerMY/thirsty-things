import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thirsty Things",
  description: "How much water goes into everyday things.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link href="/" className="brand">
            <span className="drop" aria-hidden="true" />
            Thirsty Things
          </Link>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
