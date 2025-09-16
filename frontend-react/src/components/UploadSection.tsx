import React from "react";
import { Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useController, type Control, type FieldErrors } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { DocumentFormData } from "@/lib/types";

interface UploadSectionProps {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onFileSelected: (file: File) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors: FieldErrors<DocumentFormData>;
  control: Control<DocumentFormData>;
}

const UploadSection = ({
  onSubmit,
  onFileSelected,
  onFileChange,
  errors,
  control,
}: UploadSectionProps) => {
  const { t } = useTranslation();
  const { field: imagePreview } = useController({
    control,
    name: "previewSrc",
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
    onFileChange(event);
  };

  return (
    <div className="bg-white text-gray-800 border border-gray-300 p-3 sm:p-4 lg:p-5 rounded-lg w-full h-fit">
      <div className="h-full flex flex-col">
        <form onSubmit={onSubmit} id="upload-form">
          {/* Upload area - always visible */}
          <div
            className={cn(
              "bg-white hover:bg-blue-50 w-full py-4 sm:py-3 rounded-2xl flex flex-col justify-center items-center text-center mx-auto transition-all duration-300 relative mb-3 border-2 border-dashed border-gray-300 hover:border-blue-400 min-h-[120px] sm:min-h-[100px]"
            )}
          >
            <label
              htmlFor="file"
              className="flex flex-col items-center cursor-pointer w-full h-full justify-center"
            >
              <Upload className="text-2xl sm:text-3xl text-gray-400" />
              <h4 className="my-1 text-xs sm:text-sm text-blue-600">
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
        {imagePreview.value && (
          <div className="w-full border-2 border-blue-400 rounded-2xl overflow-hidden">
            <img
              src={imagePreview.value}
              alt="Image Preview"
              className="img-responsive-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;
