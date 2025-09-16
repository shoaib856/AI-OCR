import { create } from "zustand";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/endpoints";

export interface WordBox {
  box: [number, number, number, number]; // [x, y, width, height]
}

export interface ExtractedLine {
  text: string;
  score: number | null;
  box: [number, number, number, number]; // [x, y, width, height]
  words: WordBox[];
  pageNum?: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface DocumentState {
  extractedLines: ExtractedLine[];
  imageDimensions: { width: number; height: number };
  isLoading: boolean;
  error: string | null;
  documentType: string | null;
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  chatError: string | null;
}

interface DocumentActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setExtractedLines: (lines: ExtractedLine[]) => void;
  setImageDimensions: (dimensions: { width: number; height: number }) => void;
  setDocumentType: (documentType: string | null) => void;
  extractText: (
    file: File,
    language: string,
    clasifier: boolean
  ) => Promise<any>;
  // Chat actions
  addChatMessage: (message: ChatMessage) => void;
  setChatLoading: (loading: boolean) => void;
  setChatError: (error: string | null) => void;
  clearChatMessages: () => void;
  sendChatMessage: (query: string) => Promise<void>;
  reset: () => void;
}

type DocumentStore = DocumentState & DocumentActions;

const initialState: DocumentState = {
  extractedLines: [],
  imageDimensions: { width: 0, height: 0 },
  isLoading: false,
  error: null,
  documentType: null,
  chatMessages: [],
  isChatLoading: false,
  chatError: null,
};

export const useDocumentStore = create<DocumentStore>((set) => ({
  ...initialState,

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  setExtractedLines: (lines: ExtractedLine[]) => set({ extractedLines: lines }),

  setImageDimensions: (dimensions: { width: number; height: number }) =>
    set({ imageDimensions: dimensions }),

  setDocumentType: (documentType: string | null) => set({ documentType }),

  extractText: async (file: File, language: string, clasifier: boolean) => {
    set({ isLoading: true, error: null });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", language);
      formData.append("clasifier", clasifier.toString());

      const response = await axios.post(API_ENDPOINTS.EXTRACT, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = response.data;

      // Handle the nested structure: line_datas[0].line_data
      let extractedLines: any[] = [];

      if (
        result.line_datas &&
        Array.isArray(result.line_datas) &&
        result.line_datas.length > 0
      ) {
        const firstPage = result.line_datas[0];

        if (firstPage.line_data && Array.isArray(firstPage.line_data)) {
          extractedLines = firstPage.line_data.map((line: any) => ({
            text: line.line_text || line.text || "",
            score: line.score || null,
            box: line.line_box || line.box || [0, 0, 0, 0],
            words: (line.word_boxes || []).map((wordBox: number[]) => ({
              box: wordBox as [number, number, number, number],
            })),
            pageNum: firstPage.Page_num || firstPage.page_num || 1,
          }));
        }
      }

      if (extractedLines.length > 0) {
        set({
          isLoading: false,
          extractedLines,
          documentType: result.document_type || result.documentType || null,
          chatMessages: [], // Clear chat when new document is processed
          chatError: null,
        });
      } else {
        // Still update the store with empty data to clear previous state
        set({
          isLoading: false,
          extractedLines: [],
          documentType: result.document_type || result.documentType || null,
          chatMessages: [],
          chatError: null,
        });
      }

      return result;
    } catch (error) {
      set({ isLoading: false, error: "Failed to extract text" });
      throw error;
    }
  },

  // Chat actions
  addChatMessage: (message: ChatMessage) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),

  setChatLoading: (loading: boolean) => set({ isChatLoading: loading }),

  setChatError: (error: string | null) => set({ chatError: error }),

  clearChatMessages: () => set({ chatMessages: [], chatError: null }),

  sendChatMessage: async (query: string) => {
    if (!query.trim()) return;

    // Check if already loading
    const currentState = useDocumentStore.getState();
    if (currentState.isChatLoading) return;

    // Check if document extraction is still in progress
    if (currentState.isLoading) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content:
          "Please wait for document processing to complete before asking questions.",
        role: "assistant",
        timestamp: new Date(),
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, errorMessage],
        chatError: "Document processing in progress",
      }));
      return;
    }

    // Check if no document has been processed yet
    if (currentState.extractedLines.length === 0) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content:
          "Please upload and process a document first before asking questions.",
        role: "assistant",
        timestamp: new Date(),
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, errorMessage],
        chatError: "No document processed",
      }));
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: query,
      role: "user",
      timestamp: new Date(),
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, userMessage],
      isChatLoading: true,
      chatError: null,
    }));

    try {
      // Get the latest state after setting loading
      const latestState = useDocumentStore.getState();

      // Prepare the OCR data payload with latest state
      const ocrData = {
        extractedLines: latestState.extractedLines,
        documentType: latestState.documentType,
        totalLines: latestState.extractedLines.length,
      };

      // Debug log to verify data being sent
      console.log("Sending chat data:", {
        query,
        ocrData: {
          documentType: ocrData.documentType,
          totalLines: ocrData.totalLines,
          extractedLinesCount: ocrData.extractedLines.length,
          extractedLines: ocrData.extractedLines,
        },
      });

      const response = await axios.post(
        API_ENDPOINTS.CHAT,
        {
          query,
          payload: ocrData,
        },
        {
          params: {
            query,
          },
        }
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.data,
        role: "assistant",
        timestamp: new Date(),
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, assistantMessage],
        isChatLoading: false,
      }));
    } catch (error) {
      console.error("Chat API error:", error);

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Error sending message",
        role: "assistant",
        timestamp: new Date(),
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, errorMessage],
        isChatLoading: false,
        chatError: "Error sending message",
      }));
    }
  },

  reset: () => set(initialState),
}));
