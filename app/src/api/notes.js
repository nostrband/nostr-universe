import { BASE_URL } from "../utils/constants/general";
import { getNpub } from "../utils/helpers/general";

export const getTrendingNotesRequest = async () => {
  try {
    const response = await fetch(`${BASE_URL}/trending/notes`);
    const result = await response.json();

    const notes = result.notes.map((r) => {
      const note = r.event;
      note.author = r.author;
      note.author.npub = getNpub(r.pubkey);
      note.author.pubkey = r.pubkey;
      try {
	note.author.profile = JSON.parse(r.author.content);
      } catch (e) {
	console.log("failed to parse note's content", e);
      }

      return note;
    });

    if (notes.length > 30) notes.length = 30;
    return notes;
  } catch (e) {
    console.log("Failed to get trending notes", e);
    return [];
  }
};
