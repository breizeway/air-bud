"use client";

import { PropsWithChildren, useMemo } from "react";
import {
  UrqlProvider,
  ssrExchange,
  fetchExchange,
  cacheExchange,
  createClient,
} from "@urql/next";

export default function UrqlWrapper({ children }: PropsWithChildren) {
  const [client, ssr] = useMemo(() => {
    const ssr = ssrExchange();
    const client = createClient({
      url: process.env.NEXT_PUBLIC_LEAGUE_API ?? "",
      exchanges: [cacheExchange, ssr, fetchExchange],
      requestPolicy: "cache-and-network",
    });

    return [client, ssr];
  }, []);

  return (
    <UrqlProvider client={client} ssr={ssr}>
      {children}
    </UrqlProvider>
  );
}
