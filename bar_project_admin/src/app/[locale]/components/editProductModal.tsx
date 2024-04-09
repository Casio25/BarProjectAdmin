"use client"
import { useEffect, useState } from "react";
import { number } from "zod";
import { changeProductAction } from "../actions/changeProductAction";
import { getCategoriesAction } from "../actions/getCategoriesAction";
import { CategoriesInterface } from "../interface/CategoriesInterface";
import { Product } from "../interface/ProductsInterface";
import { ProductStore } from "../store/ProductStore";

export const EditProductModal = ({ product, modalStatus, toggleModal, ConfirmEditProduct, Cancel, CategoriesDropdown }:
    { product: Product | undefined, modalStatus: boolean, toggleModal: () => void, ConfirmEditProduct: string, Cancel: string, CategoriesDropdown: string }) => {

    const isModalOpen = () => modalStatus;
    const storedJwtToken = localStorage.getItem("jwtToken");
    const storedProducts = ProductStore(state => state.products);
    const updateStoredProducts = ProductStore(state => state.updateProducts);
    const [categories, setCategories] = useState<CategoriesInterface>([]);
    const [dropdown, setDropdown] = useState(false)
    const [changedProduct, setChangedProduct] = useState<Product>({
        id: 0,
        authorId: 0,
        name: '',
        description: '',
        categories:[],
        photo: "",
        price: 0,
        visibility: true,
        inStock: true,
        order: 0

    });
    const fetchCategories = async () => {
        try {
            const response = await getCategoriesAction(storedJwtToken)
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
                visibility:product.visibility || true,
                inStock: product.inStock || true,
                order: product.order || 0
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
                        order: changedProduct.order
                    };
                } else {
                    return product;
                }
            });

            await updateStoredProducts(updatedProductsArray);

            // Call changeProductAction for the edited product directly
            await changeProductAction(changedProduct, storedJwtToken);
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
                            <div>
                                <p>Name</p>
                                <input className="rounded-md" type="text" value={changedProduct.name}
                                    onChange={(e) => setChangedProduct(prevState => ({
                                        ...prevState,
                                        name: e.target.value
                                    }))} />
                                <p className="text-sm">Description</p>
                                <input className="rounded-md" type="text" value={changedProduct.description}
                                    onChange={(e) => setChangedProduct(prevState => ({
                                        ...prevState,
                                        description: e.target.value
                                    }))} />
                                <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="my-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                 type="button"
                                    onClick={() => setDropdown(!dropdown)}>
                                    {CategoriesDropdown}
                                    <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                    </svg>
                                </button>

                                <div id="dropdown" className={` z-10 ${dropdown ? "hidden" : ""}  bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" >
                                        {categories.map(category => (
                                            <li key={category.id}>
                                                <input type="checkbox" className="rounded-sm"
                                                    checked={changedProduct.categories.some(cat => cat.id === category.id)}
                                                    onClick={() => {
                                                        setChangedProduct(prevState => {

                                                            const categoryExists = prevState.categories.some(cat => cat.id === category.id);

                                                            if (categoryExists) {

                                                                return {
                                                                    ...prevState,
                                                                    categories: prevState.categories.filter(cat => cat.id !== category.id)
                                                                };
                                                            } else {

                                                                return {
                                                                    ...prevState,
                                                                    categories: [...prevState.categories, category]
                                                                };
                                                            }
                                                        });
                                                    }} />{category.name}
                                            </li>
                                        ))}
                                    </ul>
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
