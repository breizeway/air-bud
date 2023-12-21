import styles from "./home.module.css";
import Link from "next/link";
import RemImage from "@/components/rem-image";

export default function Home() {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <div className={styles.welcome}>
          <h1 className="mt-0">
            <div className={styles.welcomeGifBg}>
              <RemImage
                src={`/welcome.gif`}
                alt="low res orange animated welcome text with a spinning basketball where the 'o' would be"
                wRem={16}
                hRem={2.633125}
              />
            </div>
            to the official internet home of the{" "}
            <span className="text-theme">Ball is Lyf3</span> fantasy basketball
            league!!!
          </h1>
        </div>
        <p className="tracking-widest p-2 mt-4 paint">
          Hi! If you are a member of the ESPN fantasy basketball league
          &quot;Ball is Lyf3&quot; and want to know all about the stats and how
          the teams are doing - you have come to the right place.
        </p>
      </div>
      <div className="grow flex justify-center items-center">
        <RemImage
          src="/under-construction.gif"
          alt="website under construction"
          wRem={18.75}
          hRem={14.269375}
        />
      </div>
      <Link href="/auth" className="text-[#00000000]">
        /auth
      </Link>
    </section>
  );
}
