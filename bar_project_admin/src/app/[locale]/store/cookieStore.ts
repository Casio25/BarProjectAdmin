import { create } from "zustand"
type State = {
    cookiesStatus: boolean;
};

type Actions = {
    updateCookiesStatus: (status: boolean) => void;
};

const CookiesStore = create<State & Actions>((set) => {
    const storedCookiesStatus = localStorage.getItem('cookiesStatus');
    const initialCookiesStatus = storedCookiesStatus ? JSON.parse(storedCookiesStatus) : false;

    return {
        cookiesStatus: initialCookiesStatus,
        updateCookiesStatus: (status) => {
            set({ cookiesStatus: status });
            localStorage.setItem('cookiesStatus', JSON.stringify(status));
        },
    };
});

export default CookiesStore