import { cn } from "@/lib/utils";
import { type ChatMessage as ChatMessageType } from "@/stores/documentStore";
import { User, Bot, AlertCircle } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
  isError?: boolean;
}

const ChatMessage = ({ message, isError = false }: ChatMessageProps) => {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  return (
    <div
      className={cn("flex gap-3 p-3 transition-all duration-200", {
        "justify-end": isUser,
        "justify-start": isAssistant,
      })}
    >
      {isAssistant && (
        <div className="flex-shrink-0">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              {
                "bg-blue-100 text-blue-600": !isError,
                "bg-red-100 text-red-600": isError,
              }
            )}
          >
            {isError ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
          </div>
        </div>
      )}

      <div
        className={cn("max-w-[80%] rounded-lg px-4 py-2 shadow-sm", {
          "bg-blue-500 text-white": isUser,
          "bg-gray-100 text-gray-900": isAssistant && !isError,
          "bg-red-50 text-red-800 border border-red-200":
            isAssistant && isError,
        })}
      >
        <div className="text-sm leading-relaxed break-words" dir="auto">
          {message.content}
        </div>
        <div
          className={cn("text-xs mt-1 opacity-70", {
            "text-blue-100": isUser,
            "text-gray-500": isAssistant && !isError,
            "text-red-500": isAssistant && isError,
          })}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
