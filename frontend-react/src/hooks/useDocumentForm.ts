import type { DocumentFormData } from "@/lib/types";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const useDocumentForm = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<string>("");
  const [statusClass, setStatusClass] = useState<string>("");

  const form = useForm<DocumentFormData>({
    defaultValues: {
      language: "ar",
      clasifier: "false",
      file: null,
      previewSrc: "",
    },
  });

  const handleFileSelect = useCallback((file: File) => {
    form.setValue("file", file, { shouldValidate: true });
    setStatus(t("processing.fileSelected"));
    setStatusClass("success");

    // Create preview URL
    const url = URL.createObjectURL(file);
    form.setValue("previewSrc", url, { shouldValidate: true });
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const resetForm = useCallback(() => {
    setStatus("");
    setStatusClass("");
    form.reset();
  }, [form]);

  return {
    ...form,
    status,
    statusClass,
    setStatus,
    setStatusClass,
    handleFileSelect,
    handleFileChange,
    resetForm,
  };
};
