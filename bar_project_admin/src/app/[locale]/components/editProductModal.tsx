"use client"
import { cookies } from "next/headers";
import { useEffect, useState } from "react";
import { number } from "zod";
import { changeProductAction } from "../actions/changeProductAction";
import { getCategoriesAction } from "../actions/getCategoriesAction";

import { CategoriesInterface } from "../interface/CategoriesInterface";
import { Product } from "../interface/ProductsInterface";
import { ProductStore } from "../store/ProductStore";

export const EditProductModal = ({ product,
    modalStatus,
    toggleModal,
    ConfirmEditProduct,
    Cancel,
    CategoriesDropdown,
    ProductName,
    ProductDescription,
    ProductPhoto,
    ProductPrice,
    ProductVisibility,
    ProductInStock,
}:
    {
        product: Product | undefined,
        modalStatus: boolean,
        toggleModal: () => void,
        ConfirmEditProduct: string,
        Cancel: string,
        CategoriesDropdown: string,
        ProductName: string,
        ProductDescription: string,
        ProductPhoto: string,
        ProductPrice: string,
        ProductVisibility: string,
        ProductInStock: string,

    }) => {

    const isModalOpen = () => modalStatus;
    const storedProducts = ProductStore(state => state.products);
    const updateStoredProducts = ProductStore(state => state.updateProducts);
    const [categories, setCategories] = useState<CategoriesInterface>([]);
    const [dropdown, setDropdown] = useState(false)
    const [changedProduct, setChangedProduct] = useState<Product>({
        id: 0,
        authorId: 0,
        name: '',
        description: '',
        categories: [],
        photo: "",
        price: 0,
        visibility: true,
        inStock: true,
        orders: []

    });
    const fetchCategories = async () => {
        try {
            const response = await getCategoriesAction()
            setCategories(await response);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    useEffect(() => {
        if (product) {
            setChangedProduct({
                id: product.id || 0,
                authorId: product.authorId || 0,
                name: product.name || '',
                description: product.description || '',
                categories: product.categories || [],
                photo: product.photo || "",
                price: product.price || 0,
                visibility: product.visibility || true,
                inStock: product.inStock || true,
                orders: product.orders || null
            });
        }
        fetchCategories()
    }, [product]);

    const handleEdit = async () => {


        try {

            const updatedProductsArray = storedProducts.map(product => {
                if (product.id === changedProduct.id) {
                    return {
                        ...product,
                        id: changedProduct.id,
                        authorId: changedProduct.authorId,
                        name: changedProduct.name,
                        description: changedProduct.description,
                        categories: changedProduct.categories,
                        price: changedProduct.price,
                        photo: changedProduct.photo,
                        visibility: changedProduct.visibility,
                        inStock: changedProduct.inStock,
                        orders: changedProduct.orders
                    };
                } else {
                    return product;
                }
            });

            await updateStoredProducts(updatedProductsArray);
            // Call changeProductAction for the edited product directly
            await changeProductAction(changedProduct);
        } catch (error) {
            console.error("Error:", error);
        }
    };






    return (
        <>
            {isModalOpen() && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
                        {product && (
                            <div className="space-y-4">
                                <input className="rounded-md w-full 
                            placeholder:font-semibold placeholder:text-center
                            focus:placeholder:" type="text"
                                    placeholder={ProductName}
                                    value={changedProduct.name}
                                    onChange={(e) => setChangedProduct(prevState => ({
                                        ...prevState,
                                        name: e.target.value
                                    }))} />


                                <textarea maxLength={100} className="resize-none rounded-md h-full min-h-[170px] w-full 
                                placeholder:font-semibold placeholder:text-center"
                                    placeholder={ProductDescription}
                                    value={changedProduct.description}
                                    onChange={(e) => setChangedProduct(prevState => ({
                                        ...prevState,
                                        description: e.target.value
                                    }))} />
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" >

                                    {Array.isArray(categories) && categories.map(category => (
                                        <li key={category.id}>
                                            <input
                                                type="checkbox"
                                                className="rounded-sm"
                                                checked={changedProduct.categories.some(cat => cat.id === category.id)}
                                                onChange={() => {
                                                    setChangedProduct(prevState => {
                                                        const categoryExists = prevState.categories.some(cat => cat.id === category.id);
                                                        if (categoryExists) {
                                                            return {
                                                                ...prevState,
                                                                categories: prevState.categories.filter(cat => cat.id !== category.id),
                                                            };
                                                        } else {
                                                            return {
                                                                ...prevState,
                                                                categories: [...prevState.categories, category],
                                                            };
                                                        }
                                                    });
                                                }}
                                            />
                                            {category.name}
                                        </li>
                                    ))}


                                </ul>
                                <div className="flex justify-between">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={changedProduct.visibility}
                                            onChange={() => setChangedProduct(prevState => ({
                                                ...prevState,
                                                visibility: !changedProduct.visibility
                                            }))}
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span>{ProductVisibility}</span>
                                    </label>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={changedProduct.inStock}
                                            onChange={() => setChangedProduct(prevState => ({
                                                ...prevState,
                                                inStock: !changedProduct.inStock
                                            }))}
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span>{ProductInStock}</span>
                                    </label>
                                </div>

                            </div>
                        )}
                        <div className="flex py-2">
                            <button className='rounded-md p-1 mr-2 font-semibold shadow-sm bg-amber-300 active:bg-amber-500' onClick={() => {
                                toggleModal();
                                handleEdit();
                            }}>{ConfirmEditProduct}</button>
                            <button className='rounded-md p-1 ml-2 font-semibold shadow-sm bg-blue-500 active:bg-blue-700' onClick={toggleModal}>{Cancel}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
