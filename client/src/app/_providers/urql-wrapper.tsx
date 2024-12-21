"use client";

import { ErrorCodes } from "@/gql/graphql";
import {
  cacheExchange,
  createClient,
  fetchExchange,
  mapExchange,
  ssrExchange,
  UrqlProvider,
  UseQueryExecute,
} from "@urql/next";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useMemo } from "react";

interface ApiResponseWithErrors {
  errors?: Array<{ code: string; message: string }>;
}

export default function UrqlWrapper({ children }: PropsWithChildren) {
  const { push } = useRouter();
  const authExchange = mapExchange({
    onResult(result) {
      if (
        !result.stale &&
        (
          Object.values(result.data ?? [{}])[0] as ApiResponseWithErrors
        ).errors?.some((err) => err.code === ErrorCodes.LeagueApiAuth)
      )
        push("/auth");
    },
  });

  const urqlContext = useMemo(() => {
    const ssr = ssrExchange();
    const client = createClient({
      url: process.env.NEXT_PUBLIC_LEAGUE_API ?? "",
      exchanges: [cacheExchange, ssr, authExchange, fetchExchange],
      requestPolicy: "cache-and-network",
    });

    return { client, ssr };
  }, [authExchange]);

  return <UrqlProvider {...urqlContext}>{children}</UrqlProvider>;
}

const lastFetched: { [key: string]: number } = {};
export class UrqlSubscription {
  private DEDUP: number = 5_000;
  private key: string;
  private refetch: UseQueryExecute;
  private ms: number;
  private timeout?: NodeJS.Timeout;

  constructor(
    key: string,
    refetch: UseQueryExecute,
    ms: number | undefined = 30_000
  ) {
    this.key = key;
    this.refetch = refetch;
    this.ms = ms;
  }

  private setFetchInterval() {
    this.clearFetchInterval();
    this.timeout = setInterval(this.fetch.bind(this), this.ms);
  }

  private clearFetchInterval() {
    clearInterval(this.timeout);
  }

  private onWindowFocus(_: FocusEvent) {
    this.fetch();
    this.setFetchInterval();
  }

  private onWindowBlur(_: FocusEvent) {
    this.clearFetchInterval();
  }

  fetch() {
    const time = new Date().getTime();
    if (time - (lastFetched[this.key] ?? 0) >= this.DEDUP) {
      this.refetch();
      lastFetched[this.key] = time;
    }
  }

  start() {
    this.setFetchInterval();
    window?.addEventListener("focus", this.onWindowFocus.bind(this));
    window?.addEventListener("blur", this.onWindowBlur.bind(this));
  }

  stop() {
    this.clearFetchInterval();
    window?.removeEventListener("focus", this.onWindowFocus.bind(this));
    window?.removeEventListener("blur", this.onWindowBlur.bind(this));
  }
}
