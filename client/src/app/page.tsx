import Image from "next/image";
import styles from "./home.module.css";

export default function Home() {
  return (
    <section>
      <div className={styles.welcome}>
        <h1>
          <div className={styles.welcomeGifBg}>
            <Image
              src={"/welcome-7.gif"}
              alt="animated welcome text"
              height={25.2}
              width={140}
              className={styles.welcomeGif}
            />
          </div>
          to the internet home of the &quot;Ball is Lyf3&quot; fantasy league!!!
        </h1>
      </div>
      <p className="tracking-widest font-semibold text-lg my-6 border-2 border-black px-2">
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
