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
import { handleDragOver, handleDragStart, handleDrop } from './ProductDrag&Drop'
import CurrencyInput from 'react-currency-input-field'





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
    CategoryNamePlaceholder,
    Cancel,
    ProductName,
    ProductDescription,
    ProductPhoto,
    ProductPrice,
    ProductVisibility,
    ProductInStock,
    SelectImageToUpload
}) => {
    const router = useRouter();
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
            
            const response = await getCategoriesAction()
            // const arrayResponse: Category[] = Object.values(response)
            
            if (response.statusCode == 401) {
                router.push('/sign_in')
            } else {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await getProductsAction()
            // const arrayResponse: Product[] = Object.values(response)
            console.log('fetchProducts response', response)
            if (response.statusCode == 401) {
                router.push('/sign_in')
            } else {
                updateStoredProducts(response.data);
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
        await changeProductAction(updatedProduct)
        fetchProducts()

    }

    //saving all the products from store
    const saveChanges = async () => {
        try {
            storedProducts.forEach((product) => {
                changeProductAction(product)
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
            console.log("categoryId", id)
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
    return (
        <>
            <div className='flex-1 w- mx-5'>
                <div className='mt-5'>
                    <GetProductsExel/>
                    <button className='rounded-md p-2 font-semibold shadow-sm bg-amber-300 active:bg-amber-500'
                        onClick={() => toggleCreateCategoryModal()}>{CreateCategory}</button>
                </div>
                {Array.isArray(categories) && Array.isArray(storedProducts) && (
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
                                                            onDragStart={(e) => handleDragStart(e, product.id, product.categories, category.id, product.orders, setTargetOrder)}
                                                            onDragOver={(e) => handleDragOver(e, product.orders, category.id, setTargetOrder)}
                                                            onDrop={(e) => handleDrop(e, category.id, targetOrder, storedProducts, updateStoredProducts )}
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
                                                                <div>
                                                                    <img className='rounded-md h-full' src={product.photo}/>
                                                                </div>

                                                                
                                                                    <CurrencyInput className="my-auto ml-auto w-40  h-8 px-3 py-2 rounded border border-neutral-300"
                                                                        groupSeparator=" "
                                                                        maxLength={7}
                                                                        prefix="$ "
                                                                    value={product.price}/>
                                                                
                                                                <ul ref={parent}>
                                                                    {product.orders.map(order => (
                                                                        <li key={order.id}>{order.order}</li>
                                                                    ))}
                                                                </ul>
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
                <EditProductModal product={editProductModal} modalStatus={editModalStatus} toggleModal={toggleEditModal} ConfirmEditProduct={ConfirmEditProduct} Cancel={Cancel} CategoriesDropdown={CategoriesDropdown} ProductName={ProductName} ProductDescription={ProductDescription} ProductPhoto={ProductPhoto} ProductPrice={ProductPrice} ProductInStock={ProductInStock} ProductVisibility={ProductVisibility}  />
                <CreateCategoryModal modalStatus={createCategoryModalStatus} toggleModal={toggleCreateCategoryModal} fetchCategories={fetchCategories} CategoryNamePlaceholder={CategoryNamePlaceholder} Confirm={Confirm} Cancel={Cancel}  />
                <DeleteCategoryModal modalStatus={deleteCategoryModalStatus} toggleModal={toggleDeleteCategoryModal} category={deleteCategoryModal} fetchProducts={fetchProducts} fetchCategories={fetchCategories} ConfirmDeleteCategory={ConfirmDeleteCategory} DeleteCategoryWarning={DeleteCategoryWarning} Cancel={Cancel}/>
                <CreateProductModal category={categoryOptions} modalStatus={createProductModalStatus} toggleModal={toggleCreateProductModal} fetchProducts={fetchProducts} ConfirmCreateProduct={CreateProduct} Cancel={Cancel} CategoriesDropdown={CategoriesDropdown} ProductName={ProductName} ProductDescription={ProductDescription} ProductPhoto={ProductPhoto} ProductPrice={ProductPrice} ProductInStock={ProductInStock} ProductVisibility={ProductVisibility} SelectImageToUpload={SelectImageToUpload}/>
            </div>
            
            
        </>
    );
};





