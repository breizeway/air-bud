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

interface ApiResponseWithError {
  errors?: Array<{ code: string; message: string }>;
}

export default function UrqlWrapper({ children }: PropsWithChildren) {
  const { push } = useRouter();
  const authExchange = mapExchange({
    onResult(result) {
      if (
        (
          Object.values(result.data ?? [{}])[0] as ApiResponseWithError
        ).errors?.some((err) => err.code === "LEAGUE_API_AUTH")
      )
        push("/auth");
    },
  });

  const urqlContext = useMemo(() => {
    const ssr = ssrExchange();
    const client = createClient({
      url: process.env.NEXT_PUBLIC_LEAGUE_API ?? "",
      exchanges: [authExchange, cacheExchange, ssr, fetchExchange],
      requestPolicy: "cache-and-network",
    });

    return { client, ssr };
  }, []);

  return <UrqlProvider {...urqlContext}>{children}</UrqlProvider>;
}
