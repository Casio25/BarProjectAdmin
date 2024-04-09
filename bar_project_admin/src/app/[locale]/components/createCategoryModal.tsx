"use client"
import { useEffect, useState } from "react";
import { useRouter } from '@/navigation'
import { addCategoryAction } from "../actions/addCategoryAction";
import { ICreateCategory } from "../interface/CategoriesInterface";

export const CreateCategoryModal = ({ modalStatus, toggleModal, fetchCategories, Confirm, Cancel } : { modalStatus: boolean, toggleModal: () => void, fetchCategories: () => void,  Confirm: string, Cancel: string}) => {

    const isModalOpen = () => modalStatus;
    const router = useRouter();
    const storedJwtToken = localStorage.getItem("jwtToken");
    const [category, setCategory] = useState<ICreateCategory>({
        name: ""
    })
    const [categoryError, setCategoryError]= useState<string>()


    


    const createCategory = async () => {
        try{
            const response = await addCategoryAction(category, storedJwtToken)
            console.log(response)
            if (response == 401) {
                router.push('/signin')
            }else if(response.status == 400){
                setCategoryError("Category with this name already exists")
            }else if(response.status == 201){
                setCategoryError(""),
                fetchCategories();
                toggleModal()
                

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
                    <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
                        
                            <div>
                                <p>Name</p>
                                <input className="rounded-md" type="text" value={category.name}
                                    onChange={(e) => {setCategory({name: e.target.value});
                                        setCategoryError("")
                                    }}/>
                            </div>
                        <p className="mt-4 text-red-600">{categoryError}</p>
                        <div className="flex py-2">
                            <button className='rounded-md p-1 mr-2 font-semibold shadow-sm bg-amber-300 active:bg-amber-500' onClick={() => {
                                handleValidation() 
                            }}>{Confirm}</button>
                            <button className='rounded-md p-1 ml-2 font-semibold shadow-sm bg-blue-500 active:bg-blue-700' onClick={toggleModal}>{Cancel}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}