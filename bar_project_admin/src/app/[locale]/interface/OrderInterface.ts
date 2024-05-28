import { Product } from "./ProductsInterface"

export interface OrderInterface {
    id: number
    orderId: number
    creatAt: string
    status: OrderStatus
    items: Product[];
    totalPrice: number

}

export enum OrderStatus {
    NEW = "new",
    INPROGRESS = "inProgress",
    FINISHED = "finished"
}