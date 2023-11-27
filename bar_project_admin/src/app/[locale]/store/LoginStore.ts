import {create} from "zustand"

type State = {
    name: string
    email: string
    password: string
}

type Action = {
    updateName: (name: State["name"]) => void
    updateEmail: (email: State["email"]) => void
    updatePassword: (password: State["password"]) => void
}

export const LoginStore = create<State & Action>((set) => ({
    name: "",
    email: "",
    password: "",
    updateName: (name) => set(()=>({name: name})),
    updateEmail: (email) => set(() => ({email: email})),
    updatePassword: (password) => set(() => ({password: password}))
}))