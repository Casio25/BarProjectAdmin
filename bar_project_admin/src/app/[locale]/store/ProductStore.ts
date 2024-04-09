import { create } from "zustand";
import { ProductsInterface, Product } from "../interface/ProductsInterface";


type State = {
    products: Product[];
};

type Actions = {
    updateProducts: (products: Product[]) => void;
};

export const ProductStore = create<State & Actions>((set) => ({
    products: [],
    updateProducts: (products) => set({ products }),
}));

