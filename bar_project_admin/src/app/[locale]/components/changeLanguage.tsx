"use client"
import { usePathname } from "@/navigation"
import { Link } from "@/navigation"
export const ChangeLanguage = () => {
    const pathname = usePathname()
    return (
        <div>
            <Link href={pathname} locale="ua">UKR</Link>
            <Link href={pathname} locale="en">ENG</Link>
        </div>
    )
}