import { create } from "zustand";
import { ProductsInterface } from "../interface/ProductsInterface";

type State = {
    products: ProductsInterface[];
};

type Actions = {
    updateProducts: (products: ProductsInterface[]) => void;
};

export const ProductStore = create<State & Actions>((set) => ({
    products: [],
    updateProducts: (products) => set({ products }),
}));

