import { useTranslations } from 'next-intl';
import { ChangeLanguage } from '../components/changeLanguage';
import { Create } from '@mui/icons-material';
import { CreateVenueForm } from '../components/createVenueForm';

const CreateVenuePage = () => {
    const t = useTranslations("CreateVenue")
    return (
        <div className='flex flex-col bg-violet-900'>
            <ChangeLanguage color="white" />
            <div className="min-h-screen flex flex-col items-center justify-center bg-violet-900">
                <div className='w-full flex flex-col items-center max-w-md p-6 bg-white rounded-xl shadow-xl'>
                    <CreateVenueForm
                    noVenueMessage={t("NoVenueMessage")}
                    venueNamePlaceholder={t("VenueNamePalceholder")}
                    Cancel={t("Cancel")}
                    CreateButton={t("Create")}
                    />                    
                </div>
            </div>
        </div>
    )
}
export default CreateVenuePage