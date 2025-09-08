import { type ExtractedLine } from "../stores/documentStore";

/**
 * Validates if a bounding box array has the correct format [x, y, width, height]
 */
export const isValidBoundingBox = (box: number[]): boolean => {
  return (
    Array.isArray(box) &&
    box.length === 4 &&
    box.every((coord) => typeof coord === "number" && coord >= 0)
  );
};

/**
 * Formats a confidence score as a percentage
 */
export const formatConfidenceScore = (score: number | null): string => {
  if (score === null) return "?";
  return `${Math.round(score * 100)}%`;
};

/**
 * Gets the total number of words across all extracted lines
 */
export const getTotalWordCount = (extractedLines: ExtractedLine[]): number => {
  return extractedLines.reduce((total, line) => total + line.words.length, 0);
};

/**
 * Filters lines by minimum confidence score
 */
export const filterLinesByConfidence = (
  extractedLines: ExtractedLine[],
  minScore: number
): ExtractedLine[] => {
  return extractedLines.filter(
    (line) => line.score !== null && line.score >= minScore
  );
};

/**
 * Groups lines by page number
 */
export const groupLinesByPage = (
  extractedLines: ExtractedLine[]
): Record<number, ExtractedLine[]> => {
  return extractedLines.reduce((groups, line) => {
    const pageNum = line.pageNum || 1;
    if (!groups[pageNum]) {
      groups[pageNum] = [];
    }
    groups[pageNum].push(line);
    return groups;
  }, {} as Record<number, ExtractedLine[]>);
};

/**
 * Calculates the average confidence score
 */
export const getAverageConfidence = (
  extractedLines: ExtractedLine[]
): number => {
  const validScores = extractedLines
    .map((line) => line.score)
    .filter((score): score is number => score !== null);

  if (validScores.length === 0) return 0;

  return (
    validScores.reduce((sum, score) => sum + score, 0) / validScores.length
  );
};

/**
 * Creates a default empty line for error states
 */
export const createEmptyLine = (text: string): ExtractedLine => ({
  text,
  score: null,
  box: [0, 0, 0, 0],
  words: [],
});

/**
 * Validates API response structure
 */
export const validateAPIResponse = (data: any): boolean => {
  return (
    data &&
    typeof data === "object" &&
    Array.isArray(data.line_datas) &&
    data.line_datas.length > 0
  );
};
