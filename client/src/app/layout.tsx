import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Air Bud",
  description: "A companion to private ESPN fantasy basketball leagues",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div
          id="site-container"
          style={{
            backgroundImage: "url('/wood.svg')",
            backgroundSize: "720px",
          }}
          className="h-screen w-screen flex flex-col justify-between"
        >
          <header>
            <h1 className="text-3xl flex justify-center p-2">
              Welcome to the official Ball Is Lyf3 World Wide Web site
            </h1>
          </header>
          <main className="grow">{children}</main>
          <footer className="flex justify-between p-2">
            <a href="https://github.com/breizeway/air-bud">Source</a>© 2023
            Tannor Breitigam
          </footer>
        </div>
      </body>
    </html>
  );
}
