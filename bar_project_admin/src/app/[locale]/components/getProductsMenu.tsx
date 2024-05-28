"use client"
import { LoginStore } from '../store/LoginStore'
import { ProductStore } from '../store/ProductStore'
import React, { useRef, useState } from 'react'
import { getProductsAction } from '../actions/getProductsAction'
import { useRouter } from '@/navigation'
import { useEffect } from 'react';
import { CategoriesInterface } from '../interface/CategoriesInterface'
import { DragAndDrop, ThreeDots, ArrowDownCategory, ArrowUpCategory } from './svgs'
import { getCategoriesAction } from '../actions/getCategoriesAction'
import { changeProductAction } from '../actions/changeProductAction'
import { Category, Product, ProductOnCategories, OrderOfProduct } from '../interface/ProductsInterface'
import { DeleteProductModal } from './deleteProductModal'
import { GetProductsMenuProps } from '../interface/GetProductsMenuProps'
import { EditProductModal } from './editProductModal'
import { CreateCategoryModal } from './createCategoryModal'
import { CreateProductModal } from "./createProductModal"
import { number } from 'zod'
import autoAnimate from '@formkit/auto-animate'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { DeleteCategoryModal } from './deleteCategoryModal'
import { GetProductsExel } from './getProductsExel'




export const GetProductsMenu: React.FC<GetProductsMenuProps> = ({
    NoProductsInCategory,
    Confirm,
    Edit,
    Delete,
    RemoveFromCategory,
    ApplyChanges,
    CategoriesDropdown,
    CreateCategory,
    CreateProduct,
    ConfirmDeleteProduct,
    ConfirmDeleteCategory,
    DeleteCategoryWarning,
    ConfirmEditProduct,
    Cancel,
    ProductName,
    ProductDescription,
    ProductPhoto,
    ProductPrice,
    ProductVisibility,
    ProductInStock
}) => {
    const router = useRouter();
    const storedJwtToken = typeof window !== 'undefined' ? localStorage.getItem("jwtToken") : null;
    const storedProducts = ProductStore(state => state.products);
    const updateStoredProducts = ProductStore(state => state.updateProducts)
    const [categories, setCategories] = useState<CategoriesInterface>([]);
    const [expandedCategories, setExpandedCategories] = useState<{ [key: number]: boolean }>({});
    const [categoryOptions, setCategoryOptions] = useState<number | undefined>(undefined);
    const [productOptions, setProductOptions] = useState<number | undefined>(undefined);
    const [targetOrder, setTargetOrder] = useState<number>()
    const [deleteProductModal, setDeleteProductModal] = useState<Product>()
    const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false)
    const [editProductModal, setEditProductModal] = useState<Product>()
    const [editModalStatus, setEditModalStatus] = useState<boolean>(false)
    const [createCategoryModalStatus, setCreateCategoryModalStatus] = useState<boolean>(false)
    const [createProductModalStatus, setCreateProductModalStatus] = useState<boolean>(false)
    const [deleteCategoryModalStatus, setDeleteCategoryModalStatus] = useState<boolean>(false)
    const [deleteCategoryModal, setDeleteCategoryModal] = useState<Category>()
    

    // autoAnimate functionalirty
    const [parent, enableAnimations] = useAutoAnimate(/* optional config */)

    const fetchCategories = async () => {
        try {
            const response = await getCategoriesAction(storedJwtToken)
            if (response == 401) {
                router.push('/signin')
            } else {
                setCategories(await response);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await getProductsAction(storedJwtToken)
            console.log(response)
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

    //changing spesific property of specific product

    

    const removeProductCategory = async (product: Product, categoryId: number) => {
        const updatedCategoeries = product.categories.filter((cat) => cat.id !== categoryId);
        const updatedOrders = product.orders.filter((order)=> order.categoryId !== categoryId);
        const updatedProduct: Product = {
            ...product,
            categories: updatedCategoeries,
            orders: updatedOrders
        };
        console.log("updatedOrders", updatedOrders)
        await changeProductAction(updatedProduct, storedJwtToken)
        fetchProducts()

    }

    //saving all the products from store
    const saveChanges = async () => {
        try {
            await storedProducts.forEach((product) => {
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

    const toggleOptions = (id: number, type: 'category' | 'product'): void => {
        if (type === 'category') {
            if (categoryOptions === id) {
                setCategoryOptions(undefined);
            } else {
                setCategoryOptions(id);
            }
        } else if (type === 'product') {
            if (productOptions === id) {
                setProductOptions(undefined);
            } else {
                setProductOptions(id);
            }
        }
    };


    const areOptionsOpen = (id: number, type: 'category' | 'product'): boolean => {
        if (type === 'category') {
            return categoryOptions === id;
        } else if (type === 'product') {
            return productOptions === id;
        }
        return false;
    };
    //modal funcitons
    const toggleDeleteModal = () => {
        setDeleteModalStatus(!deleteModalStatus)
    }

    const toggleEditModal = () => {
        setEditModalStatus(!editModalStatus)
    }

    const toggleCreateCategoryModal = () => {
        console.log("storedProducts", storedProducts)
        setCreateCategoryModalStatus(!createCategoryModalStatus)
    }

    const toggleCreateProductModal = () => {
        console.log("categoryOptions", categoryOptions)
        setCreateProductModalStatus(!createProductModalStatus)
    }
    const toggleDeleteCategoryModal = () => {
        setDeleteCategoryModalStatus(!deleteCategoryModalStatus)
    }

    // all handle funcitons
    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, productId: number, productCategories: Category[], categoryId: number, productOrders: OrderOfProduct[]) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ productId, productCategories, categoryId, productOrders }));
    };

    const handleDragOver = (e: React.DragEvent<HTMLLIElement>, targetOrders: OrderOfProduct[], categoryId: number) => {
        e.preventDefault();

        // Filter targetOrders to only include orders with the same categoryId as the initial productOrders
        const filteredOrders = targetOrders.filter(order => order.categoryId === categoryId);

        // Calculate the total sum of orders
        const totalOrderSum = filteredOrders.reduce((sum, order) => sum + order.order, 0);

        // Calculate the average order value
        const targetOrder = totalOrderSum / filteredOrders.length;
        console.log("target order", targetOrder);

        setTargetOrder(targetOrder);
    };

    const handleDrop = async (e: React.DragEvent<HTMLLIElement>, categoryId: number) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const { productId, productCategories, productOrders }: { productId: number, productCategories: Category[], productOrders: OrderOfProduct[] } = data;

        const draggedProduct = storedProducts.find(product =>
            product.id === productId &&
            product.categories.some(category => productCategories.some(selectedCategory => selectedCategory.id === category.id))
        );

        // Find the targetProduct with the same categoryId as the function parameter
        const targetProduct = storedProducts.find(product => {
            const hasSameCategory = product.categories.some(selectedProductCategory => selectedProductCategory.id === categoryId);
            const hasSameOrder = product.orders.some(order => order.categoryId === categoryId && order.order === targetOrder);
            return hasSameCategory && hasSameOrder;
        });

        const productsInBetween = storedProducts.filter(product =>
            product.categories.some(cat => cat.id === categoryId) &&
            product.orders.some(order =>
                order.order > Math.min(draggedProduct.orders.find(o => o.categoryId === categoryId)?.order!, targetOrder) &&
                order.order < Math.max(draggedProduct.orders.find(o => o.categoryId === categoryId)?.order!, targetOrder)
            )
        );
        console.log("prodcuts in between", productsInBetween);

        if (!draggedProduct || !targetProduct) {
            console.log("Product not found or category doesn't match the current category");
            return;
        }
        const hasSameCategory = draggedProduct.orders.some(order => targetProduct.orders.some(targetOrder => order.categoryId === targetOrder.categoryId));
        if (!hasSameCategory) {
            console.log("Products don't have the same categoryId in their orders");
            return;
        }
        if (draggedProduct === targetProduct){
            return;
        }
        // Determine the direction of adjustment based on the relative sizes of dragged and target products
        const adjustment = draggedProduct.orders.find(o => o.categoryId === categoryId)?.order! > targetOrder ? 1 : -1;

        // Adjust the order of products in between
        productsInBetween.forEach(product => {
            product.orders.forEach(order => {
                if (order.categoryId === categoryId && order.order !== draggedProduct.orders.find(o => o.categoryId === categoryId)?.order!) {
                    order.order += adjustment;
                }
            });
        });

        console.log("Adjusted products in between:", productsInBetween);


        // Update the order of the dragged product
        // Update the order of the dragged product
        draggedProduct.orders = draggedProduct.orders.map(order => order.categoryId === categoryId ? { ...order, order: targetOrder } : order);

        // Update the order of the target product
        targetProduct.orders = targetProduct.orders.map(order => {
            if (order.categoryId === categoryId) {
                const newOrder = order.order + (adjustment === 1 ? 1 : -1); // Add 1 if adjustment is positive
                return { ...order, order: newOrder };
            } else {
                return order;
            }
        });

        // Update the orders of the products between dragged and target
        const updatedProductsArray = storedProducts.map(product => {
            if (
                product.id !== draggedProduct.id &&
                product.id !== targetProduct.id &&
                product.categories.some(cat => cat.id === categoryId)
            ) {
                product.orders.forEach(order => {
                    if (order.categoryId === categoryId && order.order > draggedProduct.orders.find(o => o.categoryId === categoryId)?.order! && order.order < targetOrder + 1) {
                        order.order--;
                    } else if (order.categoryId === categoryId && order.order < draggedProduct.orders.find(o => o.categoryId === categoryId)?.order! && order.order > targetOrder) {
                        order.order++;
                    }
                });
            }
            return product;
        });

        await updateStoredProducts(updatedProductsArray);
        storedProducts.map(async product => {
            await changeProductAction(product, storedJwtToken)
        })
        
        
    }











    return (
        <>
            <div className='flex-1 w- mx-5'>
                <div className='mt-5'>
                    <GetProductsExel/>
                    <button className='rounded-md p-2 font-semibold shadow-sm bg-amber-300 active:bg-amber-500'
                        onClick={() => toggleCreateCategoryModal()}>{CreateCategory}</button>
                </div>
                {Array.isArray(categories) && (
                    <ul ref={parent}>
                        {categories.map(category => (
                            <li ref={parent} key={category.id}>
                                <div  className='my-2 w-full shadow rounded-md bg-white'>


                                    <div className='flex ml-auto my-auto relative font-semibold'>
                                        <p className='p-2'>
                                            {category.name}
                                        </p>
                                        {(() => {
                                            const productsInCategory = storedProducts.filter(product => product.categories.some(productCategory => productCategory.id === category.id));
                                            if (productsInCategory.length === 0) {
                                                return (
                                                    <div className="ml-auto my-auto bg-red-400 bg-opacity-10 rounded justify-start items-start gap-2.5 inline-flex">
                                                        <p className="text-red-400 text-sm font-medium font-['Work Sans'] leading-none">{NoProductsInCategory}</p>
                                                    </div>
                                                );
                                            }
                                        })()}

                                        <p className='ml-auto my-auto' onClick={() => toggleCategory(category.id)}>
                                            {expandedCategories[category.id] ? <ArrowUpCategory className="transition-all" /> : <ArrowUpCategory className="rotate-180 transition-all" />}
                                        </p>
                                        <div className="my-auto active:bg-gray-300 rounded-md" onClick={() => toggleOptions(category.id, "category")}>
                                            <ThreeDots />
                                        </div>
                                        {areOptionsOpen(category.id, "category") && (
                                            <div className={`transition-all p-1 transform absolute top-10 right-0 bg-white rounded-md shadow-md ${areOptionsOpen(category.id, "category") ? 'translate-x-0' : 'translate-x-full'} ease-in-out`} style={{ zIndex: 2 }}>
                                                <p className='active:bg-slate-300 cursor-pointer' onClick={() => { toggleCreateProductModal(); toggleOptions(category.id, "category") }}>{CreateProduct}</p>
                                                {(category.type === "private") && (
                                                    <p className='active:bg-slate-300 cursor-pointer' onClick={() => { toggleDeleteCategoryModal(); setDeleteCategoryModal(category); toggleOptions(category.id, "category") }}>{Delete}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>


                                    {expandedCategories[category.id] && (
                                        <div className='shadow-lg rounded-md'>
                                            <ul ref={parent} >
                                                {storedProducts
                                                    .filter(product => product.categories.some(productCategory => productCategory.id === category.id))
                                                    .sort((a, b) => {
                                                        // Get the order values of the first orders in the products' orders arrays within the category
                                                        const orderA = a.orders
                                                            .filter(order => order.categoryId === category.id)
                                                            .map(order => order.order)
                                                            .sort((x, y) => x - y)[0] || Infinity;

                                                        const orderB = b.orders
                                                            .filter(order => order.categoryId === category.id)
                                                            .map(order => order.order)
                                                            .sort((x, y) => x - y)[0] || Infinity;

                                                        // Compare the order values
                                                        return orderA - orderB;
                                                    })
                                                    .map(product => (
                                                        <li ref={parent} key={product.id}
                                                            draggable="true"
                                                            onDragStart={(e) => handleDragStart(e, product.id, product.categories, category.id, product.orders)}
                                                            onDragOver={(e) => handleDragOver(e, product.orders, category.id)}
                                                            onDrop={(e) => handleDrop(e, category.id)}
                                                        >
                                                            <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
                                                            <div  className='flex'>
                                                                <div className='my-auto'>
                                                                    <DragAndDrop />
                                                                </div>
                                                                <div className='my-auto py-2.5'>
                                                                    <input className='rounded mx-2' type="checkbox" />
                                                                </div>
                                                                <div className='my-auto'>
                                                                    <p className='text-sm'>{product.name}</p>

                                                                </div>
                                                                <div className='my-auto px-5 flex-grow'>
                                                                    <p className='text-xs text-gray-400'>{product.description}</p>
                                                                </div>

                                                                <div className="my-auto ml-auto w-20  h-8 px-3 py-2 rounded border border-neutral-300">
                                                                    <p className="text-justify text-black text-sm font-medium font-['Work Sans'] leading-none">{product.price}</p>
                                                                </div>
                                                                {product.orders.map(order => (
                                                                    <li key={order.id}>{order.order}</li>
                                                                ))}
                                                                <div className='ml-auto my-auto active:bg-gray-300 rounded-md' onClick={() => toggleOptions(product.id, "product")}>
                                                                    <ThreeDots />
                                                                </div>
                                                                {areOptionsOpen(product.id, "product") && (
                                                                    <div className={`transition-all p-1 transform absolute top-10 right-0 bg-white rounded-md shadow-md ${areOptionsOpen(product.id, "product") ? 'translate-x-0' : 'translate-x-full'} ease-in-out`} style={{ zIndex: 2 }}>
                                                                        <p onClick={() => { toggleEditModal(); setEditProductModal(product) }}>{Edit}</p>
                                                                        <p onClick={() => { toggleDeleteModal(); setDeleteProductModal(product) }}>{Delete}</p>
                                                                        {product.categories.length >= 2 && (
                                                                            <p onClick={() => removeProductCategory(product, category.id)}>{RemoveFromCategory}</p>
                                                                        )}
                                                                    </div>
                                                                )}

                                                            </div>
                                                        </li>
                                                    ))}

                                            </ul>
                                        </div>
                                    )}
                                </div>
                                
                            </li>
                        ))}
                    </ul>
                )}
                <DeleteProductModal product={deleteProductModal} modalStatus={deleteModalStatus} toggleModal={toggleDeleteModal} fetchProducts={fetchProducts} ConfirmDeleteProduct={ConfirmDeleteProduct} Cancel={Cancel} />
                <EditProductModal product={editProductModal} modalStatus={editModalStatus} toggleModal={toggleEditModal} ConfirmEditProduct={ConfirmEditProduct} Cancel={Cancel} CategoriesDropdown={CategoriesDropdown} ProductName={ProductName} ProductDescription={ProductDescription} ProductPhoto={ProductPhoto} ProductPrice={ProductPrice} ProductInStock={ProductInStock} ProductVisibility={ProductVisibility} />
                <CreateCategoryModal modalStatus={createCategoryModalStatus} toggleModal={toggleCreateCategoryModal} fetchCategories={fetchCategories} Confirm={Confirm} Cancel={Cancel} />
                <DeleteCategoryModal modalStatus={deleteCategoryModalStatus} toggleModal={toggleDeleteCategoryModal} category={deleteCategoryModal} fetchProducts={fetchProducts} fetchCategories={fetchCategories} ConfirmDeleteCategory={ConfirmDeleteCategory} DeleteCategoryWarning={DeleteCategoryWarning} Cancel={Cancel} />
                <CreateProductModal category={categoryOptions} modalStatus={createProductModalStatus} toggleModal={toggleCreateProductModal} fetchProducts={fetchProducts} ConfirmCreateProduct={CreateProduct} Cancel={Cancel} CategoriesDropdown={CategoriesDropdown} ProductName={ProductName} ProductDescription={ProductDescription} ProductPhoto={ProductPhoto} ProductPrice={ProductPrice} ProductInStock={ProductInStock} ProductVisibility={ProductVisibility} />
            </div>
            
            
        </>
    );
};





