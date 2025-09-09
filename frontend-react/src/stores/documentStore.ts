import { create } from "zustand";
import axios from "axios";

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

interface DocumentState {
  extractedLines: ExtractedLine[];
  imageDimensions: { width: number; height: number };
  isLoading: boolean;
  error: string | null;
  documentType: string | null;
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
  reset: () => void;
}

type DocumentStore = DocumentState & DocumentActions;

const initialState: DocumentState = {
  extractedLines: [],
  imageDimensions: { width: 0, height: 0 },
  isLoading: false,
  error: null,
  documentType: null,
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

      const response = await axios.post("/api/extract", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false, error: "Failed to extract text" });
      throw error;
    }
  },

  reset: () => set(initialState),
}));
