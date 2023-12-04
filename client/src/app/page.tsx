import Image from "next/image";
import styles from "./home.module.css";

export default function Home() {
  return (
    <section>
      <div className={styles.welcome}>
        <h1 className="text-theme">
          <div className={styles.welcomeGifBg}>
            <Image
              src={`/welcome.gif`}
              alt="animated welcome text"
              height={46.73}
              width={284}
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
      <Image
        src="/under-construction.gif"
        alt="website under construction"
        width={300}
        height={228.31}
      />
    </section>
  );
}
