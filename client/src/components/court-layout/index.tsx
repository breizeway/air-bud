import { PropsWithChildren } from "react";
import EspnLink from "./espn-link";
import Link from "next/link";
import styles from "./court-layout.module.css";

export default function CourtLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.court}>
      <header className={styles.top}>
        <LeagueLogo />

        {/* <div className="flex gap-1 items-center grow">
          <ScalingImage
            src="/construction-bar.gif"
            alt='rotating "under construction" sign'
            wRem={8.259625}
            hRem={2.25}
          />
        </div> */}
        <EspnLink />
      </header>
      <footer className={styles.bottom}>
        <LeagueLogo />
        <EspnLink />
      </footer>
      <div className={styles.left} />
      <div className={styles.right} />
      <main className={styles.main}>{children}</main>
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
