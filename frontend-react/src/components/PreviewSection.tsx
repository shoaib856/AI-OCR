import {
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import { useResizeObserver } from "usehooks-ts";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useController, type Control } from "react-hook-form";
import { type ExtractedLine } from "../stores/documentStore";
import { LoaderPinwheel, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormData {
  file: FileList;
  language: string;
  clasifier: string;
}

interface PreviewSectionProps {
  showPreview: boolean;
  previewSrc: string;
  isProcessing: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  control: Control<FormData>;
  extractedLines: ExtractedLine[];
  showAllBoxes: boolean;
  activeLine: number | null;
  onSetActiveLine: (index: number) => void;
}

export interface PreviewSectionRef {
  container: HTMLDivElement | null;
}

const PreviewSection = forwardRef<PreviewSectionRef, PreviewSectionProps>(
  (
    {
      showPreview,
      previewSrc,
      isProcessing,
      onSubmit,
      control,
      extractedLines,
      showAllBoxes,
      activeLine,
      onSetActiveLine,
    },
    ref
  ) => {
    const { t, i18n } = useTranslation();
    const { field: selectedLanguage } = useController({
      control,
      name: "language",
    });
    const { field: clasifier } = useController({ control, name: "clasifier" });

    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [scale, setScale] = useState({ x: 1, y: 1 });

    useImperativeHandle(ref, () => ({
      container: containerRef.current,
    }));

    const handleLanguageChange = (newLanguage: string) => {
      selectedLanguage.onChange(newLanguage);
      i18n.changeLanguage(newLanguage);
    };

    const handleClassifierChange = (value: string) => {
      clasifier.onChange(value);
    };

    const handleImageLoad = () => {
      if (imageRef.current) {
        const img = imageRef.current;

        // Calculate scale based on displayed image size
        const scaleX = img.clientWidth / img.naturalWidth;
        const scaleY = img.clientHeight / img.naturalHeight;
        setScale({ x: scaleX, y: scaleY });
      }
    };

    // Handle container resize using useResizeObserver
    const { width: containerWidth, height: containerHeight } =
      useResizeObserver({
        ref: containerRef as React.RefObject<HTMLDivElement>,
        box: "content-box",
      });

    // Update scale when container size changes
    useEffect(() => {
      if (!imageRef.current || !containerWidth || !containerHeight) return;

      const img = imageRef.current;
      const scaleX = img.clientWidth / img.naturalWidth;
      const scaleY = img.clientHeight / img.naturalHeight;
      setScale({ x: scaleX, y: scaleY });
    }, [containerWidth, containerHeight]);

    return (
      <div
        className={cn(
          "bg-gray-100 p-4 rounded-2xl border border-gray-200 shadow-lg w-3/5 ml-2",
          {
            "flex flex-col": showPreview,
            hidden: !showPreview,
          }
        )}
      >
        {/* Form inputs are now controlled via useController */}

        <div className="flex justify-center items-center mb-5 gap-2">
          <Select
            dir={i18n.dir()}
            value={selectedLanguage.value}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("language.selectLanguage")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t("language.english")}</SelectItem>
              <SelectItem value="ar">{t("language.arabic")}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            dir={i18n.dir()}
            value={clasifier.value}
            onValueChange={handleClassifierChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("language.selectClassifier")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">{t("classifier.use")}</SelectItem>
              <SelectItem value="false">{t("classifier.without")}</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-center">
            <button
              onClick={onSubmit}
              type="button"
              disabled={isProcessing}
              className={cn(
                "bg-blue-600 text-white px-4 py-2 rounded-lg border-none cursor-pointer flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              )}
            >
              {!isProcessing && <Sparkles className="size-4" />}
              {isProcessing
                ? t("processing.loading")
                : t("processing.generateText")}
              {isProcessing && (
                <LoaderPinwheel className="size-4 animate-spin" />
              )}
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative w-full min-h-[240px] bg-gray-800 rounded-xl overflow-auto border border-gray-200 flex justify-center items-center p-4"
        >
          <div className="relative inline-block">
            <img
              ref={imageRef}
              src={previewSrc}
              alt={t("preview.preview")}
              onLoad={handleImageLoad}
              className="max-w-full h-auto block"
            />

            {/* Draw all line boxes */}
            {showAllBoxes &&
              extractedLines.length > 0 &&
              extractedLines.map(
                (line, i) =>
                  activeLine !== i && (
                    <button
                      key={`line-${i}`}
                      className="absolute border-2 border-green-500 cursor-pointer hover:border-green-600 hover:bg-green-100/20 transition-all duration-200"
                      style={{
                        left: line.box[0] * scale.x - 5,
                        top: line.box[1] * scale.y,
                        width: line.box[2] * scale.x + 10,
                        height: line.box[3] * scale.y,
                      }}
                      onClick={() => onSetActiveLine(i)}
                      title={`${t("preview.clickToSelectLine")} ${i + 1}: ${
                        line.text || t("preview.noText")
                      }`}
                    />
                  )
              )}

            {/* Draw active line */}
            {activeLine !== null && extractedLines[activeLine] && (
              <>
                <button
                  className="absolute border-4 border-red-500 cursor-pointer hover:border-red-600 hover:bg-red-100/20 transition-all duration-200"
                  style={{
                    left: extractedLines[activeLine].box[0] * scale.x - 8,
                    top: extractedLines[activeLine].box[1] * scale.y - 4,
                    width: extractedLines[activeLine].box[2] * scale.x + 16,
                    height: extractedLines[activeLine].box[3] * scale.y + 8,
                  }}
                  onClick={() => onSetActiveLine(activeLine)}
                  title={`${t("preview.activeLine")} ${activeLine + 1}: ${
                    extractedLines[activeLine].text || t("preview.noText")
                  }`}
                />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);

PreviewSection.displayName = "PreviewSection";

export default PreviewSection;
