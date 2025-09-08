import React, { useState } from "react";
import { Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { FieldErrors } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormData {
  file: FileList;
  language: string;
  clasifier: string;
}

interface UploadSectionProps {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onFileSelected: (file: File) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors: FieldErrors<FormData>;
}

const UploadSection = ({
  onSubmit,
  onFileSelected,
  onFileChange,
  errors,
}: UploadSectionProps) => {
  const { t } = useTranslation();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected(file);
      setImagePreview(URL.createObjectURL(file));
    }
    onFileChange(event);
  };

  return (
    <div className="bg-white text-gray-800 border border-gray-300 p-5 rounded-lg w-1/6 min-w-[200px]">
      <div className="h-full flex flex-col">
        <form onSubmit={onSubmit} id="upload-form">
          {/* Upload area - always visible */}
          <div
            className={cn(
              "bg-white hover:bg-blue-50 w-full py-3 rounded-2xl flex flex-col justify-center items-center text-center mx-auto transition-all duration-300 relative mb-3 border-2 border-dashed border-gray-300 hover:border-blue-400"
            )}
          >
            <label
              htmlFor="file"
              className="flex flex-col items-center cursor-pointer w-full h-full justify-center"
            >
              <Upload className="text-3xl text-gray-400" />
              <h4 className="my-1 text-sm text-blue-600">
                {t("upload.click")}
              </h4>
              <p className="text-xs text-gray-400">{t("upload.formats")}</p>
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileSelect}
              accept="image/*,application/pdf"
              className="hidden"
            />
          </div>

          {errors.file && (
            <p className="text-red-500 text-xs mt-1 text-center">
              {errors.file.message}
            </p>
          )}
        </form>
        {imagePreview && (
          <div className="w-full border-2 border-blue-400 rounded-2xl overflow-hidden">
            <img src={imagePreview} alt="Image Preview" />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;
