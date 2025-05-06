import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { AuthProvider } from "@/contexts/auth-context";
import { PermissionProvider } from "@/contexts/permission-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "在庫管理アプリ",
  description: "在庫管理を効率的に行うためのアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <PermissionProvider>
            <div className="min-h-screen">
              <Navbar />
              <main className="container mx-auto py-6">
                {children}
              </main>
            </div>
          </PermissionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
