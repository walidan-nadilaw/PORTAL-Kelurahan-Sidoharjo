import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "../globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Website Kelurahan Sidoharjo",
  description: "Situs resmi Kelurahan Sidoharjo, Kecamatan Sidoharjo, Kabupaten Wonogiri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${montserrat.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-transparent">
        {/*
          Gradient is CSS, not the 227 KB background PNG in design-reference/.
          Painted as a fixed layer rather than `bg-fixed` on <body>, because
          background-attachment: fixed is unreliable on iOS Safari. A negative
          z-index keeps it above the body background but behind all content.
        */}
        <div
          aria-hidden
          className="fixed inset-0 -z-10 bg-gradient-to-b from-page-top from-25% to-page-bottom"
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
