export interface Product {
    authorId: number;
    id: number;
    name: string;
    photo: string;
    description: string;
    price: number;
    visibility: boolean;
    inStock: boolean;
    categories: Category[];
    orders: OrderOfProduct[];
    newOrder?: number;
}

export interface Category {
    id: number,
    name: string,
    type: string

}
export interface OrderOfProduct {
    id: number;
    authorId: number;
    order: number
    categoryId: number;
    
}
export interface NewProduct {
    
    name: string;
    photo: string;
    description: string;
    price: number;
    visibility: boolean;
    inStock: boolean;
    categories: Category[]
    orders: NewOrder[]
}
export interface NewOrder {
    order: number,
    categoryId: number
}

export interface ProductOnCategories{
    id: number;
    productId: number;
    categoryId: number
}

export interface ProductsInterface {

    products: Product[];
}

