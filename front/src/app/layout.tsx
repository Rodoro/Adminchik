import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/shared/ui/overlay/sonner";

export const metadata: Metadata = {
  title: {
    default: 'Adminchik',
    template: '%s | Adminchik'
  },
  description: "Это админ панель от GravityNode для управления всем миром.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  openGraph: {
    title: 'Adminchik',
    description: 'Это админ панель от GravityNode для управления всем миром.',
    url: 'https://nimda.gravity.ru',
    siteName: 'Adminchik',
    // TODO: Добавить картинку
    locale: 'ru_RU',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
