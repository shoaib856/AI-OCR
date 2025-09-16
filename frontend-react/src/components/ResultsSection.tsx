import { type ExtractedLine } from "../stores/documentStore";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import ResultsTabs from "./ResultsTabs";

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
  const [isVisible, setIsVisible] = useState(false);

  // Handle section visibility animation
  useEffect(() => {
    if (showResults) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [showResults]);

  return (
    <div
      className={cn(
        "bg-white w-full h-fit rounded-lg border border-gray-300 transition-all duration-500 ease-out",
        {
          "opacity-100 translate-y-0": isVisible,
          "opacity-0 -translate-y-4": !isVisible,
          block: showResults,
          hidden: !showResults,
        }
      )}
    >
      <ResultsTabs
        extractedLines={extractedLines}
        activeLine={activeLine}
        showAllBoxes={showAllBoxes}
        onToggleBoxes={onToggleBoxes}
        onSetActiveLine={onSetActiveLine}
        onUnselectLine={onUnselectLine}
        documentType={documentType}
        isVisible={isVisible}
      />
    </div>
  );
};

export default ResultsSection;
