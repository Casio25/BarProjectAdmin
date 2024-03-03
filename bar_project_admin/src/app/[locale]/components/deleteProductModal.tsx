
import { DeleteProductAction } from "../actions/deleteProductAction";
import { Product, ProductsInterface } from "../interface/ProductsInterface";
import { ProductStore } from "../store/ProductStore";


export const DeleteProductModal = ({ product, modalStatus, toggleModal }: { product: Product | undefined, modalStatus: boolean, toggleModal: () => void }) => {
    const isModalOpen = () => modalStatus;
    const storedJwtToken = localStorage.getItem("jwtToken");
    const storedProducts = ProductStore(state => state.products);
    const updateStoredProducts = ProductStore(state => state.updateProducts)

    const handleDelete = async (productCategoryId: number | undefined, selectedProductOrder: number, product) => {
        const updatedProductsArray = storedProducts
            .map(product => {
                if (product.categoryId === productCategoryId) {
                    if (product.order > selectedProductOrder) {
                        return { ...product, order: product.order - 1 };
                    } else if (product.order === selectedProductOrder) {

                        return null;
                    }
                }
                return product;
            })
            .filter(Boolean);

        await updateStoredProducts(updatedProductsArray);
        await DeleteProductAction(product, storedJwtToken)
    };



    return (
        <>
            {isModalOpen() && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
                        {product &&
                            <div>
                                <p>{product.name}</p>
                                <p className="text-sm">{product.description}</p>
                            </div>}
                        <div className="flex">
                            <button className='rounded-md p-1 mr-2 font-semibold shadow-sm bg-rose-500 active:bg-rose-700' onClick={() => {
                                toggleModal();
                                handleDelete(product.categoryId, product.order, product)
                            }}>Delete Product</button>
                            <button className='rounded-md p-1 ml-2 font-semibold shadow-sm bg-blue-500 active:bg-blue-700' onClick={toggleModal}>Cancel</button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};
