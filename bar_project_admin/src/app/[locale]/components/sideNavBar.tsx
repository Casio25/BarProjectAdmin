"use client"
import classNames from "classnames";
import React, { useState, useMemo } from "react";
import { Link, useRouter, usePathname } from "@/navigation";
import { PromotionIcon, HomeIcon, MoneyIcon, SettingsIcon, ATBIcon, FAQIcon, FeedbackIcon, OrdersIcon, ProductsIcon } from "./svgs";
import { SideNavBarProps } from "../interface/SideNavBarInterface";
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { sideNavBarStore } from "../store/sideNavBarStore";
import { VenueStore } from "../store/venueStore";



const SideNavBar :React.FC<SideNavBarProps> = ({
  Promotions,
  Orders,
  Home,
  PaymentDetails,
  Products,
  FAQ,
  Settings,
  Feedback
}) => {
  const pathname = usePathname()
  // autoAnimate functionalirty
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */)

  const isActive = (path: string) => pathname.includes(path);
  const isActiveHome = (path: string) => pathname === path;
  const sideNavBarState = sideNavBarStore(state => state.open)
  const setSideNavBarState = sideNavBarStore(state => state.toggleOpen)
  const genericHamburgerLine = `h-1 w-6 my-1 rounded-full bg-black transition ease transform duration-300`;
  const activeVenue = VenueStore(state => state.activeVenue)
  console.log(activeVenue)
  
  
  return(
    <div  className={`flex flex-col flex-${sideNavBarState ? '4' : '2'} h-screen bg-white drop-shadow-md transition-all duration-300 ease-in-out`}>
      
      <button
        className="flex mx-5 mt-5 flex-col h-12 w-6  justify-center items-center group"
        onClick={() => setSideNavBarState(!sideNavBarState)}
      >
        <div
          className={`${genericHamburgerLine} ${sideNavBarState
              ? "rotate-45 translate-y-3 opacity-50 group-hover:opacity-100"
              : "opacity-50 group-hover:opacity-100"
            }`}
        />
        <div
          className={`${genericHamburgerLine} ${sideNavBarState ? "opacity-0" : "opacity-50 group-hover:opacity-100"
            }`}
        />
        <div
          className={`${genericHamburgerLine} ${sideNavBarState
              ? "-rotate-45 -translate-y-3 opacity-50 group-hover:opacity-100"
              : "opacity-50 group-hover:opacity-100"
            }`}
        />
      </button>
      
      <ul className="text-lg flex-col font-semibold overflow-hidden">
        <Link href={`/venue/${activeVenue?.id}/promotions`}>
            <li className={`flex mx-5 px-2 ${sideNavBarState ? "w-10" : "w-60"} h-12 pt-2 rounded-lg ${isActive("/promotions") ? "bg-zinc-100" : "bg-white"} `}>
            <PromotionIcon/>
            {sideNavBarState ? <></> : <p className="ml-2 ">{Promotions}</p>}
          </li>
          
        </Link>
        <Link href={`/venue/${activeVenue?.id}/orders`}>
            <li className={`flex mx-5 px-2 ${sideNavBarState ? "w-10" : "w-60"} h-12 pt-2 rounded-lg ${isActive("/orders") ? "bg-zinc-100" : "bg-white"} `}>
            <OrdersIcon />
            {sideNavBarState ? <></> : <p className="ml-2">{Orders}</p>}
          </li>
        </Link>
        <Link href={`/venue/${activeVenue?.id}/main`}>
            <li className={`flex mx-5 px-2 ${sideNavBarState ? "w-10" : "w-60"} h-12 pt-2 rounded-lg ${isActiveHome("/") ? "bg-zinc-100" : "bg-white"} `}>
            <HomeIcon/>
            {sideNavBarState ? <></> : <p className="ml-2">{Home}</p>}
          </li>
        </Link>
        <Link href='/payment_details'>
            <li className={`flex mx-5 px-2 ${sideNavBarState ? "w-10" : "w-60"} h-12 pt-2 rounded-lg ${isActive("/payment_details") ? "bg-zinc-100" : "bg-white"} `}>
            <MoneyIcon/>
            {sideNavBarState ? <></> :<p className="ml-2">{PaymentDetails}</p>}
          </li>
        </Link>
        <Link href={`/venue/${activeVenue?.id}/products`}>
            <li className={`flex mx-5 px-2 ${sideNavBarState ? "w-10" : "w-60"} h-12 pt-2 rounded-lg ${isActive("/products") ? "bg-zinc-100" : "bg-white"} `}>
            <ProductsIcon />
            {sideNavBarState ? <></> : <p ref={parent} className="ml-2">{Products}</p>}
          </li>
        </Link>
      </ul>
      <ul className="text-lg flex-col mt-auto font-semibold">
        <Link href="/faq">
            <li className={`flex mx-5 px-2 ${sideNavBarState ? "w-10" : "w-60"} h-12 pt-2 rounded-lg ${isActive("/faq") ? "bg-zinc-100" : "bg-white"} `}>
            <FAQIcon />
            {sideNavBarState ? <></> : <p className="ml-2">{FAQ}</p>}
          </li>
        </Link>
        <Link href="/settings">
            <li className={`flex mx-5 px-2 ${sideNavBarState ? "w-10" : "w-60"} h-12 pt-2 rounded-lg ${isActive("/settings") ? "bg-zinc-100" : "bg-white"} `}>
            <SettingsIcon />
            {sideNavBarState ? <></> : <p className="ml-2">{Settings}</p>}
          </li>
        </Link>
        <Link href="/feedback">
            <li className={`flex mx-5 px-2 ${sideNavBarState ? "w-10" : "w-60 "} h-12 pt-2 rounded-lg ${isActive("/feedback") ? "bg-zinc-100" : "bg-white"} `}>
            <FeedbackIcon />
            {sideNavBarState ? <></> :  <p className="ml-2"  >{Feedback}</p>}
          </li>
        </Link>
      </ul>
      </div>
  )
}

export default SideNavBar
