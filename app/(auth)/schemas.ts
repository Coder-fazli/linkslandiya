import { z } from "zod"

const passwordSchema = z.string()                                
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "At least one uppercase letter")               
    .regex(/[a-z]/, "At least one lowercase letter")               
    .regex(/[0-9]/, "At least one number")
    .regex(/[^A-Za-z0-9]/, "At least one special character") 


export const signInSchema = z.object({
   email: z.string().email(),
   password: z.string().min(1),
})

 export const signUpSchema = z.object({
    name: z.string().min(1, "Name is required"),                   
    email: z.string().email("Invalid email"),               
    password: passwordSchema,
    confirmPassword: z.string(),
  }).refine(data => data.password === data.confirmPassword, {      
    message: "Passwords do not match",
    path: ["confirmPassword"],                                     
  })     

  export { passwordSchema }
 
