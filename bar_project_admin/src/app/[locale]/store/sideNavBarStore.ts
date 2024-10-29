import { create } from "zustand"

type State = {
    open: boolean;
}

type Action = {
    toggleOpen: (status: boolean) => void;
}

export const sideNavBarStore = create <State & Action>((set) => ({
    open: false,
    toggleOpen: () => set((state) => ({open: !state.open}))
}))