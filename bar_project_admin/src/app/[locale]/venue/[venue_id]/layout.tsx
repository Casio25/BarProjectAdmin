"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VenueStore } from "../../store/venueStore";
import { Providers } from "../../providers";
import Cookies from "../../components/cookies";
import { getVenueAction } from "../../actions/getVenueInfo";

export default function VenueLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: { venue_id: string };
}) {
    const { venue_id } = params;
    const router = useRouter();

    // Get venues from the store and the updater function
    const venues = VenueStore((state) => state.venues);
    const updateVenues = VenueStore((state) => state.updateVenues);

    // Fetch venues and update the store
    useEffect(() => {
        const fetchVenues = async () => {
            const response = await getVenueAction();
            updateVenues(response);
        };

        fetchVenues();
    }, [updateVenues]);

    // Redirect logic
    useEffect(() => {
        if (venues?.length > 0) {
            const venue = venues[0]; 
            if (!venue) {
                router.push("../../create_venue");
            } else if (venue.id !== Number(venue_id)) {
                router.push(`/venue/${venue.id}`);
            }
        }
    }, [venues, venue_id, router]);


    if (venues?.length === 0) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <header></header>
            <Providers>
                {children}
                <Cookies />
            </Providers>
        </div>
    );
}
