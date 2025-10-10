import { create } from "zustand";

type FileStore = {
  fileData: { name: string; dir: boolean; path: string; data: string }[];
  setFileData: (
    buffer: { name: string; dir: boolean; path: string; data: string }[],
  ) => void;
};

type runConnectedNodes = {
  runState: {
    nodeId: string;
    status: boolean;
    refData?: {
      fileName: string;
      code: string;
    } | null;
  };
  setRunState: (buffer: {
    nodeId: string;
    status: boolean;
    refData?: {
      fileName: string;
      code: string;
    } | null;
  }) => void;
};

export const useFileStore = create<FileStore>((set) => ({
  fileData: [],
  setFileData: (buffer) => set({ fileData: buffer }),
}));

export const useRunConnectedNodes = create<runConnectedNodes>((set) => ({
  runState: { nodeId: "", status: false },
  setRunState: (buffer) => set({ runState: buffer }),
}));
