import styles from "./home.module.css";
import ScalingImage from "@/components/scaling-image";
import BoxScores from "@/components/box-scores";

export default function Home() {
  return (
    <section className="flex flex-col gap-6">
      <div className={styles.welcome}>
        <h1 className="my-0 font-semibold">
          <div className={styles.welcomeGifBg}>
            <ScalingImage
              src={`/welcome.gif`}
              alt="low res orange animated welcome text with a spinning basketball where the 'o' would be"
              wRem={16}
              hRem={2.633125}
            />
          </div>
          to the official internet home of the{" "}
          <span className="text-theme whitespace-nowrap">Ball is Lyf3</span>{" "}
          fantasy basketball league!!!
        </h1>
      </div>
      <p className="tracking-widest font-semibold text-lg border-2 border-black px-3 py-1">
        Hi! If you are a member of the ESPN fantasy basketball league &quot;Ball
        is Lyf3&quot; and want to know all about the stats and how the teams are
        doing - you have come to the right place.
      </p>
      <div>
        <BoxScores />
      </div>
    </section>
  );
}
