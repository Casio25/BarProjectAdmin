"use client"
import { InputAdornment, TextField } from "@mui/material"
import { CreateVenueFormProps } from "../interface/CreateVenueInterface"
import { useState } from "react"
import { createVenueAction } from "../actions/createVenueAction"
import { useRouter } from "@/navigation"
import { VenueStore } from "../store/venueStore"
import { ICreateVenue } from "../interface/VenueInterface"

export const CreateVenueForm: React.FC<CreateVenueFormProps> = ({
    noVenueMessage,
    venueNamePlaceholder,
    CreateButton
}) => {
    const [venue, setVenue] = useState<ICreateVenue>({
        name: ""
    })
    const [venueError, setVenueError] = useState('')
    const updateStoredVenue = VenueStore(state => state.updateVenues)
    const router = useRouter()
    const validateData = async (venue: ICreateVenue) => {
        if (venue.name.length < 3 || venue.name.length > 8) {
            setVenueError('Venue name must be between 3 and 8 characters');
        } else {
            setVenueError('');
            const response = await createVenueAction(venue)
            console.log(response)
            if (response.error){
                setVenueError(response.error)
            }else{
                console.log(response)
                updateStoredVenue(response)
                router.push("/")
            }
        }

    }
    return (
        <form>
            <div className="w-full flex flex-col items-center max-w-md p-6 rounded-lg shadow-lg'">
                <h1 className="text-2xl font-bold text-slate-900">{noVenueMessage}</h1>
                <TextField
                    style={{ margin: '1rem 0', height: '2.5rem', width: '100%', }}
                    className="my-5 h-10 px-2 py-6 rounded-lg border border-slate-600 w-full"
                    placeholder={venueNamePlaceholder}
                    onChange={(e) => setVenue({
                        ...venue, name: e.target.value
                    })}

                />
                <p className="mt-4 text-red-600">{venueError}</p>
                <button type="button" onClick={() => validateData(venue)} className='w-[360px] h-12 px-6 py-4 bg-violet-900 active:bg-violet-700 rounded-3xl justify-center items-center gap-2 inline-flex'>
                    <p className="text-center text-white text-sm font-semibold font-['Work Sans'] leading-none">{CreateButton}</p>
                </button>
            </div>
        </form>
    )
}