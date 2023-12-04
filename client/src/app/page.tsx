import Image from "next/image";
import styles from "./home.module.css";

export default function Home() {
  return (
    <section>
      <div className={styles.welcome}>
        <h1>
          <div className={styles.welcomeGifBg}>
            <Image
              src={`/welcome.gif`}
              alt="animated welcome text"
              height={41.13}
              width={250}
            />
          </div>
          to the internet home of the &quot;Ball is Lyf3&quot; fantasy league!!!
        </h1>
      </div>
      <p className="tracking-widest font-semibold text-md p-2 my-4 paint">
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
