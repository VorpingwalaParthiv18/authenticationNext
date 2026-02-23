import { email, z } from "zod";

const passwordValidator = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must be at least one Uppercase letter")
  .regex(/[a-z]/, "Password must be at least one Lowercase letter")
  .regex(/[0-9]/, "Password must be at least one Number")
  .regex(/[@$!%*?&]/, "Password must be at least one Special character");

export const validatorSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters long"),
  password: passwordValidator,
  role: z.enum(["superadmin", "admin", "user"], {
    message: "Role must be either SuperAdmin, Admin, or User",
  }),
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
});
