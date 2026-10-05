import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {isRTL} from '@heroui/react';
import "./globals.css";
import { ClientProviders } from "./components/ClientProviders";
import Appbar from "./components/Appbar";
import SignInPanel from "./components/signInPanel";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Casa Garantida',
  description: 'Sistema de Venda e Aluguel de Imóveis',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>
        <ClientProviders>
          <Appbar>
            <SignInPanel />
          </Appbar>
          {children}
          <ToastContainer />
        </ClientProviders>
      </body>
    </html>
  );
}