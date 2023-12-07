import styles from "./home.module.css";
import Link from "next/link";
import RemImage from "@/components/rem-image";

export default function Home() {
  return (
    <section>
      <div className={styles.welcome}>
        <h1 className="">
          <div className={styles.welcomeGifBg}>
            <RemImage
              src={`/welcome.gif`}
              alt="animated welcome text"
              wRem={16}
              hRem={2.633125}
            />
          </div>
          to the official internet home of the &quot;Ball is Lyf3&quot; fantasy
          basketball league!!!
        </h1>
      </div>
      <p className="tracking-widest p-2 my-4 paint">
        Hi! If you are a member of the ESPN fantasy basketball league &quot;Ball
        is Lyf3&quot; and want to know all about the stats and how the teams are
        doing - you have come to the right place.
      </p>
      <RemImage
        src="/under-construction.gif"
        alt="website under construction"
        wRem={18.75}
        hRem={14.269375}
      />
      <Link href="/auth">/auth</Link>
    </section>
  );
}
