import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDocumentStore } from "@/stores/documentStore";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Button } from "./ui/button";
import { Trash2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatSectionProps {
  isVisible: boolean;
}

const ChatSection = ({ isVisible }: ChatSectionProps) => {
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    chatMessages,
    isChatLoading,
    chatError,
    sendChatMessage,
    clearChatMessages,
    isLoading,
    extractedLines,
  } = useDocumentStore();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = (message: string) => {
    sendChatMessage(message);
  };

  const handleClearMessages = () => {
    clearChatMessages();
  };

  const handleRetryLastMessage = () => {
    if (chatMessages.length > 0) {
      const lastUserMessage = [...chatMessages]
        .reverse()
        .find((msg) => msg.role === "user");
      if (lastUserMessage) {
        // Remove the last user message and any error messages after it
        const lastUserIndex = chatMessages.findIndex(
          (msg) => msg.id === lastUserMessage.id
        );
        const filteredMessages = chatMessages.slice(0, lastUserIndex);

        // Update messages and retry
        useDocumentStore.setState({ chatMessages: filteredMessages });
        sendChatMessage(lastUserMessage.content);
      }
    }
  };

  const hasError = chatError && chatMessages.length > 0;
  const lastMessage = chatMessages[chatMessages.length - 1];
  const showRetry = hasError && lastMessage?.role === "assistant";

  // Determine if chat should be disabled and why
  const isChatDisabled = isLoading || extractedLines.length === 0;
  const getDisabledReason = () => {
    if (isLoading) {
      return t("chat.processingInProgress");
    }
    if (extractedLines.length === 0) {
      return t("chat.noDocumentProcessed");
    }
    return undefined;
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full transition-all duration-500 ease-out",
        {
          "opacity-100 translate-y-0": isVisible,
          "opacity-0 -translate-y-4": !isVisible,
        }
      )}
    >
      {/* Chat Header */}
      <div
        className={cn(
          "flex justify-between items-center p-4 border-b border-gray-200 transition-all duration-300",
          {
            "opacity-100 translate-y-0": isVisible,
            "opacity-0 -translate-y-2": !isVisible,
          }
        )}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-blue-600">
            {t("chat.title")}
          </h3>
          {chatMessages.length > 0 && (
            <span className="bg-gray-100 px-2 py-1 rounded text-sm font-medium text-gray-600">
              {chatMessages.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetryLastMessage}
              disabled={isChatLoading}
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              {t("chat.retry")}
            </Button>
          )}
          {chatMessages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearMessages}
              disabled={isChatLoading}
              className="text-xs text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              {t("chat.clear")}
            </Button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto max-h-[60vh]">
        {chatMessages.length === 0 ? (
          <div
            className={cn(
              "flex items-center justify-center h-full p-8 text-center transition-all duration-300",
              {
                "opacity-100 translate-y-0": isVisible,
                "opacity-0 -translate-y-2": !isVisible,
              }
            )}
          >
            <div className="text-gray-500">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-sm">{t("chat.noMessages")}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {chatMessages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isError={
                  message.role === "assistant" &&
                  message.content === "Error sending message"
                }
              />
            ))}
            {isChatLoading && (
              <div className="flex justify-start p-3">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isChatLoading}
        disabled={!isVisible || isChatDisabled}
        disabledReason={isChatDisabled ? getDisabledReason() : undefined}
      />
    </div>
  );
};

export default ChatSection;
