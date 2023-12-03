import { PropsWithChildren } from "react";
import styles from "./site-background.module.css";

export default function SiteBackground({ children }: PropsWithChildren) {
  return (
    <div className={styles.court}>
      <div className={styles.top} />
      <div className={styles.left} />
      <div className={styles.main}>{children}</div>
      <div className={styles.right} />
      <div className={styles.bottom} />
    </div>
  );
}
