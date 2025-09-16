import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useCanvas } from "../hooks/useCanvas";
import { useDocumentForm } from "../hooks/useDocumentForm";
import { useDocumentStore } from "../stores/documentStore";
import HeaderSection from "./HeaderSection";
import UploadSection from "./UploadSection";
import PreviewSection from "./PreviewSection";
import ResultsSection from "./ResultsSection";
import { cn } from "@/lib/utils";
import type { DocumentFormData } from "@/lib/types";

const DocumentDigitizer = () => {
  const { t } = useTranslation();

  // Custom hooks
  const canvas = useCanvas();
  const form = useDocumentForm();

  // Subscribe to store state changes
  const {
    extractedLines,
    documentType,
    isLoading,
    extractText,
    setExtractedLines,
  } = useDocumentStore();

  // Local state
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Enhanced file selection handler
  const handleFileSelect = useCallback(
    (file: File) => {
      form.handleFileSelect(file);
      setShowPreview(true);
      setShowResults(true);

      // Clear previous results
      setExtractedLines([]);
    },
    [setExtractedLines]
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
      try {
        form.setStatus(t("processingImage"));
        form.setStatusClass("processing");

        const result = await extractText(
          data.file!,
          data.language,
          data.clasifier === "true"
        );

        form.setStatus(result.signal || result.status || t("success"));
        form.setStatusClass("success");
      } catch (error) {
        console.error(error);
        form.setStatus(t("errorProcessing"));
        form.setStatusClass("error");
      }
    },
    [extractText]
  );

  return (
    <div className={cn("min-h-screen flex flex-col bg-white")}>
      {/* Header */}
      <HeaderSection />

      {/* Main Content */}
      <section
        className={cn(
          "bg-white p-2 sm:p-4 lg:p-5 flex-1",
          "grid-document-layout auto-rows-min"
        )}
      >
        {/* Upload Section */}
        <div className="grid-upload-section">
          <UploadSection
            onSubmit={form.handleSubmit(onSubmit)}
            onFileSelected={handleFileSelect}
            onFileChange={form.handleFileChange}
            errors={form.formState.errors}
            control={form.control}
          />
        </div>

        {/* Preview Section */}
        <div className="grid-preview-section">
          <PreviewSection
            ref={canvas.previewSectionRef}
            showPreview={showPreview}
            isProcessing={isLoading}
            onSubmit={form.handleSubmit(onSubmit)}
            control={form.control}
            extractedLines={extractedLines}
            showAllBoxes={canvas.showAllBoxes}
            activeLine={canvas.activeLine}
            onSetActiveLine={handleSetActiveLine}
          />
        </div>

        {/* Results Section */}
        <div className="grid-results-section">
          <ResultsSection
            showResults={showResults}
            extractedLines={extractedLines}
            activeLine={canvas.activeLine}
            showAllBoxes={canvas.showAllBoxes}
            onToggleBoxes={handleToggleAllBoxes}
            onSetActiveLine={handleSetActiveLine}
            onUnselectLine={handleUnselectLine}
            documentType={documentType}
          />
        </div>
      </section>
    </div>
  );
};

export default DocumentDigitizer;
