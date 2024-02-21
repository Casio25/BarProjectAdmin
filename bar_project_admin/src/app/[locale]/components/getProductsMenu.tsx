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
import {DragDropContext, Droppable}from "react-beautiful-dnd"
import { getCategoriesAction } from '../actions/getCategoriesAction'
import { number } from 'zod'

export const GetProductsMenu = () => {
    const router = useRouter();
    const storedJwtToken = localStorage.getItem("jwtToken");
    const storedProducts = ProductStore(state => state.products);
    const updateStoredProducts = ProductStore(state => state.updateProducts)
    const [categories, setCategories] = useState<CategoriesInterface>([]);
    const [targetOrder, setTargetOrder] = useState<number>()
    const [expandedCategories, setExpandedCategories] = useState<{ [key: number]: boolean }>({});
    // all fetching
    const switchProductsOrder =  (product: any) => {
        
    }

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
        const updatedProduct = {...product}
        return updatedProduct
    })


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

    const handleDragStart = (e: React.DragEvent<HTMLLIElement>,  productId: number, productCategoryId: number, categoryId: number) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ productId, productCategoryId, categoryId }));
    };

    const onDragEnd = () => {
        console.log("Drag end event")
    }

    const handleDrop = async (e: React.DragEvent<HTMLLIElement>, categoryId: number) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const { productId, productCategoryId, originalCategoryId } = data;

        if (productCategoryId === categoryId) {
            console.log('Dropped product ID', productId, 'into category ID', categoryId);

            const draggedProduct = updatedProducts.find(product => product.id === productId && product.categoryId === productCategoryId);
            const targetProduct = updatedProducts.find(product => product.order === targetOrder && product.categoryId === productCategoryId);
            const biggerProducts = updatedProducts.filter(product => product.order > targetOrder && product.categoryId === productCategoryId);
            let reorderedBiggerProducts;

            if (draggedProduct && targetProduct) {
                const reorderedDraggedProduct = {
                    ...draggedProduct,
                    order: targetProduct.order
                };

                const reorderedTargetProduct = {
                    ...targetProduct,
                    order: targetProduct.order + 1
                };

                if (biggerProducts) {
                    reorderedBiggerProducts = biggerProducts.map((product) => {
                        return {
                            ...product,
                            order: product.order + 1
                        }
                    });
                    const index = reorderedBiggerProducts.indexOf(draggedProduct);
                    reorderedBiggerProducts.splice(index, 1);
                }

                console.log('Reordered dragged product:', reorderedDraggedProduct);
                console.log('Reordered target product:', reorderedTargetProduct);
                console.log("Reordered bigger products: ", reorderedBiggerProducts);

                const reorderedProducts = reorderedBiggerProducts.concat(reorderedTargetProduct, reorderedDraggedProduct);

                // Filter out the existing products with the same IDs
                const filteredStoredProducts = storedProducts.filter(product => !reorderedProducts.some(p => p.id === product.id));

                // Concatenate the filtered products with the reordered products
                const updatedProductsArray = filteredStoredProducts.concat(reorderedProducts);

                updateStoredProducts(updatedProductsArray);
                switchProductsOrder(reorderedDraggedProduct);
                const filteredProducts = storedProducts.filter(product => product.categoryId === 3);
                console.log("Filtered products: ", filteredProducts);
            } else {
                console.log("Product not found or category doesn't match the current category");
            }
        } else {
            console.log("Product category doesn't match the current category");
        }
    };




    return (
        <div>
            <h2>Categories</h2>
            <ul>
                {categories.map(category => (
                    <li key={category.id}>
                        <p onClick={() => toggleCategory(category.id)}>
                            {category.name} {expandedCategories[category.id] ? '▲' : '▼'}
                        </p>
                        {expandedCategories[category.id] && (
                            <div className='shadow-lg rounded-md'>
                                <ul>
                                    <DragDropContext
                                        onDragEnd={onDragEnd}>
                                            
                                    {storedProducts
                                        .filter(product => product.categoryId === category.id)
                                        .sort((a, b) => a.order - b.order)
                                        .map(product => (
                                            <li key={product.id}
                                                draggable="true"
                                                onDragStart={(e) => handleDragStart(e, product.id, product.categoryId, category.id)}
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
                                                    <input className='rounded-md my-2 w-20' type="number" value={product.price}></input>
                                                </div>
                                            </li>
                                        ))}
                                    </DragDropContext>
                                </ul>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};


