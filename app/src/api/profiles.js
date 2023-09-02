import { BASE_URL } from "../utils/constants/general";
import { getNpub } from "../utils/helpers/general";

export async function getTrendingProfilesRequest() {
  try {
    const res = await fetch(`${BASE_URL}/trending/profiles`);
    const tpr = await res.json();

    const tp = tpr.profiles.map((p) => {
      try {
	const pr = JSON.parse(p.profile.content);
	pr.npub = getNpub(p.pubkey);
	pr.pubkey = p.pubkey;
	return pr;
      } catch (e) {
	console.log("failed to parse profile", e);
	return undefined;
      }
    });

    if (tp.length > 30) tp.length = 30;
    return tp;
  } catch (e) {
    console.log("Failed to get trending profiles", e);
    return [];
  }
}
