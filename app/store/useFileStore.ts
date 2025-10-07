import { create } from 'zustand'

type FileStore = {
  arrayBuffer: ArrayBuffer | null
  setArrayBuffer: (buffer: ArrayBuffer) => void
}

export const useFileStore = create<FileStore>((set) => ({
  arrayBuffer: null,
  setArrayBuffer: (buffer) => set({ arrayBuffer: buffer }),
}))
