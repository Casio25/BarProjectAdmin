"use client"

import { useEffect, useState, HTMLInputTypeAttribute, ChangeEvent } from "react";
import { getCategoriesAction } from "../actions/getCategoriesAction";
import { CategoriesInterface } from "../interface/CategoriesInterface";
import { NewProduct } from "../interface/ProductsInterface";
import { ProductStore } from "../store/ProductStore";
import { addProductAction } from "../actions/addProductAction";
import { useRouter } from '@/navigation'
import { Visibility } from "@mui/icons-material";
import { getMaxOrderAction } from "../actions/getMaxOrderAction";


export const CreateProductModal = ({ category,
     modalStatus,
    toggleModal,
    fetchProducts,
    ConfirmCreateProduct,
    Cancel,
    CategoriesDropdown,
    ProductName,
    ProductDescription,
    ProductPhoto,
    ProductPrice,
    ProductVisibility,
    ProductInStock }:
    { category: number | undefined, 
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
    ProductInStock: string
}) => {

    const [categories, setCategories] = useState<CategoriesInterface>([]);
    const router = useRouter();

    const [newProduct, setNewProduct] = useState<NewProduct>({
        name: '',
        description: '',
        categories: [],
        orders: [],
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
            const maxOrdersPromises = newProduct.categories.map(category =>
                getMaxOrderAction(storedJwtToken, category.id)
            );

            console.log("maxOrdersPromises", maxOrdersPromises);

            try {
                // Wait for all max order promises to resolve
                const maxOrders = await Promise.all(maxOrdersPromises);
                console.log("all max orders", maxOrders);

                // Update the orders in the newProduct object
                newProduct.orders = maxOrders.map((order, index) => ({
                    order,
                    categoryId: newProduct.categories[index].id
                }));

                console.log("new product", newProduct);

                // Proceed with adding the product
                const response = await addProductAction(newProduct, storedJwtToken);
                console.log(response)
                if (response == 401) {
                    router.push('/signin');
                } else if (response.status == 400) {
                    setEmptyFieldError("Product with this name already exists");
                } else if (response.status == 201) {
                    setEmptyFieldError("");
                    fetchProducts();
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
        fetchProducts()
    }, [category]);
    return (
        <>
            {isModalOpen() && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="p-8 border w-96 shadow-lg rounded-md bg-white">

                        <div>
                            <p>{ProductName}</p>
                            <input className="rounded-md" type="text" value={newProduct.name}
                                onChange={(e) => {setNewProduct(prevState => ({
                                    ...prevState,
                                    name: e.target.value
                                }))
                                    setEmptyFieldError("")
                                }} />
                            <p className="text-sm">{ProductDescription}</p>
                            <textarea maxLength={100} className="resize-none rounded-md h-full min-h-[130px] w-full" value={newProduct.description}
                                onChange={(e) => {setNewProduct(prevState => ({
                                    ...prevState,
                                    description: e.target.value
                                }))
                            setEmptyFieldError("")
                                }} />
                            <p>{ProductPrice}</p>
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
                            <p>{ProductPhoto}</p>
                            <input className="rounded-md" type="text" value={newProduct.photo}
                                onChange={(e) => {setNewProduct(prevState => ({
                                    ...prevState,
                                    photo: e.target.value

                                }))
                                    setEmptyFieldError("")
                                }}/>
                                
                            
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
                                {ProductVisibility}
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
                                {ProductInStock}
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