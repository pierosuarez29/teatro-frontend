import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavLinks from "../components/NavLinks";
import { AuthProvider } from "@/context/authContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Teatro App",
  description: "App para reservas de teatro",
  icons: [
    {
      rel: "icon",
      url: "/favicon_io/favicon.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#151C25] text-white`}>
        <AuthProvider>
          <NavLinks />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
