import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/shared/ui/overlay/sonner";
import { SidebarProvider } from "@/shared/ui/layout/sidebar";

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
    images: [
      {
        url: 'https://nimda.gravity.ru/og.png',
        secureUrl: 'https://nimda.gravity.ru/og.png',
        width: 1200,
        height: 630,
        alt: "Preview image for Dan Mugh's Blog",
      },
    ],
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
        <SidebarProvider>
          <Toaster />
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
