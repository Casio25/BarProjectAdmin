"use client"
import classNames from "classnames";
import React, { useState, useMemo } from "react";
import { UserErrorIcon } from "./svgs";
import { Link, useRouter, usePathname } from "@/navigation";
import { PromotionIcon, HomeIcon, MoneyIcon } from "./svgs";



const SideNavBar = () => {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path;
  
  return(
    <div className="flex w-72 h-screen bg-white drop-shadow-md">
      <ul className="text-lg flex-col font-semibold ">
        <Link href="/promotions">
          <li className={`flex mx-5 w-60 h-12 pt-2 rounded-lg ${isActive("/promotions") ? "bg-zinc-100" : "bg-white"}`}>
            <PromotionIcon/>
            <p className="ml-2">Promotions</p>
          </li>
        </Link>
        <Link href="/">
          <li className={`flex mx-5 w-60 h-12 pt-2 rounded-lg ${isActive("/") ? "bg-zinc-100" : "bg-white"}`}>
            <HomeIcon/>
            <p className="ml-2">Home</p>
          </li>
        </Link>
        <Link href="/payment_details">
          <li className={`flex mx-5 w-60 h-12 pt-2 rounded-lg ${isActive("/payment_details") ? "bg-zinc-100" : "bg-white"}`}>
            <MoneyIcon/>
            <p className="ml-2">Payment details</p>
          </li>
        </Link>
      </ul>
    </div>
  )
}

export default SideNavBar
