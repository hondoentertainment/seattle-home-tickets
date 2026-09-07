import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthSessionProvider } from "@/components/auth-session-provider";
import { ShortlistHost } from "@/components/shortlist-host";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { ToastHost } from "@/components/toast-host";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#06110e",
};

export const metadata: Metadata = {
  title: "Seattle Home Tickets — Full-season price estimates",
  description:
    "Searchable, sortable calendar of Seattle home sporting events with unofficial mid-tier estimates for two seats.",
  openGraph: {
    title: "Seattle Home Tickets",
    description:
      "Every published Seattle home game with estimated mid-tier pair prices. Search, filter, and sort the slate.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthSessionProvider>
          <SiteNav />
          <div className="flex flex-1 flex-col">{children}</div>
          <SiteFooter />
          <ShortlistHost />
          <ToastHost />
          <Analytics />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
