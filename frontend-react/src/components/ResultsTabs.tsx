import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { type ExtractedLine } from "../stores/documentStore";
import { cn } from "@/lib/utils";
import { FileText, MessageSquare } from "lucide-react";
import ResultsTab from "./ResultsTab";
import ChatSection from "./ChatSection";

interface ResultsTabsProps {
  extractedLines: ExtractedLine[];
  activeLine: number | null;
  showAllBoxes: boolean;
  onToggleBoxes: () => void;
  onSetActiveLine: (index: number) => void;
  onUnselectLine: () => void;
  documentType: string | null;
  isVisible: boolean;
}

const ResultsTabs = ({
  extractedLines,
  activeLine,
  showAllBoxes,
  onToggleBoxes,
  onSetActiveLine,
  onUnselectLine,
  documentType,
  isVisible,
}: ResultsTabsProps) => {
  const { t, i18n } = useTranslation();

  return (
    <Tabs
      dir={i18n.dir()}
      defaultValue="results"
      className="flex flex-col h-full"
    >
      {/* Tab Navigation */}
      <div
        className={cn("transition-all duration-300 delay-100", {
          "opacity-100 translate-y-0": isVisible,
          "opacity-0 -translate-y-2": !isVisible,
        })}
      >
        <TabsList className="w-full h-auto bg-gray-100 border-b rounded-b-none gap-1 border-gray-200">
          <TabsTrigger
            value="results"
            className="px-2 sm:px-4 py-2 sm:py-3 rounded-e-none text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 flex items-center gap-1 sm:gap-2"
          >
            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">
              {t("results.tabs.results")}
            </span>
            <span className="sm:hidden">{t("results.tabs.resultsShort")}</span>
            {extractedLines.length > 0 && (
              <span className="bg-gray-200 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium text-gray-600">
                {extractedLines.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="px-2 sm:px-4 py-2 sm:py-3 rounded-s-none text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 flex items-center gap-1 sm:gap-2"
          >
            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{t("results.tabs.chat")}</span>
            <span className="sm:hidden">{t("results.tabs.chatShort")}</span>
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Tab Content */}
      <TabsContent value="results" className="flex-1 flex flex-col">
        <ResultsTab
          extractedLines={extractedLines}
          activeLine={activeLine}
          showAllBoxes={showAllBoxes}
          onToggleBoxes={onToggleBoxes}
          onSetActiveLine={onSetActiveLine}
          onUnselectLine={onUnselectLine}
          documentType={documentType}
          isVisible={isVisible}
        />
      </TabsContent>

      <TabsContent value="chat" className="flex-1 flex flex-col">
        <ChatSection isVisible={isVisible} />
      </TabsContent>
    </Tabs>
  );
};

export default ResultsTabs;
