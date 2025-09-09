import { type ExtractedLine } from "../stores/documentStore";

/**
 * Parses the API response and converts it to ExtractedLine array
 */
export const parseApiResponse = (data: any): ExtractedLine[] => {
  const lines: ExtractedLine[] = [];

  if (Array.isArray(data?.line_datas)) {
    data.line_datas.forEach((page: any) => {
      const pageNum = page?.Page_num || 1;
      const lineData = page?.line_data || [];

      lineData.forEach((line: any) => {
        // Convert word_boxes to our WordBox interface
        const words = Array.isArray(line?.word_boxes)
          ? line.word_boxes.map((wordBox: number[]) => ({
              box:
                wordBox.length === 4
                  ? (wordBox as [number, number, number, number])
                  : [0, 0, 0, 0],
            }))
          : [];

        lines.push({
          text: line?.line_text || "",
          score: typeof line?.score === "number" ? line.score : null,
          box:
            line?.line_box && line.line_box.length === 4
              ? (line.line_box as [number, number, number, number])
              : [0, 0, 0, 0],
          words,
          pageNum,
        });
      });
    });
  }

  return lines;
};

/**
 * Extracts document_type from API response
 */
export const extractDocumentType = (data: any): string | null => {
  return data?.document_type || null;
};
