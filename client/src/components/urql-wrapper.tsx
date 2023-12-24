"use client";

import { PropsWithChildren, useMemo } from "react";
import {
  UrqlProvider,
  ssrExchange,
  fetchExchange,
  cacheExchange,
  createClient,
  mapExchange,
} from "@urql/next";
import { useRouter } from "next/navigation";
import { ErrorCodes } from "@/gql/graphql";

interface ApiResponseWithErrors {
  errors?: Array<{ code: string; message: string }>;
}

export default function UrqlWrapper({ children }: PropsWithChildren) {
  const { push } = useRouter();
  const authExchange = mapExchange({
    onResult(result) {
      if (
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
  }, []);

  return <UrqlProvider {...urqlContext}>{children}</UrqlProvider>;
}
