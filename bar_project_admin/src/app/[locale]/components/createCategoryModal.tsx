"use client"
import { useEffect, useState } from "react";
import { useRouter } from '@/navigation'
import { addCategoryAction } from "../actions/addCategoryAction";
import { ICreateCategory } from "../interface/CategoriesInterface";
import { cookies } from "next/headers";
import { CreateCategoryModalProps } from "../interface/CreateCategoryModalProps";

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({ modalStatus, toggleModal, fetchCategories, CategoryNamePlaceholder,  Confirm, Cancel }) => {

    const isModalOpen = () => modalStatus;
    const router = useRouter();
    const [category, setCategory] = useState<ICreateCategory>({
        name: ""
    })
    const [categoryError, setCategoryError]= useState<string>()


    


    const createCategory = async () => {
        try{
            const response = await addCategoryAction(category)
            console.log(response)
            if (response.statusCode == 401) {
                router.push('/sign_in')
            }else if(response.statusCode == 400){
                setCategoryError("Category with this name already exists")
            }else if(response == 201){
                setCategoryError(""),
                fetchCategories();
                toggleModal()
                setCategory({
                    name: ""
                })

            }else{
                setCategoryError("unknown error")
            }

        } catch (error) {
            console.error('Error creating category:', error);
        }
    }

    const handleValidation = async ()  => {
        if (category.name === ""){
            setCategoryError("Ви нічого не ввели")
        }else{
            await createCategory()
        }
    }

    return (
        <>
            {isModalOpen() && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className=" flex flex-col p-8 border w-96 shadow-lg rounded-md bg-white">
                                <input className="rounded-md" type="text" value={category.name}
                                placeholder={CategoryNamePlaceholder}
                                    onChange={(e) => {setCategory({name: e.target.value});
                                        setCategoryError("")
                                    }}/>
                        <p className="mt-4 text-red-600">{categoryError}</p>
                        <div className="flex py-2 ">
                            <button className='rounded-md p-1 mr-2 font-semibold shadow-sm bg-amber-300 active:bg-amber-500' onClick={() => {
                                handleValidation() 
                            }}>{Confirm}</button>
                            <button className='ml-auto rounded-md p-1  font-semibold shadow-sm bg-blue-500 active:bg-blue-700' onClick={toggleModal}>{Cancel}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}