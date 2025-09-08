import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useCanvas } from "../hooks/useCanvas";
import { useDocumentForm } from "../hooks/useDocumentForm";
import { useDocumentAPI } from "../hooks/useDocumentAPI";
import { createEmptyLine } from "../utils/documentUtils";
import { type ExtractedLine } from "../stores/documentStore";
import HeaderSection from "./HeaderSection";
import UploadSection from "./UploadSection";
import PreviewSection from "./PreviewSection";
import ResultsSection from "./ResultsSection";
import { cn } from "@/lib/utils";

interface FormData {
  file: FileList;
  language: string;
  clasifier: string;
}

const DocumentDigitizer = () => {
  const { t, i18n } = useTranslation();

  // Local state for extracted lines
  const [extractedLines, setExtractedLines] = useState<ExtractedLine[]>([]);

  // Custom hooks
  const canvas = useCanvas();
  const form = useDocumentForm();
  const api = useDocumentAPI({ extractedLines, setExtractedLines });

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

  const onSubmit = useCallback(
    async (data: FormData) => {
      await api.extractText(
        form.selectedFile,
        data,
        form.setStatus,
        form.setStatusClass
      );
    },
    [api]
  );

  // Effects
  useEffect(() => {
    form.setValue("language", i18n.language);
  }, [i18n.language]);

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
        />

        {/* Preview Section */}
        <PreviewSection
          ref={canvas.previewSectionRef}
          showPreview={showPreview}
          previewSrc={form.previewSrc}
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
        />
      </section>
    </div>
  );
};

export default DocumentDigitizer;
