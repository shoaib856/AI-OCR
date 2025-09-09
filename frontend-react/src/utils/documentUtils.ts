import { type ExtractedLine } from "../stores/documentStore";

/**
 * Creates a default empty line for error states
 */
export const createEmptyLine = (text: string): ExtractedLine => ({
  text,
  score: null,
  box: [0, 0, 0, 0],
  words: [],
});
