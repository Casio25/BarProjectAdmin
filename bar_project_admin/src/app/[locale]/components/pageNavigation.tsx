// YourComponent.tsx
"use client"
import React from "react";
import { Link, usePathname } from "@/navigation";
import { PageNavigationInterface } from "../interface/PageNavigationInterface";
import { PageNavigationItem } from "../interface/PageNavigationInterface"; // Import the correct type

const PageNavigation: React.FC<PageNavigationInterface> = ({ items }) => {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path;
    return (
        <div className="flex flex-col w-lvw h-20 shadow-lg">
        <ul className="flex justify-center space-x-4 mt-6">
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {item.link ? (
                        <Link href={item.link} className={`${isActive(item.link) ? "text-violet-500" : "text-black"}`}>
                            <li className="text-center font-semibold">{item.label}</li>
                        </Link>
                    ) : (
                        <li>{item.label}</li>
                    )}
                </React.Fragment>
            ))}
        </ul>
        </div>
    );
};

export default PageNavigation;
