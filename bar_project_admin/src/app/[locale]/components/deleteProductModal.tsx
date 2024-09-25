"use client"
import { cookies } from "next/headers";
import { changeProductAction } from "../actions/changeProductAction";
import { DeleteProductAction } from "../actions/deleteProductAction";
import { Category, OrderOfProduct, Product, ProductsInterface } from "../interface/ProductsInterface";
import { ProductStore } from "../store/ProductStore";
import { OrdersIcon } from "./svgs";


export const DeleteProductModal = ({ product, modalStatus, toggleModal, fetchProducts, ConfirmDeleteProduct, Cancel }: { product: Product | undefined, modalStatus: boolean, toggleModal: () => void, fetchProducts: () => void, ConfirmDeleteProduct: string, Cancel: string }) => {
    const isModalOpen = () => modalStatus;
    
    const storedProducts = ProductStore(state => state.products);
    const updateStoredProducts = ProductStore(state => state.updateProducts)

    const handleDelete = async (productCategoryIds: Category[], selectedProductOrder: OrderOfProduct[], product: Product) => {
        const updatedProductsArray = storedProducts.map((storedProduct) => {
            // Check if the stored product has any of the categories to be deleted
            if (productCategoryIds.some((categoryId) => storedProduct.categories.some((cat) => cat.id === categoryId.id))) {
                console.log("Found stored product with matching categories:", storedProduct);

                // Check if the stored product's order is greater than the selected product's order
                const hasHigherOrder = storedProduct.orders.some((order) => {
                    // Ensure the order belongs to the same category as the selected product
                    const isSameCategory = productCategoryIds.some((categoryId) => order.categoryId === categoryId.id);
                    return isSameCategory && order.order > selectedProductOrder[0].order; // Accessing the first element's order
                });

                console.log("Has higher order:", hasHigherOrder);

                // If the stored product's order is greater than the selected product's order,
                // decrement the order by 1
                if (hasHigherOrder) {
                    console.log("Decrementing order for stored product with higher order:");
                    return {
                        ...storedProduct, orders: storedProduct.orders.map((order) => {
                            const isSameCategory = productCategoryIds.some((categoryId) => order.categoryId === categoryId.id);
                            if (isSameCategory && order.order > selectedProductOrder[0].order) {
                                console.log("Order before decrement:", order.order);
                                return { ...order, order: order.order - 1 };
                            }
                            return order;
                        })
                    };
                }
                // If the stored product's order is equal to the selected product's order,
                // decrement the order by 1
                else if (storedProduct.orders.some((order) => {
                    const isSameCategory = productCategoryIds.some((categoryId) => order.categoryId === categoryId.id);
                    return isSameCategory && order.order === selectedProductOrder[0].order;
                })) {
                    console.log("Decrementing order for stored product with equal order:");
                    return {
                        ...storedProduct, orders: storedProduct.orders.map((order) => {
                            const isSameCategory = productCategoryIds.some((categoryId) => order.categoryId === categoryId.id);
                            if (isSameCategory && order.order > selectedProductOrder[0].order) {
                                console.log("Order before decrement:", order.order);
                                return { ...order, order: order.order - 1 };
                            }
                            return order;
                        })
                    };
                }
            }
            // For products that don't match the condition, return them as is
            return storedProduct;
        }).filter(Boolean); // Remove null entries (products that need to be deleted)

        console.log("Deleted product:", product);
        console.log("Updated products with higher order:", updatedProductsArray);
        // Update the stored products with the updated array
        await Promise.all(updatedProductsArray.map(async (product) => {
            try {
                await changeProductAction(product);
                console.log("Product updated successfully:", product);
            } catch (error) {
                console.error("Error updating product:", error);
            }
        }));
        await DeleteProductAction(product)
        fetchProducts();
        toggleModal();
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
                                handleDelete(product.categories, product.orders, product)
                            }}>{ConfirmDeleteProduct}</button>
                            <button className='rounded-md p-1 ml-2 font-semibold shadow-sm bg-blue-500 active:bg-blue-700' onClick={toggleModal}>{Cancel}</button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};
