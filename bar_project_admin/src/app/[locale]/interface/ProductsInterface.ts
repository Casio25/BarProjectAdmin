export interface Product {
    id: number;
    name: string;
    photo: string;
    description: string;
    price: number;
    visibility: boolean;
    inStock: boolean;
    categoryId: number;
    order: number;
    newOrder?: number;
}

export interface ProductsInterface {

    products: Product[];
}
