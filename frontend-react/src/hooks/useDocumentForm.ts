import { useState, useCallback, useEffect } from "react";
import { useForm, useController } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface FormData {
  file: FileList;
  language: string;
  clasifier: string;
}

export const useDocumentForm = () => {
  const { i18n, t } = useTranslation();
  const locale = i18n.language;

  // Local state for form data
  const [selectedLanguage, setSelectedLanguage] = useState<string>(locale);
  const [classifier, setClassifier] = useState<string>("false");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setLocalPreviewSrc] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [statusClass, setStatusClass] = useState<string>("");

  const form = useForm<FormData>({
    defaultValues: {
      language: selectedLanguage,
      clasifier: classifier,
    },
  });

  // Use controllers for form fields
  const languageController = useController({
    name: "language",
    control: form.control,
    defaultValue: selectedLanguage,
  });

  const classifierController = useController({
    name: "clasifier",
    control: form.control,
    defaultValue: classifier,
  });

  // Update form when storage values change
  useEffect(() => {
    classifierController.field.onChange(selectedLanguage);
    classifierController.field.onChange(classifier);
  }, [selectedLanguage, classifier]);

  // Set initial language from locale
  useEffect(() => {
    if (locale && !selectedLanguage) {
      setSelectedLanguage(locale);
    }
  }, [locale, selectedLanguage, setSelectedLanguage]);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setStatus(t("processing.fileSelected"));
    setStatusClass("success");

    // Create preview URL
    const url = URL.createObjectURL(file);
    setLocalPreviewSrc(url);
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

  const handleClassifierChange = useCallback(
    (classifier: string) => {
      setClassifier(classifier);
      classifierController.field.onChange(classifier);
    },
    [setClassifier, classifierController.field]
  );

  const resetForm = useCallback(() => {
    setSelectedFile(null);
    setLocalPreviewSrc("");
    setStatus("");
    setStatusClass("");
    form.reset();
  }, [form]);

  return {
    ...form,
    selectedFile,
    previewSrc,
    status,
    statusClass,
    setStatus,
    setStatusClass,
    handleFileSelect,
    handleFileChange,
    handleClassifierChange,
    resetForm,
    // Controllers for controlled inputs
    languageController,
    classifierController,
  };
};
