import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import "../utils/axiosInstance";
import axios from "axios";
import { cookies } from "next/headers";
import { Header } from "components/Header";

const inter = Inter({ subsets: ["latin"] });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Clinical Dashboard",
  description: "The easiest way to manage your clinical data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} mt-4 min-w-screen flex flex-col`}>
        <Providers>
          <div className="min-w-screen min-h-screen justify-center flex">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
