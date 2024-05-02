import React from 'react'
import SideNavBar from '../components/sideNavBar'
import { GetProductsMenu } from '../components/getProductsMenu';
import { useTranslations } from 'next-intl';
const ProductsPage = () => {
    const t = useTranslations("SideNavBar")
    const p = useTranslations("ProductsMenu")
    return (
        <div className='flex min-h-screen bg-zinc-100'>
            <SideNavBar
                Promotions={t("Promotions")}
                Orders={t("Orders")}
                Home={t("Home")}
                PaymentDetails={t("PaymentDetails")}
                Products={t("Products")}
                FAQ={t("FAQ")}
                Settings={t("Settings")}
                Feedback={t("Feedback")} />
            <div className='flex flex-col pl-72 w-full items-center'>
                <div className='w-full px-8'>
                    <p>Products Page</p>
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
                    ConfirmEditProduct = {p("Confirm Edit Product")}
                    Cancel={p("Cancel")}
                    ProductName={p("Product Name")}
                    ProductDescription={p("Product Description")}
                    ProductPrice={p("Product Price")}
                    ProductPhoto={p("Product Photo")}
                    ProductInStock={p("Product In Stock")}
                    ProductVisibility={p("Product Visibility")} />
                </div>

            </div>
        </div>
    )
}
export default ProductsPage