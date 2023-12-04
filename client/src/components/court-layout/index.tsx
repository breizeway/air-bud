import { PropsWithChildren } from "react";
import styles from "./court-layout.module.css";
import Image from "next/image";
import Link from "next/link";
import classNames from "classnames";

const LEAGUE_ID = process.env.LEAGUE_ID;

export default function CourtLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.court}>
      <header className={styles.top}>
        <LeagueLogo />
        {/* <Image
          src="/pixel-bbal.svg"
          alt="basketball logo"
          height={28}
          width={28}
        /> */}
        <EspnLogo />
      </header>
      <footer className={styles.bottom}>
        <LeagueLogo />
        <a
          href="https://github.com/breizeway/air-bud"
          className="block rounded-full overflow-hidden min-w-fit"
        >
          <Image
            src="/github-mark.svg"
            alt="github logo"
            height={28}
            width={28}
          />
        </a>
        <EspnLogo />
      </footer>
      <div className={styles.left} />
      <div className={styles.right} />
      <main className={styles.main}>
        {/* <nav className="mb-2 flex gap-2">
          <Link href="/" className="text-theme">
            home
          </Link>
        </nav> */}
        {children}
      </main>
    </div>
  );
}

function LeagueLogo() {
  return (
    <div className={styles.courtLogo}>
      <Link href="/" className={styles.leagueLogo}>
        <span className={styles.courtLogoStretch}>BALL IS LYF3</span>
      </Link>
    </div>
  );
}

function EspnLogo() {
  return (
    <div className={classNames(styles.courtLogo, "justify-end")}>
      <a
        href={`https://fantasy.espn.com/basketball/league?leagueId=${LEAGUE_ID}`}
        className={styles.espnLogo}
      >
        <span className={styles.courtLogoStretch}>ESPN</span>
        <div className="flex flex-col text-xs">
          <span className="tracking-wide">FANTASY</span>
          <span className="tracking-widest">LEAGUE</span>
        </div>
      </a>
    </div>
  );
}
