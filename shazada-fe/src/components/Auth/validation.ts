import { TRegister } from "@/app/actions/auth";
import * as z from "zod";

export const AuthSchema = z.object({
  email: z.string().email({ message: "Invalid email format." }).nonempty(),
  password: z.string(),
});

export const RegisterSchema = z.object({
  full_name: z.string(),
  username: z.string().min(8, "Username minimum 8 characters."),
  email: z.string().email({ message: "Invalid email format." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number.",
    })
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
      message: "Password must contain at least one special character.",
    }),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number.",
    })
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
      message: "Password must contain at least one special character.",
    }),
});

export type AuthProps = z.infer<typeof AuthSchema>;
