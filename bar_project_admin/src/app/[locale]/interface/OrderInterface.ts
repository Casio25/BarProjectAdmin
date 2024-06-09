import { Product,  } from "./ProductsInterface"

export interface OrderInterface {
    id: number
    orderId: number
    creatAt: string
    orderStatus: OrderStatus
    products: ProductInfoInterface[];
    totalPrice: number
    payment?: Payment[]
}


export enum OrderStatus {
    NEW = "new",
    INPROGRESS = "inProgress",
    FINISHED = "finished"
}
export interface Payment{
    paymentType: string,
    paymentStatus: string
}

export interface ProductInfoInterface{
    id: number;
    orderId: number;
    productId: number;
    productPrice: number;
    productQuantity: number;
    productName: string
}