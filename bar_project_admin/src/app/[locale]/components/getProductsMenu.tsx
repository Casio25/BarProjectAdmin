"use client"
import { LoginStore } from '../store/LoginStore'
import { ProductStore } from '../store/ProductStore'
import React, { useState } from 'react'
import { getProductsAction } from '../actions/getProductsAction'
import { useRouter } from '@/navigation'
import { useEffect } from 'react';
import { CategoriesInterface } from '../interface/CategoriesInterface'
import { ProductsInterface } from '../interface/ProductsInterface'
import { DragAndDrop } from './svgs'
import { getCategoriesAction } from '../actions/getCategoriesAction'
import { number } from 'zod'
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { changeProductAction } from '../actions/changeProductAction'


export const GetProductsMenu = () => {
    let updatedProductsArray: any = undefined
    const router = useRouter();
    const storedJwtToken = localStorage.getItem("jwtToken");
    const storedProducts = ProductStore(state => state.products);
    const updateStoredProducts = ProductStore(state => state.updateProducts)
    const [categories, setCategories] = useState<CategoriesInterface>([]);
    const [expandedCategories, setExpandedCategories] = useState<{ [key: number]: boolean }>({});
    const [targetOrder, setTargetOrder] = useState<number>()
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [product, setProduct] = useState({
        name: "",
        photo: "",
        description: "",
        price: null,
        visibility: undefined,
        inStock: undefined,
        categoryId: null,
        order: null,
    });
    // all fetching

    const fetchCategories = async () => {
        try {
            const response = await getCategoriesAction(storedJwtToken)
            setCategories(await response);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await getProductsAction(storedJwtToken)
            if (response == 401) {
                router.push('/signin')
            } else {
                updateStoredProducts(await response);

            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    useEffect(() => {

        fetchCategories();

        fetchProducts();

    }, []);

    const updatedProducts: ProductsInterface = storedProducts.map(product => {
        const updatedProduct = { ...product }
        return updatedProduct
    })

    const changeProduct = () => (property, value) => {
        setProduct({
            ...product,
            [property]: value 
        });
    };

    const saveChanges = () => {
        try {
            storedProducts.forEach((product) => {
                 changeProductAction(product, storedJwtToken)
            })
        } catch (error) {
            console.error("Error:", error);
        }
    };



    const toggleCategory = (categoryId: number) => {
        setExpandedCategories(prevState => ({
            ...prevState,
            [categoryId]: !prevState[categoryId]
        }));
    };
    const handleDragOver = (e: React.DragEvent<HTMLLIElement>, targetOrder: number) => {
        e.preventDefault();
        setTargetOrder(targetOrder)
        console.log("targetOrder: ", targetOrder)
    };

    const handleDragStart = (e, productId: number, productCategoryId: number, categoryId: number, productOrder: number,) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ productId, productCategoryId, categoryId }));
    };


    const handleDrop = async(e: React.DragEvent<HTMLLIElement>, categoryId: number) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const { productId, productCategoryId, originalCategoryId } = data;

        if (productCategoryId === categoryId) {
            console.log('Dropped product ID', productId, 'into category ID', categoryId);

            const draggedProduct = storedProducts.find(product => product.id === productId && product.categoryId === productCategoryId);
            const targetProduct = storedProducts.find(product => product.order === targetOrder && product.categoryId === productCategoryId);

            if (draggedProduct && targetProduct) {
                
                const newOrder = targetProduct.order;

                updatedProductsArray = storedProducts.map(product => {
                    if (product.categoryId !== categoryId) {
                        return product; 
                    }

                    if (product.id === draggedProduct.id) {
                        return { ...product, order: newOrder };
                    } else if (draggedProduct.order < targetProduct.order && product.order > draggedProduct.order && product.order <= targetProduct.order) {
                        return { ...product, order: product.order - 1 };
                    } else if (draggedProduct.order > targetProduct.order && product.order < draggedProduct.order && product.order >= targetProduct.order) {
                        return { ...product, order: product.order + 1 };
                    }
                    return product;
                });

                
                 updateStoredProducts(updatedProductsArray);

                
            } else {
                console.log("Product not found or category doesn't match the current category");
            }
        } else {
            console.log("Product category doesn't match the current category");
        }
    };

    const handleDragEnd = () => {
        console.log("Drag end event")
        updateStoredProducts(updatedProductsArray);
        const filteredProducts = storedProducts.filter(product => product.categoryId === categoryId);
        console.log("Filtered products: ", filteredProducts);
    }








    return (
        <div>
            <h2>Categories</h2>
            <div>
                <button className='rounded-md p-2 font-semibold shadow-sm bg-amber-300 active:bg-amber-500'
                onClick={()=> saveChanges()}>Apply Changes</button>
            </div>
            <ul>
                {categories.map(category => (
                    <li key={category.id}>
                        <p onClick={() => toggleCategory(category.id)}>
                            {category.name} {expandedCategories[category.id] ? '▲' : '▼'}
                        </p>
                        {expandedCategories[category.id] && (
                            <div className='shadow-lg rounded-md'>
                                <ul>
                                    

                                        {storedProducts
                                            .filter(product => product.categoryId === category.id)
                                            .sort((a, b) => a.order - b.order)
                                            .map(product => (
                                                <li key={product.id}
                                                    draggable="true"
                                                    onDragStart={(e) => handleDragStart(e, product.id, product.categoryId, category.id, product.order)}
                                                    onDragOver={(e) => handleDragOver(e, product.order)}
                                                    onDrop={(e) => handleDrop(e, category.id)}
                                                >
                                                    <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
                                                    <div className='flex'>
                                                        <div className='my-auto'>
                                                            <DragAndDrop />
                                                        </div>
                                                        <div className='my-auto'>
                                                            <input className='rounded mx-2' type="checkbox" />
                                                        </div>
                                                        <div>
                                                            <p className='text-sm'>{product.name}</p>
                                                            <p className='text-xs text-gray-400'>{product.description}</p>
                                                        </div>
                                                        <input className='rounded-md my-2 w-20' type="number" value={product.price}
                                                        onChange={()=>changeProduct("price", product.price)}></input>
                                                        <p>{product.order}</p>
                                                    </div>
                                                </li>
                                            ))}
                                    
                                </ul>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};


