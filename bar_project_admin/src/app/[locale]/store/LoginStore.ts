import { Password } from "@mui/icons-material"
import {create} from "zustand"

type State = {
    name: string
    email: string
    password: string
    emailError: string
    passwordError: string
}

type Action = {
    updateName: (name: State["name"]) => void
    updateEmail: (email: State["email"]) => void
    updatePassword: (password: State["password"]) => void
    updateEmailError: (emailError: State["emailError"]) => void
    updatePasswordError: (passwordError: State["passwordError"]) => void
}

export const LoginStore = create<State & Action>((set) => ({
    name: "",
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
    updateName: (name) => set(()=>({name: name})),
    updateEmail: (email) => set(() => ({email: email})),
    updatePassword: (password) => set(() => ({password: password})),
    updateEmailError: (emailError) => set(() => ({emailError: emailError})),
    updatePasswordError: (passwordError) => set(() => ({passwordError: passwordError}))
}))