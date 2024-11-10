import UrqlWrapper from "@/app/_providers/urql-wrapper";
import { deatheMaachFont } from "@/assets/fonts";
import CourtLayout from "@/components/court-layout";
import type { Metadata } from "next";
import { Viewport } from "next";
import Link from "next/link";
import "./globals.css";

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
