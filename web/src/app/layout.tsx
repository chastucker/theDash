import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import "../utils/axiosInstance";
import { Toaster } from "components/ui/toaster";

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
        <Toaster />
      </body>
    </html>
  );
}
