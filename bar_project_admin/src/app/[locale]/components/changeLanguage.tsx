"use client"
import { usePathname } from "@/navigation"
import { Link } from "@/navigation"
export const ChangeLanguage = () => {
    const pathname = usePathname()
    return (
        <div className="flex justify-center">
            <div className="bg-white text-black">
                <button>
                    country flag
                </button>

                <input name="country" type="text"></input>
                <ul>
                    <Link href={pathname} locale="ua">
                        <li>UKR</li>
                    </Link>
                    <Link href={pathname} locale="ua">
                        <li>ENG</li>
                    </Link>
                </ul>
            </div>
            <Link href={pathname} locale="ua">UKR</Link>
            <Link href={pathname} locale="ua">ENG</Link>

        </div>
    )
}