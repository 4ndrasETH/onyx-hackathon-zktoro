import { UserContextProvider } from "@/components/contexts/UserContext";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MagicProvider } from "@/components/contexts/MagicContext";
import { Toaster } from "@/components/ui/Toast/Toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "zkToro Dashboad",
  description: "Manage your strategy nodes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserContextProvider>
          <MagicProvider>{children}</MagicProvider>
        </UserContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
