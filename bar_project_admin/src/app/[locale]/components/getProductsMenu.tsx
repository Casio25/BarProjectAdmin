"use client"
import { LoginStore } from '../store/LoginStore'
import { ProductStore } from '../store/ProductStore'
import React, { useState } from 'react'
import { getProductsAction } from '../actions/getProductsAction'
import { useRouter } from '@/navigation'
import { useEffect } from 'react';
import { CategoriesInterface } from '../interface/CategoriesInterface'
import { DragAndDrop, ThreeDots, ArrowDownCategory, ArrowUpCategory } from './svgs'
import { getCategoriesAction } from '../actions/getCategoriesAction'
import { changeProductAction } from '../actions/changeProductAction'
import { Category, Product, ProductOnCategories } from '../interface/ProductsInterface'
import { DeleteProductModal } from './deleteProductModal'
import { GetProductsMenuProps } from '../interface/GetProductsMenuProps'
import { EditProductModal } from './editProductModal'
import { CreateCategoryModal } from './createCategoryModal'
import { CreateProductModal } from "./createProductModal"
import { number } from 'zod'



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

    // all handle funcitons
    const handleDragOver = (e: React.DragEvent<HTMLLIElement>, targetOrder: number) => {
        e.preventDefault();
        setTargetOrder(targetOrder)
    };

    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, productId: number, productCategoryId: Category[], categoryId: number, productOrder: number,) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ productId, productCategoryId, categoryId }));
    };


    const handleDrop = async (e: React.DragEvent<HTMLLIElement>, categoryId: number) => {
        console.log("categroy id", categoryId)
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const { productId, productCategories } = data;

        const draggedProduct = storedProducts.find(product => product.id === productId && product.categories.some(selectedProductCategory => selectedProductCategory.id === productCategories));
        const targetProduct = storedProducts.find(product => product.order === targetOrder && product.categories.some(selectedProductCategory => selectedProductCategory.id === productCategories))

        if (!draggedProduct || !targetProduct) {
            console.log("Product not found or category doesn't match the current category");
            return;
        }

        const newOrder = targetProduct.order;

        const updatedProductsArray = storedProducts.map(product => {
            const isInSameCategory = product.categories.some(cat => cat.id === categoryId);
            if (!isInSameCategory) {
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
    };




    return (
        <>
            <div >
                <h2>Categories</h2>
                <div>
                    <button className='rounded-md p-2 font-semibold shadow-sm bg-amber-300 active:bg-amber-500'
                        onClick={() => toggleCreateCategoryModal()}>{CreateCategory}</button>
                </div>
                {Array.isArray(categories) && (
                    <ul>
                        {categories.map(category => (
                            <li key={category.id}>
                                <div className='my-2 shadow rounded-md bg-white'>


                                    <div className=' flex ml-auto my-auto '>
                                        <p className='p-2'>
                                            {category.name}
                                        </p>
                                        {(() => {
                                            const productsInCategory = storedProducts.filter(product => product.categories.some(productCategory => productCategory.id === category.id));
                                            if (productsInCategory.length === 0) {
                                                return <div className="ml-auto my-auto bg-red-400 bg-opacity-10 rounded justify-start items-start gap-2.5 inline-flex">
                                                    <p className="text-red-400 text-sm font-medium font-['Work Sans'] leading-none"> {NoProductsInCategory}</p>
                                                </div>;
                                            }
                                        })()}

                                        <p className='ml-auto my-auto' onClick={() => toggleCategory(category.id)}>
                                            {expandedCategories[category.id] ? <ArrowUpCategory /> : <ArrowDownCategory />}
                                        </p>
                                        <div className="my-auto active:bg-gray-300 rounded-md" onClick={() => toggleOptions(category.id, "category")}>
                                            <ThreeDots />
                                        </div>
                                        {areOptionsOpen(category.id, "category") && (
                                            <div className={`shadow-md transition-all transform ${areOptionsOpen(category.id, "category") ? 'translate-y-0' : ' translate-y-full'} duration-300 ease-in-out`}>
                                                <p onClick={() => toggleCreateProductModal()}>{CreateProduct}</p>
                                                <p>{Delete}</p>
                                            </div>
                                        )}
                                    </div>

                                    {expandedCategories[category.id] && (
                                        <div className='shadow-lg rounded-md'>
                                            <ul>


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
                                                        <li key={product.id}
                                                            draggable="true"
                                                            onDragStart={(e) => handleDragStart(e, product.id, product.categories, category.id, product.order)}
                                                            onDragOver={(e) => handleDragOver(e, product.order)}
                                                            onDrop={(e) => handleDrop(e, category.id)}
                                                        >
                                                            <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
                                                            <div className='flex'>
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
                                                                <p>{product.order}</p>
                                                                <div className='ml-auto my-auto active:bg-gray-300 rounded-md' onClick={() => toggleOptions(product.id, "product")}>
                                                                    <ThreeDots />
                                                                </div>
                                                                {areOptionsOpen(product.id, "product") && (
                                                                    <div className={`transition-all transform ${areOptionsOpen(product.id, "product") ? 'translate-x-0' : 'translate-x-full'} ease-in-out`}>
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
                <CreateCategoryModal modalStatus={createCategoryModalStatus} toggleModal={toggleCreateCategoryModal} fetchCategories={fetchCategories} Confirm={Confirm} Cancel={Cancel}  />
                <CreateProductModal category={categoryOptions} modalStatus={createProductModalStatus} toggleModal={toggleCreateProductModal} fetchProducts={fetchProducts} ConfirmCreateProduct={CreateProduct} Cancel={Cancel} CategoriesDropdown={CategoriesDropdown} ProductName={ProductName} ProductDescription={ProductDescription} ProductPhoto={ProductPhoto} ProductPrice={ProductPrice} ProductInStock={ProductInStock} ProductVisibility={ProductVisibility} />
            </div>

        </>
    );
};





