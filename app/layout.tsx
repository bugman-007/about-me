import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers";
import { Navbar, Footer } from "@/components/layout";
import { OwnerProvider } from "@/context/OwnerContext";
import { OwnerKeyListener, OwnerLoginModal } from "@/components/owner";
import { OwnerToolbar } from "@/components/owner/OwnerToolbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Portfolio | Senior Developer",
    template: "%s | Portfolio",
  },
  description:
    "Senior Developer Portfolio - Showcasing system architecture, full-stack development, and engineering expertise.",
  keywords: [
    "developer",
    "portfolio",
    "full-stack",
    "software engineer",
    "react",
    "typescript",
    "nextjs",
  ],
  authors: [{ name: "Developer Name" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Developer Portfolio",
    title: "Portfolio | Senior Developer",
    description:
      "Senior Developer Portfolio - Showcasing system architecture, full-stack development, and engineering expertise.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Senior Developer",
    description:
      "Senior Developer Portfolio - Showcasing system architecture, full-stack development, and engineering expertise.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <OwnerProvider>
            <OwnerKeyListener />
            <OwnerLoginModal />
            <OwnerToolbar />
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </OwnerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
