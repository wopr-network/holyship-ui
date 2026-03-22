import { ThemeProvider } from "@core/components/theme-provider";
import { SITE_URL } from "@core/lib/api-config";
import { getBrandConfig } from "@core/lib/brand-config";
import { TRPCProvider } from "@core/lib/trpc";
import { MotionConfig } from "framer-motion";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { Toaster } from "sonner";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const brand = getBrandConfig();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${brand.productName} — Ship Code with AI`,
    template: `%s | ${brand.brandName}`,
  },
  description: brand.tagline,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>{nonce && <meta property="csp-nonce" content={nonce} />}</head>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <MotionConfig nonce={nonce}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            nonce={nonce}
          >
            <TRPCProvider>
              {children}
              <Toaster theme="dark" richColors />
            </TRPCProvider>
          </ThemeProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
