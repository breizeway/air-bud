import type { Metadata } from "next";
import "./globals.css";
import styles from "./layout.module.css";
import Image from "next/image";
import { Viewport } from "next";
import SiteBackground from "@/components/site-background";

export const viewport: Viewport = {
  themeColor: "#e03a3e",
};

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
        <div id="site-container" className={styles.siteContainer}>
          <SiteBackground>
            <header className={styles.header}>
              <h1 className={styles.welcome}>
                <div className={styles.welcomeGifBg}>
                  <Image
                    src={"/welcome-7.gif"}
                    alt="animated welcome text"
                    height={25.2}
                    width={140}
                    className={styles.welcomeGif}
                  />
                </div>
                to the BallisLyf3.net web site!!!
              </h1>
              <nav className={styles.nav}>
                <button>home</button>
                <button>score board</button>
              </nav>
            </header>
            <main className={styles.main}>{children}</main>
            <footer className={styles.footer}>
              <a href="https://github.com/breizeway/air-bud">source</a>
              <span className="text-theme">
                © {new Date().getFullYear()} tannor breitigam
              </span>
            </footer>
          </SiteBackground>
        </div>
      </body>
    </html>
  );
}
