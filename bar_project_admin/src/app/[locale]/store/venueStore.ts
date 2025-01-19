import { create } from "zustand";
import { IVenue } from "../interface/VenueInterface";

type State = {
    venues: IVenue[]; 
    activeVenue: IVenue | undefined; 
};

type Action = {
    updateVenues: (venues: IVenue[]) => void; 
    updateActiveVenue: (activeVenue: IVenue) => void;
};

export const VenueStore = create<State & Action>((set) => ({
    
    venues: [],
    activeVenue: undefined, 

    
    updateVenues: (venues) => set(() => ({ venues })), 
    updateActiveVenue: (activeVenue) => {console.log("venue from store", activeVenue); set(() => ({ activeVenue }))},
}));
