import { create } from "zustand";

type FileStore = {
  fileData: { name: string; dir: boolean; path: string; data: string }[];
  setFileData: (
    buffer: { name: string; dir: boolean; path: string; data: string }[],
  ) => void;
};

export const useFileStore = create<FileStore>((set) => ({
  fileData: [],
  setFileData: (buffer) => set({ fileData: buffer }),
}));
