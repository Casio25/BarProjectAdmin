"use client"

import { useEffect, useState, HTMLInputTypeAttribute, ChangeEvent } from "react";
import { getCategoriesAction } from "../actions/getCategoriesAction";
import { CategoriesInterface } from "../interface/CategoriesInterface";
import { NewProduct } from "../interface/ProductsInterface";
import { ProductStore } from "../store/ProductStore";
import { addProductAction } from "../actions/addProductAction";


export const CreateProductModal = ({ category, modalStatus, toggleModal, ConfirmCreateProduct, Cancel, CategoriesDropdown }:
    { category: number | undefined, modalStatus: boolean, toggleModal: () => void, ConfirmCreateProduct: string, Cancel: string, CategoriesDropdown: string }) => {

    const [categories, setCategories] = useState<CategoriesInterface>([]);

    const [newProduct, setNewProduct] = useState<NewProduct>({
        name: '',
        description: '',
        categories: [],
        photo: "",
        price: 0,
        visibility: true,
        inStock: true,

    });
    const [emptyFiledError, setEmptyFieldError] = useState("")


    const isModalOpen = () => modalStatus;
    const storedJwtToken = localStorage.getItem("jwtToken");
    const storedProducts = ProductStore(state => state.products);
    

    const [dropdown, setDropdown] = useState(false)

    const fetchCategories = async () => {
        try {
            const response = await getCategoriesAction(storedJwtToken)
            setCategories(await response);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const validate = async () => {
        if (!newProduct.name || !newProduct.description || newProduct.price <= 0 || isNaN(newProduct.price)) {
            setEmptyFieldError("Not all fields are filled correctly");
        } else {
            try {
                const response = await addProductAction(newProduct, storedJwtToken);
                if (response) {
                    console.log("response", response)
                    console.log(response.status);
                    toggleModal();
                }
            } catch (error) {
                console.error('Error creating product:', error);
            }
        }
    };


    useEffect(() => {
        fetchCategories(); 
        if (category) {
            const defaultCategory = categories.find(cat => cat.id === category);
            if (defaultCategory) {
                setNewProduct(prevProduct => ({
                    ...prevProduct,
                    categories: [defaultCategory]
                }));
            }
        }
    }, [category]);
    return (
        <>
            {isModalOpen() && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="p-8 border w-96 shadow-lg rounded-md bg-white">

                        <div>
                            <p>Name</p>
                            <input className="rounded-md" type="text" value={newProduct.name}
                                onChange={(e) => {setNewProduct(prevState => ({
                                    ...prevState,
                                    name: e.target.value
                                }))
                                    setEmptyFieldError("")
                                }} />
                            <p className="text-sm">Description</p>
                            <input className="rounded-md" type="text" value={newProduct.description}
                                onChange={(e) => {setNewProduct(prevState => ({
                                    ...prevState,
                                    description: e.target.value
                                }))
                            setEmptyFieldError("")
                                }} />
                            <p>Price</p>
                            <input
                                className='rounded-md my-2 w-20'
                                type="number"
                                value={(newProduct.price ?? '').toString()} // Convert number to string and handle undefined case
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                                onChange={(e) => {
                                    const newPrice = parseFloat(e.target.value);
                                    setNewProduct(prevState => ({
                                        ...prevState,
                                        price: isNaN(newPrice) ? 0 : newPrice
                                    }));
                                    setEmptyFieldError("");
                                }}
                            />  
                            <p>Photo</p>
                            <input className="rounded-md" type="text" value={newProduct.photo}
                                onChange={(e) => {setNewProduct(prevState => ({
                                    ...prevState,
                                    photo: e.target.value

                                }))
                                    setEmptyFieldError("")
                                }}/>
                                
                            <div id="dropdown" className={` z-10 ${dropdown ? "hidden" : ""}  bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" >
                                    {categories.map(category => (
                                        <li key={category.id}>
                                            <input type="checkbox" className="rounded-sm"
                                                checked={newProduct.categories.some(cat => cat.id === category.id)}
                                                onClick={() => {
                                                    setNewProduct(prevState => {
                                                        
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
                                                }}/>{category.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <label>
                                <input
                                    type="checkbox"
                                    className="rounded-sm"
                                    checked={newProduct.visibility}
                                    onChange={() => setNewProduct(prevState => ({
                                        ...prevState,
                                        visibility: !newProduct.visibility
                                    }))}
                                />
                                Visibility
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    className="rounded-sm"
                                    checked={newProduct.inStock}
                                    onChange={() => setNewProduct(prevState => ({
                                        ...prevState,
                                        inStock: !newProduct.inStock
                                    }))}
                                />
                                In stock
                            </label>
                        </div>
                        <p className="mt-4 text-red-600" >{emptyFiledError}</p>
                        <div className="flex py-2">
                            <button className='rounded-md p-1 mr-2 font-semibold shadow-sm bg-amber-300 active:bg-amber-500' onClick={() => {
                                validate()
                            }}>{ConfirmCreateProduct}</button>
                            <button className='rounded-md p-1 ml-2 font-semibold shadow-sm bg-blue-500 active:bg-blue-700' onClick={toggleModal}>{Cancel}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}