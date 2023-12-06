"use client";

import Image from "next/image";
import Link from "next/link";

export default function Auth() {
  const LEAGUE_ID = process.env.LEAGUE_ID;

  return (
    <section>
      <Image
        src="/nodding-player.gif"
        alt="cartoon basketball player holding a basketball and nodding"
        width={160}
        height={215.17}
        className="float-left"
      />
      <Image
        src="/timeout-ref.gif"
        alt="cartoon basketball ref with their foot on a basketball making a timeout motion with their hands"
        width={120}
        height={205.71}
        className="float-right"
      />
      <h1 className="font-bold">Oh no!</h1>
      <strong className="text-lg">
        You&apos;re seeing this page because the credentials this web site uses
        to access ESPN league data have expired.{" "}
        <Image
          src="/skull.gif"
          alt="green rotating skull and crossbones"
          width={32}
          height={24}
          className="inline mt-[-0.4em]"
        />
      </strong>
      <h2 className="text-theme">
        If you&apos;re a member of the league, Ball is Lyf3 needs YOUR help to
        get up and running again.
      </h2>
      <strong>
        Don&apos;t be scared - it&apos;s quite simple, really.
        <ol>
          <li>
            Go to the{" "}
            <a
              href={`https://fantasy.espn.com/basketball/league?leagueId=${LEAGUE_ID}`}
              target="_blank"
            >
              Ball is Lyf3 League page at ESPN
            </a>
            . Make sure you&apos;re logged in!
          </li>
          <li>
            Next,{" "}
            <a
              href="https://www.cookieyes.com/blog/how-to-check-cookies-on-your-website-manually/"
              target="_blank"
            >
              go to your browser cookies
            </a>{" "}
            and find the ones named <code>SWID</code> and <code>espn_s2</code>.
            They&apos;ll be in the <code>https://fantasy.espn.com</code> bucket.
          </li>
          <li>
            Then just copy and paste those cookies&apos; values into the text
            fields below and click submit! (Don&apos;t worry - this probably
            isn't illegal or anything.)
          </li>
        </ol>
        <Image
          src="/thank-you.gif"
          alt="animated thank you text"
          width={200}
          height={100}
        />
        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="swid">SWID</label>
          <input id="swid" name="swid" type="text" className="block" />
          <label htmlFor="espn_s2">espn_s2</label>
          <input id="espn_s2" name="espn_s2" type="text" className="block" />
          <button type="submit" className="mt-4">
            <Image
              src="/submit.gif"
              alt="animated submit button"
              width={100}
              height={100}
            />
          </button>
        </form>
      </strong>
      <Link href="/">home</Link>
    </section>
  );
}
