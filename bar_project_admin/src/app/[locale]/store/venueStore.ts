import { create } from "zustand";
import { IVenue } from "../interface/VenueInterface";

type State = {
    venues: IVenue[];
};

type Action = {
    updateVenues: (venues: IVenue[]) => void;
}

export const VenueStore = create<State & Action>((set) => ({
    venues: [],
    updateVenues: (venues) => set({ venues }),
}));