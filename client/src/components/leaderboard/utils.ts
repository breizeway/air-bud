import { TEAM_NAME_ADJS, TEAM_NAME_NOUNS } from "@/constants";

// All scoring/ranking/formatting now happens on the backend (getLeaderboard).
// The only client-side transform left is the "SFW mode" team-name swap, which
// is display-only and depends on the viewer's toggle, so it stays here.

type Owner = { firstName?: string | null };

export const getTeamName = (
  teamName: string,
  owners: Owner[],
  sfwMode: boolean
) => {
  if (!sfwMode) return teamName.trim();
  const firstName = owners.at(0)?.firstName ?? "";
  return `${firstName}'s ${getTeamAdj(firstName)} ${getTeamNoun(firstName)}`;
};

const teamAdjCache: { [ownerFirstName: string]: string } = {};
const getTeamAdj = (ownerFirstName: string) => {
  const cachedAdj = teamAdjCache[ownerFirstName];
  if (cachedAdj) return cachedAdj;
  else {
    const teamAdj =
      TEAM_NAME_ADJS.at(
        Math.round(Math.random() * (TEAM_NAME_ADJS.length - 1))
      ) ?? "";
    teamAdjCache[ownerFirstName] = teamAdj;
    return teamAdj;
  }
};

const teamNounCache: { [ownerFirstName: string]: string } = {};
const getTeamNoun = (ownerFirstName: string) => {
  const cachedNoun = teamNounCache[ownerFirstName];
  if (cachedNoun) return cachedNoun;
  else {
    const teamNoun =
      TEAM_NAME_NOUNS.at(
        Math.round(Math.random() * (TEAM_NAME_NOUNS.length - 1))
      ) ?? "";
    teamNounCache[ownerFirstName] = teamNoun;
    return teamNoun;
  }
};
