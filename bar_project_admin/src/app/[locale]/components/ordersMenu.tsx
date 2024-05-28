"use client"
import React, { useEffect, useState } from 'react';
import { OrderInterface, OrderStatus } from '../interface/OrderInterface';
import { useRouter } from '@/navigation'
import { getOrdersAction } from '../actions/getOrdersAction';
import { OrdersStore } from '../store/OrderStore';



const OrdersMenu = () => {
    const router = useRouter();
    const storedJwtToken = typeof window !== 'undefined' ? localStorage.getItem("jwtToken") : null;
    const storedOrders = OrdersStore(state => state.orders);
    const updateStoredOrders = OrdersStore(state => state.updateOrders)
    const [newOrder, setNewOrder] = useState<OrderInterface>({
        id: 1,
        orderId: 1,
        creatAt: (new Date()).toJSON(),
        status: OrderStatus.NEW,
        items: [],
        totalPrice: 0
    });

    const createOrder = () => {
        setNewOrder({
            id: 1,
            orderId: newOrder.orderId + 1,
            creatAt: (new Date()).toJSON(),
            status: OrderStatus.NEW,
            items: [],
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



    return (
        <>
                {/* <button className='bg-rose-300' onClick={createOrder}>Create order</button> */}
            <div className="flex w-lvw h-28 bg-white shadow">
                    <ul className="flex-col relative justify-center p-5 mt-6 w-full">
                    <div className='flex absolute justify-center items-center h-8 bg-white rounded-2xl border-1 border-blue-400'>
                        <p className=' text-sm font-semibold ml-10  mx-2'>New Orders</p>
                    </div>
                    <div className=" flex absolute justify-center items-center w-8 h-8 bg-blue-400 rounded-2xl" >
                        <p className='font-bold text-white'>{storedOrders.filter(order => order.status === "new").length}</p>
                    </div>

                    {storedOrders.filter(order => order.status === "new").map((order) => (
                        <li key={order.id} className='first-of-type:mt-32 mb-5 bg-white shadow rounded-lg w-full flex relative'>
                            <div className='bg-blue-400 rounded-lg w-full'>
                                <div className='relative left-2 bg-white grid grid-cols-2 border-2 border-white rounded-lg p-2'>
                                    <p className='font-semibold'>Order ID: {order.id}</p>
                                    <p className='font-semibold ml-auto font-[`Work Sans`]'>{order.totalPrice}</p>
                                    <p className='text-sm'> {formatDateToShort(order.creatAt)}</p>
                                </div>
                            </div>
                        </li>
                    ))}

                    </ul>
                <ul className="flex-col relative justify-center pt-5 mt-6 w-full">
                    <div className='flex absolute justify-center items-center h-8 bg-white rounded-2xl border-1 border-orange-400'>
                        <p className=' text-sm font-semibold ml-10  mx-2'>In Progress</p>
                    </div>
                    <div className=" flex absolute justify-center items-center w-8 h-8 bg-orange-400 rounded-2xl" >
                        <p className='font-bold text-white'>{storedOrders.filter(order => order.status === "inProgress").length}</p>
                    </div>

                    {storedOrders.filter(order => order.status === "inProgress").map((order) => (
                        <li key={order.id} className='first-of-type:mt-32 mb-5 bg-white shadow rounded-lg w-full flex relative'>
                            <div className='bg-orange-400 rounded-lg w-full'>
                                <div className='relative left-2 bg-white grid grid-cols-2 border-2 border-white rounded-lg p-2'>
                                    <p className='font-semibold'>Order ID: {order.id}</p>
                                    <p className='font-semibold ml-auto font-[`Work Sans`]'>{order.totalPrice}</p>
                                    <p className='text-sm'> {formatDateToShort(order.creatAt)}</p>
                                </div>
                            </div>
                        </li>
                    ))}

                </ul>
                <ul className="flex-col relative justify-center p-5 mt-6 w-full">
                    <div className='flex absolute justify-center items-center h-8 bg-white rounded-2xl border-1 border-green-400'>
                        <p className=' text-sm font-semibold ml-10  mx-2'>Finished</p>
                    </div>
                    <div className=" flex absolute justify-center items-center w-8 h-8 bg-green-400 rounded-2xl" >
                        <p className='font-bold text-white'>{storedOrders.filter(order => order.status === "finished").length}</p>
                    </div>

                    {storedOrders.filter(order => order.status === "finished").map((order) => (
                        <li key={order.id} className='first-of-type:mt-32 mb-5 bg-white shadow rounded-lg w-full flex relative'>
                            <div className='bg-green-400 rounded-lg w-full '>
                                <div className='relative left-2 bg-white grid grid-cols-2 border-2 border-white rounded-lg p-2'>
                                    <p className='font-semibold'>Order ID: {order.id}</p>
                                    <p className='font-semibold ml-auto font-[`Work Sans`]'>{order.totalPrice}</p>
                                    <p className='text-sm'> {formatDateToShort(order.creatAt)}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                    
                        
                    
                
                
            </div>

        </>
    );
};

export default OrdersMenu;