export interface CreateProductModalProps {
    category: number | undefined,
    modalStatus: boolean,
    toggleModal: () => void,
    fetchProducts: () => void,
    ConfirmCreateProduct: string,
    Cancel: string,
    CategoriesDropdown: string,
    ProductName: string,
    ProductDescription: string,
    ProductPhoto: string,
    ProductPrice: string,
    ProductVisibility: string,
    ProductInStock: string,

}