import {custom, z} from "zod"
export const SignUpSchema = z.object({
    firstName: z.string().min(2).max(20),
    secondName: z.string().min(2).max(20),
    email: z.string().email(),
    password: z.string().min(8).max(20),
    confirmPassword: z.string().min(8).max(20)
}).superRefine(({confirmPassword, password}, ctx)=>{
    if(confirmPassword !== password){
        ctx.addIssue({
            code: "custom",
            message: "The passwords did not match"
        })
    }
})