"use client"
import { LoginStore } from '../store/LoginStore'
import { ProductStore } from '../store/ProductStore'
import React, { useState } from 'react'
import { getProductsAction } from '../actions/getProductsAction'
import { useRouter } from '@/navigation'
import { useEffect } from 'react';
import { CategoriesInterface } from '../interface/CategoriesInterface'
import { Product, ProductsInterface } from '../interface/ProductsInterface'
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

    const changeProduct = async(property: string, value: any, productId: number) => {
        const changedProduct = storedProducts.find(product => product.id === productId)
        console.log(changedProduct)
        const updatedPropertiesProducts = storedProducts.map(product => {
            if (product.id === productId) {
                
                return { ...product, [property]: value };
            } else {
                return product;
            }
        });
       await updateStoredProducts(updatedPropertiesProducts);
    };

    const saveChanges = async () => {
        const filteredProducts = storedProducts.filter(product => product.categoryId === 1);
        console.log("Filtered products: ", filteredProducts);
        try {
            storedProducts.forEach((product) => {
                console.log(product)
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


    const handleDrop = async (e: React.DragEvent<HTMLLIElement>, categoryId: number) => {
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


                await updateStoredProducts(updatedProductsArray);


            } else {
                console.log("Product not found or category doesn't match the current category");
            }
        } else {
            console.log("Product category doesn't match the current category");
        }
    };

    const handleDragEnd = () => {
        console.log("Drag end event")
        
        const filteredProducts = storedProducts.filter(product => product.categoryId === 1);
        console.log("Filtered products: ", filteredProducts);
    }








    return (
        <div>
            <h2>Categories</h2>
            <div>
                <button className='rounded-md p-2 font-semibold shadow-sm bg-amber-300 active:bg-amber-500'
                    onClick={() => saveChanges()}>Apply Changes</button>
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
                                                onDragEnd={(e) => handleDragEnd()}
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
                                                        onKeyPress={(event) => {
                                                            if (!/[0-9]/.test(event.key)) {
                                                                event.preventDefault();
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            const price = parseFloat(e.target.value);
                                                            changeProduct("price", price, product.id);
                                                        }} />
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





