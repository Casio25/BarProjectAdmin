export interface Product {
    authorId: number;
    id: number;
    name: string;
    photo: string;
    description: string;
    price: number;
    visibility: boolean;
    inStock: boolean;
    categories: Category[]
    order: number;
    newOrder?: number;
}

export interface Category {
    id: number,
    name: string,
    type: string

}
export interface NewProduct {
    
    name: string;
    photo: string;
    description: string;
    price: number;
    visibility: boolean;
    inStock: boolean;
    categories: Category[]
}

export interface ProductOnCategories{
    id: number;
    productId: number;
    categoryId: number
}

export interface ProductsInterface {

    products: Product[];
}
