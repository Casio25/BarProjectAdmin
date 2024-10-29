"use client"
import React, { useEffect, useState, HTMLInputTypeAttribute, ChangeEvent, useRef } from "react";
import { getCategoriesAction } from "../actions/getCategoriesAction";
import { CategoriesInterface } from "../interface/CategoriesInterface";
import { NewProduct } from "../interface/ProductsInterface";
import { ProductStore } from "../store/ProductStore";
import { addProductAction } from "../actions/addProductAction";
import { useRouter } from '@/navigation'
import { Visibility } from "@mui/icons-material";

import { cookies } from "next/headers";
import { CreateProductModalProps } from "../interface/CreateProductModalProps";
import {ReactCrop,  convertToPixelCrop, makeAspectCrop, ReactCropProps } from "react-image-crop";
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
    const [imagePreview, setImagePreview] = useState<string>("")

    //maxRows limiter
    const maxRows = 5
    const rowCount = newProduct.description.split("\n").length
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const rowCount = newProduct.description.split("\n").length;

        // Prevent Enter key from adding a new line if maxRows is reached
        if (e.key !== "Backspace" && rowCount >= maxRows) {
            e.preventDefault();
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getCategoriesAction()
            setCategories(await response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // base64 to image
    // function dataURLtoFile(dataurl: string, filename: string) {
    //     var arr = dataurl.split(','),
    //         mime = arr[0].match(/:(.*?);/)[1],
    //         bstr = atob(arr[arr.length - 1]),
    //         n = bstr.length,
    //         u8arr = new Uint8Array(n);
    //     while (n--) {
    //         u8arr[n] = bstr.charCodeAt(n);
    //     }
    //     return new File([u8arr], filename, { type: mime });
    // }

    function getFormData(object: any) {
        const formData = new FormData();
        Object.keys(object).forEach(key => formData.append(key, object[key]));
        return formData;
    }
    


    const validate = async () => {
        if (imageRef.current){
            setCanvasPreview(
                imageRef.current,
                previewCanvasRef.current,
                convertToPixelCrop(crop, imageRef.current.width, imageRef.current.height),
            )
            const CroppedImageURL = previewCanvasRef.current.toDataURL()
            // setNewProduct((prevState) => ({
            //     ...prevState,
            //     photo:dataURLtoFile(CroppedImageURL, `${newProduct.name}.png`)
            // })),

            setNewProduct((prevState) => ({
                ...prevState,
                photo: CroppedImageURL
            }))
            setImagePreview(CroppedImageURL)
        }
        
       

        




        if (!newProduct.name || !newProduct.description || !newProduct.photo || newProduct.price <= 0 || isNaN(newProduct.price)) {
            console.log("newProduct", newProduct)
            setEmptyFieldError("Not all fields are filled correctly");
        } else if (newProduct.categories.length === 0) {
            setEmptyFieldError("Choose at least one category")
        } else {
           
            try {
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
    // Use an effect to monitor changes to newProduct and log photo
    useEffect(() => {
        if (newProduct.photo) {
            console.log("Updated image as file:", newProduct);
        }
    }, [newProduct.photo]);

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
                const base64String = (reader.result as string).replace(/^data:image\/\w+;base64,/, '');
                setNewProduct ((prevState) => ({
                    ...prevState,
                    photo: reader.result as string
                }))
            setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file)
            console.log("file result: ", newProduct.photo)
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
                unit: "px",
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
                        <div className="space-y-4">
                            <input className="rounded-md w-full 
                            placeholder:font-semibold placeholder:text-center
                            focus:placeholder:" type="text" value={newProduct.name}
                            placeholder={ProductName}
                                onChange={(e) => {
                                    setNewProduct(prevState => ({
                                        ...prevState,
                                        name: e.target.value
                                    }))
                                    setEmptyFieldError("")
                                }} />
                            <textarea maxLength={100} className="resize-none rounded-md h-full min-h-[170px] w-full 
                                placeholder:font-semibold placeholder:text-center" 
                                placeholder={ProductDescription}
                                value={newProduct.description}
                                onChange={(e) => {
                                    
                                    setNewProduct(prevState => ({
                                        ...prevState,
                                        description: e.target.value
                                    }))
                                    setEmptyFieldError("")

                                }} 
                                onKeyDown={handleKeyDown}/>
                            <CurrencyInput
                            className="rounded-md w-full placeholder:font-semibold placeholder:text-center"
                                allowNegativeValue={false}
                                groupSeparator=" "
                                maxLength={7}
                                prefix="$"
                                placeholder={ProductPrice}
                                decimalsLimit={2}
                                onValueChange={(value, name, values) => {
                                    console.log("priceValues", values)
                                    const newPrice = values?.float
                                    setNewProduct(prevState => ({
                                    ...prevState,
                                        price: newPrice ? Number(newPrice) : 0 
                                }))
                            }}
                            />

                            <label htmlFor="photo_of_product" className=" bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-full text-white font-semibold h-12 flex items-center justify-center">{SelectImageToUpload}</label>
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





                            <ul className="py-2 space-y-2 text-sm text-gray-700 dark:text-gray-200" >
                                {categories.map(category => (
                                    <li key={category.id}>
                                        <input type="checkbox" className="m-2 appearance-none w-5 h-5 border rounded-full border-blue-500 cursor-pointer checked:bg-blue-700"
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
                            <div className="flex justify-between">
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={newProduct.visibility}
                                        onChange={() => setNewProduct(prevState => ({
                                            ...prevState,
                                            visibility: !newProduct.visibility
                                        }))}
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span>{ProductVisibility}</span>
                                    
                                </label>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={newProduct.inStock}
                                        onChange={() => setNewProduct(prevState => ({
                                            ...prevState,
                                            inStock: !newProduct.inStock
                                        }))}
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span>{ProductInStock}</span>
                                </label>
                            </div>
                        </div>
                        <p className="mt-4 text-red-600" >{emptyFiledError}</p>
                        <div className="flex py-2 justify-between">
                            <button className='rounded-md p-1 font-semibold shadow-sm bg-amber-300 active:bg-amber-500' onClick={() => {
                                validate()
                            }}>{ConfirmCreateProduct}</button>
                            <button className='rounded-md p-1 font-semibold shadow-sm bg-blue-500 active:bg-blue-700' onClick={closeModal}>{Cancel}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}