"use client"
import { usePathname } from "@/navigation"
import { useState } from "react";
import { Link } from "@/navigation"
import "/node_modules/flag-icons/css/flag-icons.min.css";
import LanguageIcon from '@mui/icons-material/Language';
export const ChangeLanguage = () => {
    const pathname = usePathname()
    const [languageOpacity, setLanguageOpacity] = useState(false)
    const ChangeOpacity = () => {
        setLanguageOpacity(!languageOpacity)
    }

    return (
        <div className=" flex relative z-0">
            <button className="mx-6 border-2 align-middle border-violet-500 flex rounded-lg active:ring-4 "
            onClick={ChangeOpacity}>
               <LanguageIcon />
            </button>
            <div className={`absolute z-10 mt-16 align:center px-4 transition-all ${!languageOpacity
                ? 'opacity-0 -translate-y-3' 
                : 'active:opacity-100 translate-y-0'} ease-in-out bg-white text-black shadow-xl hover:shadow-2xl rounded mb-2`}>
                <ul >
                    <Link href={pathname} locale="ua">
                        <li>
                            <span className="fi fi-ua text-2xl"></span>
                            <p>UKR</p>
                        </li>
                    </Link>
                    <Link href={pathname} locale="en">
                        <li>
                            <span className="fi fi-gb text-xl"></span>
                            <p>ENG</p>
                        </li>
                    </Link>
                </ul>
            </div>

        </div>
    )
}