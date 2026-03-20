import type { ReactFlowInstance } from "@xyflow/react";
import { create } from "zustand";

type EditorStore = {
  editor: ReactFlowInstance | null;
  setEditor: (editor: ReactFlowInstance | null) => void;
};

export const useEditorStore = create<EditorStore>((set) => ({
  editor: null,
  setEditor: (editor) => set({ editor }),
}));
