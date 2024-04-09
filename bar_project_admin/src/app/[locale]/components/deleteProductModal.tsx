"use client"
import { DeleteProductAction } from "../actions/deleteProductAction";
import { Category, Product, ProductsInterface } from "../interface/ProductsInterface";
import { ProductStore } from "../store/ProductStore";


export const DeleteProductModal = ({ product, modalStatus, toggleModal, ConfirmDeleteProduct, Cancel }: { product: Product | undefined, modalStatus: boolean, toggleModal: () => void, ConfirmDeleteProduct: string, Cancel: string }) => {
    const isModalOpen = () => modalStatus;
    const storedJwtToken = localStorage.getItem("jwtToken");
    const storedProducts = ProductStore(state => state.products);
    const updateStoredProducts = ProductStore(state => state.updateProducts)

    const handleDelete = async (productCategoryIds: Category[], selectedProductOrder: number, product: Product) => {
        const updatedProductsArray = storedProducts.map((storedProduct) => {
            // Check if the stored product has any of the categories to be deleted
            if (productCategoryIds.some((categoryId) => storedProduct.categories.some((cat) => cat.id === categoryId.id))) {
                // If the stored product's order is greater than the selected product's order,
                // decrement the order by 1
                if (storedProduct.order > selectedProductOrder) {
                    return { ...storedProduct, order: storedProduct.order - 1 };
                }
                // If the stored product's order is equal to the selected product's order,
                // remove the product (return null)
                else if (storedProduct.order === selectedProductOrder) {
                    return null;
                }
            }
            // For products that don't match the condition, return them as is
            return storedProduct;
        }).filter(Boolean); // Remove null entries (products that need to be deleted)

        // Update the stored products with the updated array
        await updateStoredProducts(updatedProductsArray);

        await DeleteProductAction(product, storedJwtToken);
    };




    return (
        <>
            {isModalOpen() && product && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
                        {product &&
                            <div>
                                <p>{product.name}</p>
                                <p className="text-sm">{product.description}</p>
                            </div>}
                        <div className="flex">
                            <button className='rounded-md p-1 mr-2 font-semibold shadow-sm bg-rose-500 active:bg-rose-700' onClick={() => {
                                toggleModal()
                                handleDelete(product.categories, product.order, product)
                            }}>{ConfirmDeleteProduct}</button>
                            <button className='rounded-md p-1 ml-2 font-semibold shadow-sm bg-blue-500 active:bg-blue-700' onClick={toggleModal}>{Cancel}</button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};
