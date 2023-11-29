import {custom, z} from "zod"
const isEmailLike = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
};
export const SignUpSchema = z.object({
    firstName: z.string().min(2).max(20),
    secondName: z.string().min(2).max(20),
    email: z.string().email(),
    password: z.string().min(8).max(20),
    confirmPassword: z.string().min(8).max(20)
}).superRefine(({confirmPassword, password, firstName, secondName}, ctx)=>{
    if(confirmPassword !== password){
        ctx.addIssue({
            code: "custom",
            message: "The passwords did not match"
        })
    }
    if (isEmailLike(firstName)) {
        ctx.addIssue({
            code: "custom",
            path: ["firstName"],
            message: "First name cannot look like an email address"
        });
    }

    if (isEmailLike(secondName)) {
        ctx.addIssue({
            code: "custom",
            path: ["secondName"],
            message: "Second name cannot look like an email address"
        });
    }
})