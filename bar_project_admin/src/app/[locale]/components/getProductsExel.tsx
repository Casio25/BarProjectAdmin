"use client"
import { LoginStore } from '../store/LoginStore'
import React from 'react'
import { getProductsAction } from '../actions/getProductsAction'
import { useRouter } from '@/navigation'
import * as ExcelJS from 'exceljs';

export const GetProductsComponent = () => {
    const router = useRouter()
    const storedJwtToken = LoginStore(state => state.jwtToken);
    const getProducts = async (jwtToken: string) => {
        try {
            const response = await getProductsAction(jwtToken)
            console.log("response from exel: ", response)
            if (response == 401 ){
                router.push('/signin')
            } else {
                // Convert JSON data to Excel
                const workbook = new ExcelJS.Workbook();
                const sheet = workbook.addWorksheet('Sheet1');

                // Assuming jsonData is an array of objects with the same structure
                if (response.length > 0) {
                    // Add headers to the worksheet
                    const headers = Object.keys(response[0]);
                    sheet.addRow(headers);

                    // Add data to the worksheet
                    response.forEach(item => {
                        sheet.addRow(Object.values(item));
                    });

                    // Create a blob from the workbook
                    const blob = await workbook.xlsx.writeBuffer();

                    // Create a link element and trigger a click event to download the file
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(new Blob([blob]));
                    link.download = 'products.xlsx';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    // Handle the case when jsonData is empty
                    console.error("No data received from the server.");
                }
        }
    }
        catch (error) {
            console.log("Error during getting products: ", error)
        }
    }
    return (
            <button onClick={() => getProducts(storedJwtToken)} className='h-12 px-6 py-3 bg-violet-900 active:bg-violet-700 rounded-3xl flex-col justify-center items-center gap-2'>
                <p className='text-white text-sm font-semibold'>Get Orders</p>
            </button>   
    )


}
