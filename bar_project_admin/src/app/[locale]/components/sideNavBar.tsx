"use client"
import classNames from "classnames";
import React, { useState, useMemo } from "react";
import { Link, useRouter, usePathname } from "@/navigation";
import { PromotionIcon, HomeIcon, MoneyIcon, SettingsIcon, ATBIcon, FAQIcon, FeedbackIcon, OrdersIcon, ProductsIcon } from "./svgs";
import { SideNavBarProps } from "../interface/SideNavBarInterface";



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

  const isActive = (path: string) => pathname.includes(path);
  const isActiveHome = (path: string) => pathname === path;
  
  return(
    <div className="flex flex-col w-72 h-screen bg-white drop-shadow-md">
      <ATBIcon/>
      <ul className="text-lg flex-col font-semibold ">
        <Link href="/promotions">
          <li className={`flex mx-5 w-60 h-12 pt-2 rounded-lg ${isActive("/promotions") ? "bg-zinc-100" : "bg-white"}`}>
            <PromotionIcon/>
            <p className="ml-2">{Promotions}</p>
          </li>
        </Link>
        <Link href="/orders">
          <li className={`flex mx-5 w-60 h-12 pt-2 rounded-lg ${isActive("/orders") ? "bg-zinc-100" : "bg-white"}`}>
            <OrdersIcon />
            <p className="ml-2">{Orders}</p>
          </li>
        </Link>
        <Link href="/">
          <li className={`flex mx-5 w-60 h-12 pt-2 rounded-lg ${isActiveHome("/") ? "bg-zinc-100" : "bg-white"}`}>
            <HomeIcon/>
            <p className="ml-2">{Home}</p>
          </li>
        </Link>
        <Link href="/payment_details">
          <li className={`flex mx-5 w-60 h-12 pt-2 rounded-lg ${isActive("/payment_details") ? "bg-zinc-100" : "bg-white"}`}>
            <MoneyIcon/>
            <p className="ml-2">{PaymentDetails}</p>
          </li>
        </Link>
        <Link href="/products">
          <li className={`flex mx-5 w-60 h-12 pt-2 rounded-lg ${isActive("/products") ? "bg-zinc-100" : "bg-white"}`}>
            <ProductsIcon />
            <p className="ml-2">{Products}</p>
          </li>
        </Link>
      </ul>
      <ul className="text-lg flex-col mt-auto font-semibold">
        <Link href="/faq">
          <li className={`flex mx-5 w-60 h-12 pt-2 rounded-lg ${isActive("/faq") ? "bg-zinc-100" : "bg-white"}`}>
            <FAQIcon />
            <p className="ml-2">{FAQ}</p>
          </li>
        </Link>
        <Link href="/settings">
          <li className={`flex mx-5 w-60 h-12 pt-2 rounded-lg ${isActive("/settings") ? "bg-zinc-100" : "bg-white"}`}>
            <SettingsIcon />
            <p className="ml-2">{Settings}</p>
          </li>
        </Link>
        <Link href="/feedback">
          <li className={`flex mx-5 w-60 h-12 pt-2 rounded-lg ${isActive("/feedback") ? "bg-zinc-100" : "bg-white"}`}>
            <FeedbackIcon />
            <p className="ml-2">{Feedback}</p>
          </li>
        </Link>
      </ul>
    </div>
  )
}

export default SideNavBar
