import type { Metadata } from "next";
import { Cinzel, Crimson_Text, Special_Elite } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "700"],
});

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  variable: "--font-crimson",
  weight: ["400", "600", "700"],
});

const specialElite = Special_Elite({
  subsets: ["latin"],
  variable: "--font-typewriter",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "SpecterScript - Haunt Your Coursework",
  description: "Transform your PDF coursework into haunted, gothic horror versions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${crimsonText.variable} ${specialElite.variable} antialiased bg-deep-black text-parchment`}
      >
        {children}
      </body>
    </html>
  );
}
