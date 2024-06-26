"use client"
import React, { useEffect, useState } from 'react';
import { OrderInterface, OrderStatus } from '../interface/OrderInterface';
import { useRouter } from '@/navigation'
import { getOrdersAction } from '../actions/getOrdersAction';
import { OrdersStore } from '../store/OrderStore';

import {  ProductsInterface } from '../interface/ProductsInterface';
import { getProductsAction } from '../actions/getProductsAction';
import { OrdersMenuProps } from '../interface/OrdersMenuProps';



const OrdersMenu: React.FC<OrdersMenuProps> = ({
    NewOrders,
    OrderStatusNew,
    InProgress,
    Finished,
    OrderStatusFinished,
    Paid,
    Unpaid,
    paid,
    unpaid,
    Total,
    Quantity_short,
    Price,
    Product
}) => {
    const router = useRouter();
    const storedJwtToken = typeof window !== 'undefined' ? localStorage.getItem("jwtToken") : null;
    const storedOrders = OrdersStore(state => state.orders);
    const updateStoredOrders = OrdersStore(state => state.updateOrders)
    const [newOrder, setNewOrder] = useState<OrderInterface>({
        id: 1,
        orderId: 1,
        creatAt: (new Date()).toJSON(),
        orderStatus: OrderStatus.NEW,
        products: [],
        totalPrice: 0
    });
    const [selectedOrder, setSelectedOrder] = useState<OrderInterface >({
        id: 1,
        orderId: 1,
        creatAt: (new Date()).toJSON(),
        orderStatus: OrderStatus.NEW,
        products: [],
        totalPrice: 0
    })
    const [draggedOrder, setDraggedOrder] = useState<OrderInterface | null>(null)
    
    const createOrder = () => {
        setNewOrder({
            id: 1,
            orderId: newOrder.orderId + 1,
            creatAt: (new Date()).toJSON(),
            orderStatus: OrderStatus.NEW,
            products: [],
            payment: [],
            totalPrice: 0
        });
    };

    const fetchOrders = async () => {
        try {
            const response = await getOrdersAction(storedJwtToken)
            console.log(response)
            if (response == 401) {
                router.push('/signin')
            } else {
                updateStoredOrders(await response);

            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    useEffect(() => {
        fetchOrders()
        console.log(storedOrders)
    }, []);


    const formatDateToShort = (stringDate: string) => {
        const date = new Date(stringDate)
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = date.getUTCFullYear();

        return `${day}/${month}/${year}`;
    }

    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, order: OrderInterface) => {
        setDraggedOrder(order)
        console.log("draggedOrder", order)
    }
    const handleDragOver = (e: React.DragEvent<HTMLUListElement>) => {
        e.preventDefault()
    }
    const updateOrderStatus = (orderId: number, orderStatus: OrderStatus) => {
        const updatedOrders = storedOrders.map(order =>
            order.id === orderId ? { ...order, orderStatus } : order
        );
        updateStoredOrders(updatedOrders);
        if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder({ ...selectedOrder, orderStatus });
        }
    };
    

    const handleDrop = (e: React.DragEvent<HTMLUListElement>, orderStatus: OrderStatus) => {
        e.preventDefault();
        if (draggedOrder) {
            updateOrderStatus(draggedOrder.id, orderStatus);
            setDraggedOrder(null);
        }
    };

    const renderOrderList = (orders: OrderInterface[], status: OrderStatus, color : string) => (
        <ul className="flex-col relative justify-center p-5 mt-6 w-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}>
            <div className={`flex absolute justify-center items-center h-8 bg-white rounded-2xl border-1 border-${color}-400`}>
                <p className='text-sm font-semibold ml-10 mx-2'>{status === "new" ? NewOrders : status === OrderStatus.INPROGRESS ? InProgress : Finished}</p>
            </div>
            <div className={`flex absolute justify-center items-center w-8 h-8 bg-${color}-400 rounded-2xl`}>
                <p className='font-bold text-white'>{orders.length}</p>
            </div>
            {orders.length === 0 ? (
                <li className='mt-32 mb-5 h-20 bg-white shadow rounded-lg w-full flex relative justify-center items-center'>
                    <p className='text-gray-500'>There are no orders</p>
                </li>
            ) : (
            orders.map(order => (
                <li key={order.id} className='first-of-type:mt-32 mb-5 bg-white shadow rounded-lg w-full flex relative'
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, order)}>
                    <div className={`bg-${color}-400 rounded-lg w-full`}>
                        <div className='relative left-2 bg-white grid grid-cols-2 border-2 border-white rounded-lg p-2'
                            onClick={() => setSelectedOrder(order)}>
                            <p className='font-semibold'>Order ID: {order.id}</p>
                            <p className='font-semibold ml-auto'>{order.totalPrice}</p>
                            <p className='text-sm'>{formatDateToShort(order.creatAt)}</p>
                            <p className={`ml-auto text-xs rounded-lg p-1 ${order?.payment?.[0]?.paymentStatus === "paid"
                                    ? "text-yellow-300 bg-black font-semibold"
                                    : "text-neutral-500 bg-zinc-100"
                                }`}>
                                {order?.payment?.[0]?.paymentStatus === "paid" ? paid : unpaid}
                            </p>

                        </div>
                    </div>
                </li>
            ))
            )}
        </ul>
    );

    




    return (
        <>
            <div className="flex w-lvw h-28 bg-white shadow">
                {storedOrders && storedOrders.length > 0 ? (
                    <>
                        {renderOrderList(storedOrders.filter(order => order.orderStatus === "new"), OrderStatus.NEW, "blue")}
                        {renderOrderList(storedOrders.filter(order => order.orderStatus === "inProgress"), OrderStatus.INPROGRESS, "orange")}
                        {renderOrderList(storedOrders.filter(order => order.orderStatus === "finished"), OrderStatus.FINISHED, "green")}
                    </>
                ) : (
                    <div className="flex w-full justify-center items-center">
                        <p className="text-gray-500">There are no orders</p>
                    </div>
                )}
            </div>
            <div className='w-3/5 bg-white ml-auto relative'>
                <div className='divide-black'>
                    <p className="text-black text-lg font-semibold font-['Barlow Semi Condensed'] leading-normal"> Order {selectedOrder.id}</p>
                </div>
                <div className='grid grid-cols-3 border-1 divide-x-1 divide-black border-black rounded-lg text-center mx-1 mb-5 cursor-pointer'>
                    <p className={'p-3' + (selectedOrder.orderStatus === OrderStatus.NEW ? " bg-yellow-300 rounded-l-lg font-semibold" : "")}
                        onClick={() => updateOrderStatus(selectedOrder.id, OrderStatus.NEW)}>{OrderStatusNew}</p>
                    <p className={'py-3' + (selectedOrder.orderStatus === OrderStatus.INPROGRESS ? " bg-yellow-300 font-semibold" : "")}
                        onClick={() => updateOrderStatus(selectedOrder.id, OrderStatus.INPROGRESS)}>{InProgress}</p>
                    <p className={'p-3' + (selectedOrder.orderStatus === OrderStatus.FINISHED ? " bg-yellow-300 rounded-r-lg font-semibold" : "")}
                        onClick={() => updateOrderStatus(selectedOrder.id, OrderStatus.FINISHED)}>{OrderStatusFinished}</p>
                </div>
                <div className='grid grid-cols-2 border-1 divide-x-1 divide-black border-black rounded-lg text-center mx-1'>
                    <p className={'p-3' + (Array.isArray(selectedOrder.payment) && selectedOrder.payment[0].paymentStatus === "paid" ? " bg-yellow-300 rounded-l-lg font-semibold" : "")}
                        >{Paid}</p>
                    <p className={'p-3' + (Array.isArray(selectedOrder.payment) && selectedOrder.payment[0].paymentStatus === "unpaid" ? " bg-yellow-300 rounded-r-lg font-semibold" : "")}
                        >{Unpaid}</p>
                </div>
                <ul className='absolute bottom-0 w-full'>
                    <div className=' bg-zinc-100 grid grid-cols-4 p-2 font-black'>
                        <p>{Product}</p>
                        <p>{Quantity_short}</p>
                        <p>{Price}</p>
                        <p>{Total}</p>
                    </div>
                    <div className='divide-y-1'>
                        {selectedOrder.products.map(product => (
                            <li key={product.id} className="grid grid-cols-4 p-2 mb-3">
                                <p>{product.productName}</p>
                                <p>{product.productQuantity}</p>
                                <p>{product.productPrice}</p>
                                <p>{product.productQuantity * product.productPrice}</p>

                            </li>
                        ))}
                    </div>
                    
                    <div className='grid grid-cols-4 p-2'>
                        <p className='font-semibold text-lg '>{Total}</p>
                        <p></p>
                        <p></p>
                        <p className= "font-semibold text-lg ">{selectedOrder.totalPrice}</p>
                    </div>

                </ul>
            </div>
        </>
    );

};

export default OrdersMenu;