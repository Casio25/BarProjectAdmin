"use client"
import { usePathname } from "@/navigation"
import { useState } from "react";
import { Link } from "@/navigation"
import "/node_modules/flag-icons/css/flag-icons.min.css";
import LanguageIcon from '@mui/icons-material/Language';
import { ChangeLanguageProps } from "../interface/ChangeLanguageProps";
export const ChangeLanguage :React.FC<ChangeLanguageProps> = (color) => {
    const pathname = usePathname()
    const [languageOpacity, setLanguageOpacity] = useState(false)
    const ChangeOpacity = () => {
        setLanguageOpacity(!languageOpacity)
    }
    

    return (
        
        <div className="h-10 z-0 px-6 ml-auto">
            <button className="mt-3 scale-150 border-2 align-middle border-violet-500 flex rounded-lg active:ring-4 ml-auto "
            onClick={ChangeOpacity}>
                <LanguageIcon sx={{ color: color }} />
            </button>
            <div className={`absolute z-10 mt-16 align:center transition-all ${!languageOpacity
                ? 'opacity-0 -translate-y-3' 
                : 'active:opacity-100 translate-y-0'} ease-in-out right-0 mr-3`}>
                <ul className= "bg-white text-black shadow-xl hover:shadow-2xl rounded mb-2 p-2">
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