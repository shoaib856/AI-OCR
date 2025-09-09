import { useCallback } from "react";
import { useDocumentStore, type ExtractedLine } from "../stores/documentStore";
import { useTranslation } from "react-i18next";
import type { DocumentFormData } from "@/lib/types";

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

  const extractText = useCallback(
    async (
      data: DocumentFormData,
      setStatus: (status: string) => void,
      setStatusClass: (statusClass: string) => void
    ) => {
      if (!data.file) {
        setStatus(t("selectImageFirst"));
        setStatusClass("error");
        return null;
      }

      setStatus(t("processingImage"));
      setStatusClass("processing");

      try {
        const result = await documentStore.extractText(
          data.file,
          data.language,
          data.clasifier === "true"
        );

        setStatus(result.signal || result.status || t("success"));
        setStatusClass("success");

        return { result };
      } catch (error) {
        console.error(error);
        setStatus(t("errorProcessing"));
        setStatusClass("error");
        return { result: null };
      }
    },
    [t, documentStore]
  );

  const resetExtractedLines = useCallback(() => {
    setExtractedLines([]);
  }, [setExtractedLines]);

  return {
    extractedLines,
    setExtractedLines,
    extractText,
    resetExtractedLines,
    isLoading: documentStore.isLoading,
  };
};
