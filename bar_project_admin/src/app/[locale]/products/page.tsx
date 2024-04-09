import React from 'react'
import SideNavBar from '../components/sideNavBar'
import { GetProductsMenu } from '../components/getProductsMenu';
import { useTranslations } from 'next-intl';
const ProductsPage = () => {
    const t = useTranslations("SideNavBar")
    const p = useTranslations("ProductsMenu")
    return (
        <div className='flex bg-zinc-100'>
            <SideNavBar
                Promotions={t("Promotions")}
                Orders={t("Orders")}
                Home={t("Home")}
                PaymentDetails={t("PaymentDetails")}
                Products={t("Products")}
                FAQ={t("FAQ")}
                Settings={t("Settings")}
                Feedback={t("Feedback")} />
            <div className='flex flex-col w-full items-center'>
                <div className='w-full px-8'>
                    <p>Products Page</p>
                    <GetProductsMenu
                    Confirm={p("Confirm")}
                    Edit={p("Edit")}
                    Delete={p("Delete")}
                    ApplyChanges={p("Apply Changes")}
                    CategoriesDropdown = {p("CategoriesDropdown")}
                    CreateCategory = {p("Create Category")}
                    CreateProduct = {p("Create Product")}
                    ConfirmDeleteProduct={p("Confirm Delete Product")}
                    ConfirmEditProduct = {p("Confirm Edit Product")}
                    Cancel={p("Cancel")}/>
                </div>

            </div>
        </div>
    )
}
export default ProductsPage