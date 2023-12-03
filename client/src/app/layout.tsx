import type { Metadata } from "next";
import "./globals.css";
import { Viewport } from "next";
import CourtLayout from "@/components/court-layout";

export const viewport: Viewport = {
  themeColor: "#e03a3e",
};

export const metadata: Metadata = {
  title: "Ball is Lyf3",
  description: "The internet home of the Ball is Lyf3 fantasy league",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CourtLayout>{children}</CourtLayout>
      </body>
    </html>
  );
}
