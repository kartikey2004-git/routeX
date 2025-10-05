// Now for further implementation , we have to define global state

// We use zustand here as a state management library

import { create } from "zustand";

// type for workspace for using globally
type Workspace = {
  id: string;
  name: string;
};

// on basis of selectedWorkspace , saare collections and saare request ko load krne ki try krenge

interface WorkspaceState {
  selectedWorkspace: Workspace | null;
  setSelectedWorkspace: (workspace: Workspace) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  selectedWorkspace: null,
  setSelectedWorkspace: (workspace) =>
    set(() => ({ selectedWorkspace: workspace })),
}));


