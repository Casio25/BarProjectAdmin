import { create } from "zustand";
import { OrderInterface } from "../interface/OrderInterface";


type State = {
    orders: OrderInterface[];
};

type Actions = {
    updateOrders: (orders: OrderInterface[]) => void;
};

export const OrdersStore = create<State & Actions>((set) => ({
    orders: [],
    updateOrders: (orders) => set({ orders }),
}));