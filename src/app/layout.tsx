import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AP originals - Pure & Organic",
  description: "Premium quality organic grocery & oils.",
};

import { StoreProvider } from "@/lib/StoreContext";
import { ToastProvider } from "@/lib/ToastContext";
import ToastContainer from "@/components/ui/ToastContainer";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans transition-colors duration-300">
        <ToastProvider>
          <StoreProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
            <ToastContainer />
          </StoreProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
