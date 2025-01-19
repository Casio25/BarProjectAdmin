
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VenueStore } from "../../store/venueStore";
import { Providers } from "../../providers";
import Cookies from "../../components/cookies";
import { getVenueAction } from "../../actions/getVenueInfo";

export default async function Layout({
    children,
    params: { venueId, locale },
}: React.PropsWithChildren<{ params: { venueId: string; locale: string } }>) {
    console.log("venueId", venueId);
    console.log("locale", locale);
    return (
                    <Providers>
                        {children}
                        <Cookies />
                    </Providers>
    );
}
