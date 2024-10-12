"use client"
import React, { useEffect, useState, HTMLInputTypeAttribute, ChangeEvent, useRef } from "react";
import { getCategoriesAction } from "../actions/getCategoriesAction";
import { CategoriesInterface } from "../interface/CategoriesInterface";
import { NewProduct } from "../interface/ProductsInterface";
import { ProductStore } from "../store/ProductStore";
import { addProductAction } from "../actions/addProductAction";
import { useRouter } from '@/navigation'
import { Visibility } from "@mui/icons-material";
import { getMaxOrderAction } from "../actions/getMaxOrderAction";
import { cookies } from "next/headers";
import { CreateProductModalProps } from "../interface/CreateProductModalProps";
import ReactCrop, { convertToPixelCrop, makeAspectCrop, ReactCropProps } from "react-image-crop";
import setCanvasPreview from "./setCanvasPreview"
import CurrencyInput from "react-currency-input-field"
import { isNull } from "util";

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
    category,
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
    ProductInStock,
    SelectImageToUpload,
}
) => {

    const MIN_DIMENSION = 100
    const MIN_ASPECT = 1
    const INITIAL_NEW_PRODUCT_STATE = {
        name: '',
        description: '',
        categories: [],
        orders: [],
        photo: "",
        price: 0,
        visibility: true,
        inStock: true,
    }


    const [categories, setCategories] = useState<CategoriesInterface>([]);
    const router = useRouter();
    const [newProduct, setNewProduct] = useState<NewProduct>(INITIAL_NEW_PRODUCT_STATE);
    const [emptyFiledError, setEmptyFieldError] = useState("")
    const isModalOpen = () => modalStatus;
    const storedProducts = ProductStore(state => state.products);
    const [crop, setCrop] = useState<any>()
    const imageRef = useRef(null)
    const previewCanvasRef = useRef(null)

    const fetchCategories = async () => {
        try {
            const response = await getCategoriesAction()
            setCategories(await response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };


    const validate = async () => {

        setCanvasPreview(
            imageRef.current,
            previewCanvasRef.current,
            convertToPixelCrop(crop, imageRef.current?.width, imageRef.current.height),
        )
        const CroppedImageURL = previewCanvasRef.current.toDataURL()
        setNewProduct((prevState) => ({
            ...prevState,
            photo: CroppedImageURL
        }))


        if (!newProduct.name || !newProduct.description || !newProduct.photo || newProduct.price <= 0 || isNaN(newProduct.price)) {
            setEmptyFieldError("Not all fields are filled correctly");
        } else if (newProduct.categories.length === 0) {
            setEmptyFieldError("Choose at least one category")
        } else {
            const maxOrdersPromises = newProduct.categories.map(category =>
                getMaxOrderAction(category.id)
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
                const response = await addProductAction(newProduct);
                if (response.statusCode == 401) {
                    router.push('/sign_in');
                } else if (response.statusCode == 400) {
                    setEmptyFieldError("Product with this name already exists");
                } else if (response == 201) {
                    setEmptyFieldError("");
                    fetchProducts();
                    toggleModal();
                    setNewProduct({
                        name: '',
                        description: '',
                        categories: [],
                        orders: [],
                        photo: "",
                        price: 0,
                        visibility: true,
                        inStock: true,
                    })
                }
            } catch (error) {
                console.error('Error creating product:', error);
            }
        }
    };

    useEffect(() => {
        fetchCategories();
        if (category) {
            console.log("categories in createProductModal", categories)
            const defaultCategory = categories.find(cat => cat.id === category);
            console.log("default category", defaultCategory)
            if (defaultCategory) {
                setNewProduct(prevProduct => ({
                    ...prevProduct,
                    categories: [defaultCategory]
                }));
            }
        }
        fetchProducts()
    }, [category]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProduct((prevState) => ({
                    ...prevState,
                    photo: reader.result as string
                }));
            };
            reader.readAsDataURL(file)
        }
    }

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const { width, height, naturalWidth, naturalHeight } = e.currentTarget
        const cropWidthInPercent = (MIN_DIMENSION / width) * 100
        if (naturalHeight < MIN_DIMENSION || naturalWidth < MIN_DIMENSION) {
            setEmptyFieldError("Image is too small")
            setNewProduct((prevState) => ({
                ...prevState,
                photo: ""
            }))
        }
        const crop = makeAspectCrop(
            {
                unit: "%",
                width: cropWidthInPercent,
            }, MIN_ASPECT,
            width,
            height
        )
        setCrop(crop)
    }

    const closeModal = () => {
        setNewProduct(INITIAL_NEW_PRODUCT_STATE),
            toggleModal()
    }
    return (
        <>
            {isModalOpen() && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="p-8 border w-96 shadow-lg rounded-md bg-white">

                        <div>
                            <p>{ProductName}</p>
                            <input className="rounded-md" type="text" value={newProduct.name}
                                onChange={(e) => {
                                    setNewProduct(prevState => ({
                                        ...prevState,
                                        name: e.target.value
                                    }))
                                    setEmptyFieldError("")
                                }} />
                            <p className="text-sm">{ProductDescription}</p>
                            <textarea maxLength={100} className="resize-none rounded-md h-full min-h-[130px] w-full" value={newProduct.description}
                                onChange={(e) => {
                                    setNewProduct(prevState => ({
                                        ...prevState,
                                        description: e.target.value
                                    }))
                                    setEmptyFieldError("")
                                }} />
                            <p>{ProductPrice}</p>
                            
                            <CurrencyInput
                            className="rounded-md"
                                allowNegativeValue={false}
                                groupSeparator=" "
                                maxLength={7}
                                prefix="$"
                                placeholder="Please enter a number"
                                decimalsLimit={2}
                                onValueChange={(value, name, values) => {
                                    const newPrice = values?.float
                                    setNewProduct(prevState => ({
                                    ...prevState,
                                    price: newPrice ? 0 : Number(newPrice)
                                }))
                            }}
                            />
                            <p>{ProductPhoto}</p>
                            <label htmlFor="photo_of_product" className="p-1 bg-blue-500 active:bg-blue-700 rounded-md">{SelectImageToUpload}</label>
                            <input className="rounded-md hidden" id="photo_of_product" type="file" accept="image/*"
                                onChange={handleFileChange} />
                            {newProduct.photo &&
                                <div className="flex flex-col items-center p-3">
                                    <ReactCrop
                                        crop={crop}
                                        onChange={(newCrop) => setCrop(newCrop)}
                                        keepSelection
                                        aspect={MIN_ASPECT}
                                        minWidth={MIN_DIMENSION}>
                                        <img className="overflow-hidden rounded-md h-full" src={newProduct.photo} ref={imageRef} onLoad={onImageLoad} />
                                    </ReactCrop>
                                </div>

                            }
                            {crop &&
                                <canvas
                                    ref={previewCanvasRef}
                                    className="mt-4 w-20 h-20 object-contain hidden"
                                />}





                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" >
                                {categories.map(category => (
                                    <li key={category.id}>
                                        <input type="checkbox" className="rounded-sm"
                                            checked={newProduct.categories.some(cat => cat.id === category.id)}
                                            onChange={() => {
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
                                            }} />{category.name}
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
                            <button className='rounded-md p-1 ml-2 font-semibold shadow-sm bg-blue-500 active:bg-blue-700' onClick={closeModal}>{Cancel}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}