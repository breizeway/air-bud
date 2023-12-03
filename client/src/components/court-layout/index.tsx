import { PropsWithChildren } from "react";
import styles from "./court-layout.module.css";
import Image from "next/image";
import Link from "next/link";

const LEAGUE_ID = process.env.LEAGUE_ID;

export default function CourtLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.court}>
      <header className={styles.top}>
        <LeagueLogo />
        <EspnLogo />
      </header>
      <footer className={styles.bottom}>
        <LeagueLogo />
        <a
          href="https://github.com/breizeway/air-bud"
          className="block rounded-full overflow-hidden"
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
      <main className={styles.main}>{children}</main>
    </div>
  );
}

function LeagueLogo() {
  return (
    <Link href="/" className={styles.leagueLogo}>
      <span className={styles.courtLogoStretch}>BALL IS LYF3</span>
    </Link>
  );
}

function EspnLogo() {
  return (
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
  );
}
