import { create } from "zustand";
import type { Plan_ResponseType } from "@/app/types";

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

type PlanType = {
  plan: Plan_ResponseType;
  setPlan: (buffer: Plan_ResponseType) => void;
};

type ContextDataType = {
  contextData: Record<string, any>;
  setContextData: (buffer: Record<string, any>) => void;
};

export const useFileStore = create<FileStore>((set) => ({
  fileData: [],
  setFileData: (buffer) => set({ fileData: buffer }),
}));

export const useRunConnectedNodes = create<runConnectedNodes>((set) => ({
  runState: { nodeId: "", status: false },
  setRunState: (buffer) => set({ runState: buffer }),
}));

export const usePlan = create<PlanType>((set) => ({
  plan: [],
  setPlan: (buffer) => set({ plan: buffer }),
}));

export const useContextData = create<ContextDataType>((set) => ({
  contextData: {},
  setContextData: (buffer) => set({ contextData: buffer }),
}));
