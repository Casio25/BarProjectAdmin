'use client'
import { Dispatch, SetStateAction } from "react";
import { changeProductAction } from "../actions/changeProductAction";
import { Category, OrderOfProduct, Product } from "../interface/ProductsInterface";


    export const handleDragStart = (e: React.DragEvent<HTMLLIElement>, productId: number, productCategories: Category[], categoryId: number, productOrders: OrderOfProduct[], setTargetOrder: Dispatch<SetStateAction<number | undefined>>) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ productId, productCategories, categoryId, productOrders }));
    };

export const handleDragOver = (e: React.DragEvent<HTMLLIElement>, targetOrders: OrderOfProduct[], categoryId: number, setTargetOrder: Dispatch<SetStateAction<number | undefined>>) => {
        e.preventDefault();

        // Filter targetOrders to only include orders with the same categoryId as the initial productOrders
        const filteredOrders = targetOrders.filter(order => order.categoryId === categoryId);

        if (filteredOrders.length === 0) {
            setTargetOrder(undefined); // Handle case where no orders match the categoryId
            return;
        }

        // Calculate the total sum of orders
        const totalOrderSum = filteredOrders.reduce((sum, order) => sum + order.order, 0);

        // Calculate the average order value
        const targetOrder = totalOrderSum / filteredOrders.length;
        console.log("target order", targetOrder);

        setTargetOrder(targetOrder);
    };


    export const handleDrop = async (e: React.DragEvent<HTMLLIElement>, categoryId: number, targetOrder: number | undefined, storedProducts: Product[], updateStoredProducts: (products: Product[]) => void) => {

        


        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const { productId, productCategories, productOrders }: { productId: number, productCategories: Category[], productOrders: OrderOfProduct[], storedProducts: Product[], updateStoredProducts: (products: Product[]) => void } = data;

        const draggedProduct = storedProducts.find(product =>
            product.id === productId &&
            product.categories.some(category => productCategories.some(selectedCategory => selectedCategory.id === category.id))
        );

        if (targetOrder === undefined) {
            console.log("Target order is undefined");
            return;
        }

        // Find the targetProduct with the same categoryId as the function parameter
        const targetProduct = storedProducts.find(product => {
            const hasSameCategory = product.categories.some(selectedProductCategory => selectedProductCategory.id === categoryId);
            const hasSameOrder = product.orders.some(order => order.categoryId === categoryId && order.order === targetOrder);
            return hasSameCategory && hasSameOrder;
        });

        if (!draggedProduct || !targetProduct) {
            console.log("Product not found or category doesn't match the current category");
            return;
        }

        const productsInBetween = storedProducts.filter(product =>
            product.categories.some(cat => cat.id === categoryId) &&
            product.orders.some(order =>
                order.order > Math.min(draggedProduct?.orders.find(o => o.categoryId === categoryId)?.order!, targetOrder) &&
                order.order < Math.max(draggedProduct?.orders.find(o => o.categoryId === categoryId)?.order!, targetOrder)
            )
        );
        console.log("products in between", productsInBetween);

        const hasSameCategory = draggedProduct.orders.some(order => targetProduct.orders.some(targetOrder => order.categoryId === targetOrder.categoryId));
        if (!hasSameCategory) {
            console.log("Products don't have the same categoryId in their orders");
            return;
        }
        if (draggedProduct === targetProduct) {
            return;
        }

        // Determine the direction of adjustment based on the relative sizes of dragged and target products
        const adjustment = draggedProduct.orders.find(o => o.categoryId === categoryId)?.order! > targetOrder ? 1 : -1;

        // Adjust the order of products in between
        productsInBetween.forEach(product => {
            product.orders.forEach(order => {
                if (order.categoryId === categoryId && order.order !== draggedProduct.orders.find(o => o.categoryId === categoryId)?.order!) {
                    order.order += adjustment;
                }
            });
        });

        console.log("Adjusted products in between:", productsInBetween);

        // Update the order of the dragged product
        draggedProduct.orders = draggedProduct.orders.map(order => order.categoryId === categoryId ? { ...order, order: targetOrder } : order);

        // Update the order of the target product
        targetProduct.orders = targetProduct.orders.map(order => {
            if (order.categoryId === categoryId) {
                const newOrder = order.order + (adjustment === 1 ? 1 : -1); // Add 1 if adjustment is positive
                return { ...order, order: newOrder };
            } else {
                return order;
            }
        });

        // Update the orders of the products between dragged and target
        const updatedProductsArray = storedProducts.map(product => {
            if (
                product.id !== draggedProduct.id &&
                product.id !== targetProduct.id &&
                product.categories.some(cat => cat.id === categoryId)
            ) {
                product.orders.forEach(order => {
                    if (order.categoryId === categoryId && order.order > draggedProduct.orders.find(o => o.categoryId === categoryId)?.order! && order.order < targetOrder + 1) {
                        order.order--;
                    } else if (order.categoryId === categoryId && order.order < draggedProduct.orders.find(o => o.categoryId === categoryId)?.order! && order.order > targetOrder) {
                        order.order++;
                    }
                });
            }
            return product;
        });

        updateStoredProducts(updatedProductsArray);
        storedProducts.map(async product => {
            await changeProductAction(product)
        })
    }


