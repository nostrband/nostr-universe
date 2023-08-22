import { BASE_URL } from "../utils/constants/general";
import { getNpub } from "../utils/helpers/general";

export const getTrendingNotesRequest = async () => {
  const response = await fetch(`${BASE_URL}/trending/notes`);
  const result = await response.json();

  const notes = result.notes.map((note) => {
    try {
      const author = JSON.parse(note.author.content);
      author.npub = getNpub(note.pubkey);
      author.pubkey = note.pubkey;

      return { ...note, author };
    } catch (e) {
      console.log("failed to parse note's content", e);
      return undefined;
    }
  });

  return notes;
};
