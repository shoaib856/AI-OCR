import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useCanvas } from "../hooks/useCanvas";
import { useDocumentForm } from "../hooks/useDocumentForm";
import { useDocumentAPI } from "../hooks/useDocumentAPI";
import { useDocumentStore } from "../stores/documentStore";
import { createEmptyLine } from "../utils/documentUtils";
import { parseApiResponse, extractDocumentType } from "../utils/responseParser";
import { type ExtractedLine } from "../stores/documentStore";
import HeaderSection from "./HeaderSection";
import UploadSection from "./UploadSection";
import PreviewSection from "./PreviewSection";
import ResultsSection from "./ResultsSection";
import { cn } from "@/lib/utils";
import type { DocumentFormData } from "@/lib/types";

const DocumentDigitizer = () => {
  const { t } = useTranslation();

  // Local state for extracted lines
  const [extractedLines, setExtractedLines] = useState<ExtractedLine[]>([]);

  // Custom hooks
  const canvas = useCanvas();
  const form = useDocumentForm();
  const api = useDocumentAPI({ extractedLines, setExtractedLines });
  const documentStore = useDocumentStore();

  // Local state
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Enhanced file selection handler
  const handleFileSelect = useCallback(
    (file: File) => {
      form.handleFileSelect(file);
      setShowPreview(true);
      setShowResults(true);

      // Clear previous results and show upload message
      setExtractedLines([createEmptyLine(t("processing.imageUploaded"))]);
    },
    [setExtractedLines, t]
  );

  // Canvas handlers (now handled in PreviewSection)
  const handleSetActiveLine = useCallback(
    (index: number) => {
      canvas.handleSetActiveLine(index);
    },
    [canvas]
  );

  const handleToggleAllBoxes = useCallback(() => {
    canvas.handleToggleAllBoxes();
  }, [canvas]);

  const handleUnselectLine = useCallback(() => {
    canvas.handleUnselectLine();
  }, [canvas]);

  const onSubmit = useCallback(
    async (data: DocumentFormData) => {
      const result = await api.extractText(
        data,
        form.setStatus,
        form.setStatusClass
      );
      if (result?.result) {
        const lines = parseApiResponse(result.result);
        const docType = extractDocumentType(result.result);
        setExtractedLines(lines);
        documentStore.setDocumentType(docType);
      }
    },
    [api, setExtractedLines, documentStore]
  );

  return (
    <div className={cn("min-h-screen flex flex-col bg-white")}>
      {/* Header */}
      <HeaderSection />

      {/* Main Content */}
      <section className={cn("bg-white p-5 flex gap-5 flex-1")}>
        {/* Upload Section */}
        <UploadSection
          onSubmit={form.handleSubmit(onSubmit)}
          onFileSelected={handleFileSelect}
          onFileChange={form.handleFileChange}
          errors={form.formState.errors}
          control={form.control}
        />

        {/* Preview Section */}
        <PreviewSection
          ref={canvas.previewSectionRef}
          showPreview={showPreview}
          isProcessing={api.isLoading}
          onSubmit={form.handleSubmit(onSubmit)}
          control={form.control}
          extractedLines={extractedLines}
          showAllBoxes={canvas.showAllBoxes}
          activeLine={canvas.activeLine}
          onSetActiveLine={handleSetActiveLine}
        />

        {/* Results Section */}
        <ResultsSection
          showResults={showResults}
          extractedLines={extractedLines}
          activeLine={canvas.activeLine}
          showAllBoxes={canvas.showAllBoxes}
          onToggleBoxes={handleToggleAllBoxes}
          onSetActiveLine={handleSetActiveLine}
          onUnselectLine={handleUnselectLine}
          documentType={documentStore.documentType}
        />
      </section>
    </div>
  );
};

export default DocumentDigitizer;
