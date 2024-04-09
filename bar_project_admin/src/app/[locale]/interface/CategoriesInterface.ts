interface Category {
    id: number;
    name: string;
    type: string;
}

export interface ICreateCategory {
    name: string
}

export interface CategoriesInterface extends Array<Category> { }