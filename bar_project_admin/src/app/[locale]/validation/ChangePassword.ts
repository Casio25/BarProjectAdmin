import { z } from "zod"
export const ChangePasswordSchema = z.object({
    password: z.string().min(8).max(20),
    confirmPassword: z.string().min(8).max(20)
}).superRefine(({ confirmPassword, password }, ctx) => {

    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "The passwords did not match"
        })
    }
   
})