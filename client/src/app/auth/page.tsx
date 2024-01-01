"use client";

import Loading from "@/components/loading";
import RemImage from "@/components/rem-image";
import { graphql } from "@/gql";
import { useMutation } from "@urql/next";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

const LEAGUE_ID = process.env.NEXT_PUBLIC_LEAGUE_ID;

export default function Auth() {
  const router = useRouter();
  const [setLeagueAuthStatus, setLeagueAuth] = useMutation(
    graphql(`
      mutation setLeagueAuth($leagueAuth: LeagueAuthInput!) {
        setLeagueAuth(leagueAuth: $leagueAuth) {
          __typename
          success
          errors {
            code
            message
          }
        }
      }
    `)
  );
  // console.log(`:::SETLEAGUEAUTHSTATUS::: `, setLeagueAuthStatus.fetching);
  const ref = useRef<HTMLFormElement>(null);
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (ref.current) {
      const formData = new FormData(ref.current);

      const { swid, espn_s2 } = {
        swid: formData.get("swid")?.valueOf().toString() ?? "",
        espn_s2: formData.get("espn_s2")?.valueOf().toString() ?? "",
      };

      ref.current?.reset();
      const result = await setLeagueAuth({ leagueAuth: { swid, espn_s2 } });

      if (result.data?.setLeagueAuth.success) router.back();
    }
  }

  return (
    <section>
      <RemImage
        src="/nodding-player.gif"
        alt="cartoon basketball player holding a basketball and nodding"
        wRem={10}
        hRem={13.4475}
        className="float-left"
      />
      <RemImage
        src="/timeout-ref.gif"
        alt="cartoon basketball referee with their foot on a basketball making a timeout motion with their hands"
        wRem={7.5}
        hRem={12.856875}
        className="float-right"
      />
      <h1 className="font-bold mt-0">Oh no!</h1>
      <strong className="text-lg">
        You&apos;re seeing this page because the credentials this web site uses
        to access ESPN league data have expired or are incorrect.{" "}
        <RemImage
          src="/skull.gif"
          alt="green rotating skull and crossbones"
          wRem={2}
          hRem={1.5}
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
            isn&apos;t illegal or anything.)
          </li>
        </ol>
        <RemImage
          src="/thank-you.gif"
          alt="animated thank you text"
          wRem={12.5}
          hRem={3.625}
        />
        <form {...{ onSubmit, ref }}>
          <div>
            <label htmlFor="swid">SWID</label>
            <input
              id="swid"
              name="swid"
              type="text"
              className="block"
              required={true}
              aria-required={true}
            />
          </div>
          <div>
            <label htmlFor="espn_s2">espn_s2</label>
            <input
              id="espn_s2"
              name="espn_s2"
              type="text"
              className="block"
              required={true}
              aria-required={true}
            />
          </div>
          <Loading
            isLoading={setLeagueAuthStatus.fetching}
            message="Sending"
            className="mt-2"
          />
          <div>
            <button
              type="submit"
              className="button mt-4"
              disabled={setLeagueAuthStatus.fetching}
              aria-disabled={setLeagueAuthStatus.fetching}
            >
              Send
            </button>
            {/* TODO NEXT: 1) add delay to loading 2) make button baige design a tw class */}
          </div>
        </form>
      </strong>
    </section>
  );
}
