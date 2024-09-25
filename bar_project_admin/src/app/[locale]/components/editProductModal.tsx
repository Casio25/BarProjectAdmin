"use client"
import { cookies } from "next/headers";
import { useEffect, useState } from "react";
import { number } from "zod";
import { changeProductAction } from "../actions/changeProductAction";
import { getCategoriesAction } from "../actions/getCategoriesAction";
import { getMaxOrderAction } from "../actions/getMaxOrderAction";
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
    { product: Product | undefined,
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
        categories:[],
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
                visibility:product.visibility || true,
                inStock: product.inStock || true,
                orders: product.orders || null
            });
        }
        fetchCategories()
    }, [product]);

    const handleEdit = async () => {
        console.log("changedProduct before backend edit", changedProduct)
        const maxOrdersPromises = changedProduct.categories.map(category =>
            getMaxOrderAction(category.id)
        );

        console.log("maxOrdersPromises", maxOrdersPromises);

        try {
            const maxOrders = await Promise.all(maxOrdersPromises);
            console.log("all max orders", maxOrders);

            // Update the orders in the newProduct object
            
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
                            <div>
                                <p>{ProductName}</p>
                                <input className="rounded-md" type="text" value={changedProduct.name}
                                    onChange={(e) => setChangedProduct(prevState => ({
                                        ...prevState,
                                        name: e.target.value
                                    }))} />
                                <p className="text pt-2">{ProductDescription}</p>
                                
                                <textarea maxLength={100} className="resize-none rounded-md h-full min-h-[130px] w-full"  value={changedProduct.description}
                                    onChange={(e) => setChangedProduct(prevState => ({
                                        ...prevState,
                                        description: e.target.value
                                    }))} />
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
                                <label>
                                    <input
                                        type="checkbox"
                                        className="rounded-sm"
                                        checked={changedProduct.visibility}
                                        onChange={() => setChangedProduct(prevState => ({
                                            ...prevState,
                                            visibility: !changedProduct.visibility
                                        }))}
                                    />
                                    {ProductVisibility}
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        className="rounded-sm"
                                        checked={changedProduct.inStock}
                                        onChange={() => setChangedProduct(prevState => ({
                                            ...prevState,
                                            inStock: !changedProduct.inStock
                                        }))}
                                    />
                                    {ProductInStock}
                                </label>
                                
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
