"use client"


import { DeleteCategoryAction } from "../actions/deleteCategoryAction";
import { DeleteProductAction } from "../actions/deleteProductAction";
import { Category } from "../interface/ProductsInterface";
import { ProductStore } from "../store/ProductStore";



export const DeleteCategoryModal = ({ category, modalStatus, toggleModal, fetchProducts, fetchCategories, ConfirmDeleteCategory, DeleteCategoryWarning, Cancel }: { category: Category | undefined, modalStatus: boolean, toggleModal: () => void, fetchProducts: () => void, fetchCategories: () => void, ConfirmDeleteCategory: string, DeleteCategoryWarning: string, Cancel: string }) => {
    const isModalOpen = () => modalStatus;
    
    const storedProducts = ProductStore(state => state.products);
    const updateStoredProducts = ProductStore(state => state.updateProducts)

    const handleDelete = async (category: Category) => {
        const categoryProducts = storedProducts.filter(product =>
            product.categories.length === 1 && product.categories[0].id === category.id
        );
        console.log(categoryProducts);
        categoryProducts.map(async (product) => {
            await DeleteProductAction(product)
        })
        await DeleteCategoryAction(category)
        fetchCategories()
    };

    return (
        <>
            {isModalOpen() &&  category && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
                        {category &&
                            <div>
                                <p className="font-semibold">{category.name}</p>
                                <p className="text-rose-500">{DeleteCategoryWarning}</p>
                            </div>}
                        <div className="flex">
                            <button className='rounded-md p-1 mr-2 font-semibold shadow-sm bg-rose-500 active:bg-rose-700' onClick={() => {
                                toggleModal()
                                handleDelete(category)
                            }}>{ConfirmDeleteCategory}</button>
                            <button className='rounded-md p-1 ml-2 font-semibold shadow-sm bg-blue-500 active:bg-blue-700' onClick={toggleModal}>{Cancel}</button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}