import { useTranslation } from "react-i18next";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { type ExtractedLine } from "../stores/documentStore";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface ResultsSectionProps {
  showResults: boolean;
  extractedLines: ExtractedLine[];
  activeLine: number | null;
  showAllBoxes: boolean;
  onToggleBoxes: () => void;
  onSetActiveLine: (index: number) => void;
  onUnselectLine: () => void;
  documentType: string | null;
}

const ResultsSection = ({
  showResults,
  extractedLines,
  activeLine,
  showAllBoxes,
  onToggleBoxes,
  onSetActiveLine,
  onUnselectLine,
  documentType,
}: ResultsSectionProps) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  // Handle section visibility animation
  useEffect(() => {
    if (showResults) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setVisibleItems([]);
    }
  }, [showResults]);

  // Handle staggered item animations
  useEffect(() => {
    if (isVisible && extractedLines.length > 0) {
      const timer = setTimeout(() => {
        extractedLines.forEach((_, index) => {
          setTimeout(() => {
            setVisibleItems((prev) => [...prev, index]);
          }, index * 100); // 100ms delay between each item
        });
      }, 200); // Initial delay before starting animations

      return () => clearTimeout(timer);
    } else {
      setVisibleItems([]);
    }
  }, [isVisible, extractedLines.length]);

  return (
    <div
      className={cn(
        "bg-white w-1/4 ml-2 p-5 rounded-lg border border-gray-300 transition-all duration-500 ease-out",
        {
          "opacity-100 translate-y-0": isVisible,
          "opacity-0 -translate-y-4": !isVisible,
          block: showResults,
          hidden: !showResults,
        }
      )}
    >
      <div
        className={cn(
          "flex justify-between items-center pb-1 border-b border-dashed border-gray-300 mb-2 transition-all duration-300 delay-100",
          {
            "opacity-100 translate-y-0": isVisible,
            "opacity-0 -translate-y-2": !isVisible,
          }
        )}
      >
        <div className="flex items-center gap-2">
          <strong className="text-lg font-semibold text-blue-600">
            {t("results.title")}
          </strong>
          <span
            className={cn(
              "bg-gray-100 px-2 py-1 rounded text-sm font-medium text-gray-600 transition-all duration-300",
              {
                "scale-100": isVisible,
                "scale-0": !isVisible,
              }
            )}
          >
            {extractedLines.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-blue-600" htmlFor="show-all-boxes">
            {showAllBoxes ? t("results.hideLines") : t("results.showLines")}
          </label>
          <Switch
            id="show-all-boxes"
            checked={showAllBoxes}
            onCheckedChange={onToggleBoxes}
            title={t("results.toggleLineBoxes")}
          />
        </div>
      </div>
      <ol className="m-0 p-0 list-none max-h-[60vh] overflow-auto">
        {extractedLines.length === 0 ? (
          <li
            className={cn(
              "p-3 text-center text-gray-500 italic transition-all duration-300",
              {
                "opacity-100 translate-y-0": isVisible,
                "opacity-0 -translate-y-2": !isVisible,
              }
            )}
          >
            {t("results.noLinesExtracted")}
          </li>
        ) : (
          <>
            {/* Document Type Declaration */}
            {documentType && (
              <li
                className={cn(
                  "p-4 mb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-r-lg transition-all duration-300",
                  {
                    "opacity-100 translate-y-0": isVisible,
                    "opacity-0 -translate-y-2": !isVisible,
                  }
                )}
                style={{
                  transitionDelay: "0ms",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-green-700 uppercase tracking-wide">
                    {t("results.documentType")}:
                  </span>
                  <span className="text-sm font-medium text-green-800 bg-green-100 px-2 py-1 rounded">
                    {documentType}
                  </span>
                </div>
              </li>
            )}

            {/* Extracted Lines */}
            {extractedLines.map((line, index) => (
              <li
                key={index}
                onClick={() => onSetActiveLine(index)}
                title={`Score: ${line.score ?? "?"}`}
                className={cn(
                  "p-3 border-b border-dashed hover:bg-blue-50 hover:border-blue-200 border-gray-300 cursor-pointer transition-all duration-300 ease-out",
                  {
                    "bg-blue-100 border-blue-300 shadow-sm":
                      activeLine === index,
                    "opacity-100 translate-y-0": visibleItems.includes(index),
                    "opacity-0 -translate-y-4": !visibleItems.includes(index),
                  }
                )}
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <span
                      className="text-sm leading-relaxed break-words block"
                      dir="auto"
                    >
                      {line.text || t("preview.noText")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {line.pageNum && line.pageNum > 1 && (
                      <span
                        className={cn(
                          "text-xs text-blue-600 bg-blue-50 px-1 rounded transition-all duration-200",
                          {
                            "scale-100 opacity-100":
                              visibleItems.includes(index),
                            "scale-0 opacity-0": !visibleItems.includes(index),
                          }
                        )}
                      >
                        P{line.pageNum}
                      </span>
                    )}
                    {activeLine === index && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ms-1 size-6 p-0 rounded-full bg-red-200 hover:bg-red-100 text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUnselectLine();
                        }}
                        title={t("results.unselectLine")}
                      >
                        <X className="size-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </>
        )}
      </ol>
      {extractedLines.length > 0 && (
        <div
          className={cn(
            "mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600 transition-all duration-500 delay-300",
            {
              "opacity-100 translate-y-0": isVisible,
              "opacity-0 -translate-y-2": !isVisible,
            }
          )}
        >
          {t("preview.clickHint")}
        </div>
      )}
    </div>
  );
};

export default ResultsSection;
