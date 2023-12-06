"use client";

interface LeagueAuth {
  espn_s2: string;
  swid: string;
}

export const setLeagueAuth = async (
  leagueAuth: LeagueAuth
): Promise<boolean> => {
  const EDGE_CONFIG_ID = process.env.NEXT_PUBLIC_EDGE_CONFIG_ID;
  const EDGE_CONFIG_TOKEN = process.env.NEXT_PUBLIC_EDGE_CONFIG_TOKEN;
  if (!EDGE_CONFIG_ID || !EDGE_CONFIG_TOKEN) return false;

  const result = await fetch(
    `https://api.vercel.com/v1/edge-config/${EDGE_CONFIG_ID}/items`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${EDGE_CONFIG_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            operation: "update",
            key: "league_auth",
            value: leagueAuth,
          },
        ],
      }),
    }
  );
  console.log(`:::RESULT::: `, result);

  if (result.ok) return true;
  return false;
};
