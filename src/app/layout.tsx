import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { StealthProvider } from "@/contexts/StealthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stock Portfolio App",
  description: "Track your stock portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}
      >
        <StealthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </StealthProvider>
      </body>
    </html>
  );
}
