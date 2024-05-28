import React, { useState } from 'react'
import SideNavBar from '../components/sideNavBar'
import { GetProductsMenu } from '../components/getProductsMenu';
import { useTranslations } from 'next-intl';
const ProductsPage = () => {
    const t = useTranslations("SideNavBar")
    const p = useTranslations("ProductsMenu")
    
    return (
        <div className='flex w-full min-h-screen bg-zinc-100'>
            <SideNavBar
                Promotions={t("Promotions")}
                Orders={t("Orders")}
                Home={t("Home")}
                PaymentDetails={t("PaymentDetails")}
                Products={t("Products")}
                FAQ={t("FAQ")}
                Settings={t("Settings")}
                Feedback={t("Feedback")} />
                    <GetProductsMenu
                    NoProductsInCategory={p("No products in category")}
                    Confirm={p("Confirm")}
                    Edit={p("Edit")}
                    Delete={p("Delete")}
                    RemoveFromCategory={p("Remove from category")}
                    ApplyChanges={p("Apply Changes")}
                    CategoriesDropdown = {p("CategoriesDropdown")}
                    CreateCategory = {p("Create Category")}
                    CreateProduct = {p("Create Product")}
                    ConfirmDeleteProduct={p("Confirm Delete Product")}
                    ConfirmDeleteCategory={p("Confirm Delete Category")}
                    DeleteCategoryWarning={p("Delete Category Warning")}
                    ConfirmEditProduct = {p("Confirm Edit Product")}
                    Cancel={p("Cancel")}
                    ProductName={p("Product Name")}
                    ProductDescription={p("Product Description")}
                    ProductPrice={p("Product Price")}
                    ProductPhoto={p("Product Photo")}
                    ProductInStock={p("Product In Stock")}
                    ProductVisibility={p("Product Visibility")} />
        </div>
    )
}
export default ProductsPage