import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { AppStateProvider } from "@/contexts/app-state-context";
import { ChatProvider } from "@/contexts/chat-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NomadSync - Find Your Crew",
  description: "Connect with verified travelers. AI-curated matching. Safe adventures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${inter.variable} h-full antialiased`}
      style={{ backgroundColor: '#F7F5F0' }}
    >
      <body className="min-h-full flex flex-col" style={{ backgroundColor: '#F7F5F0' }}>
        <AuthProvider>
          <AppStateProvider>
            <ChatProvider>
              {children}
            </ChatProvider>
          </AppStateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
