import "./globals.css";
import type { Metadata } from "next";
import { Viewport } from "next";
import CourtLayout from "@/components/court-layout";
import UrqlWrapper from "@/components/urql-wrapper";
import Link from "next/link";
import { deatheMaachFont } from "@/assets/fonts";

export const viewport: Viewport = {
  themeColor: "#e03a3e",
};

export const metadata: Metadata = {
  title: "Ball is Lyf3",
  description:
    "The internet home of the Ball is Lyf3 fantasy basketball league",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={deatheMaachFont.variable}>
      <body>
        <Link rel="preload" href="/loading.gif" as="image" />
        <UrqlWrapper>
          <CourtLayout>{children}</CourtLayout>
        </UrqlWrapper>
      </body>
    </html>
  );
}
