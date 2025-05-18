'use client';

import "@/css/satoshi.css";
import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/Layouts/header";

import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { usePathname } from "next/navigation";


export default function RootLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();

  // Define routes where Sidebar and Header should not be displayed
  const noLayoutRoutes = ["/", "/signin", "/login", "/signup", "/authenticate"];

  const shouldShowLayout = !noLayoutRoutes.includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />

          <div className="flex min-h-screen">
            {shouldShowLayout && <Sidebar />}

            <div className={`w-full ${shouldShowLayout ? "bg-gray-2 dark:bg-[#020d1a]" : ""}`}>
              {shouldShowLayout && <Header />}

              <main
                className={`isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10 ${
                  shouldShowLayout ? "" : "flex items-center justify-center"
                }`}
              >
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
