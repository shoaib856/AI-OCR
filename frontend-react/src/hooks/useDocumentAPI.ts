import { useCallback } from "react";
import { useDocumentStore, type ExtractedLine } from "../stores/documentStore";
import { useTranslation } from "react-i18next";

interface FormData {
  file: FileList;
  language: string;
  clasifier: string;
}

interface UseDocumentAPIParams {
  extractedLines: ExtractedLine[];
  setExtractedLines: (lines: ExtractedLine[]) => void;
}

export const useDocumentAPI = ({
  extractedLines,
  setExtractedLines,
}: UseDocumentAPIParams) => {
  const { t } = useTranslation();
  const documentStore = useDocumentStore();

  const parseResponse = useCallback(
    (data: any) => {
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

      setExtractedLines(lines);
      return lines;
    },
    [setExtractedLines]
  );

  const extractText = useCallback(
    async (
      selectedFile: File | null,
      data: FormData,
      setStatus: (status: string) => void,
      setStatusClass: (statusClass: string) => void
    ) => {
      if (!selectedFile) {
        setStatus(t("selectImageFirst"));
        setStatusClass("error");
        return null;
      }

      setStatus(t("processingImage"));
      setStatusClass("processing");

      try {
        const result = await documentStore.extractText(
          selectedFile,
          data.language,
          data.clasifier === "true"
        );

        setStatus(result.signal || result.status || t("success"));
        setStatusClass("success");

        const lines = parseResponse(result);
        return { result, lines };
      } catch (error) {
        console.error(error);
        setStatus(t("errorProcessing"));
        setStatusClass("error");

        const errorLines: ExtractedLine[] = [
          {
            text: t("errorDuringProcessing"),
            score: null,
            box: [0, 0, 0, 0],
            words: [],
          },
        ];
        setExtractedLines(errorLines);
        return { result: null, lines: errorLines };
      }
    },
    [t, documentStore, parseResponse, setExtractedLines]
  );

  const resetExtractedLines = useCallback(() => {
    setExtractedLines([]);
  }, [setExtractedLines]);

  return {
    extractedLines,
    setExtractedLines,
    extractText,
    parseResponse,
    resetExtractedLines,
    isLoading: documentStore.isLoading,
  };
};
