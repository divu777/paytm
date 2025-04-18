import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "../providers";
import { AppbarClient } from "../components/AppbarCLient";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wallet",
  description: "Simple wallet app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <Providers>
        <body >
          <div className=" h-screen w-screen ">
            <AppbarClient />
            {children}
          </div>
        </body>
      </Providers>
    </html>
  );
}