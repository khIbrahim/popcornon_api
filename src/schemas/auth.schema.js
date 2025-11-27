import z from "zod"

const loginSchema = z.object({
    body: z.object({
        email: z
            .email("Email must be valid")
            .trim()
            .toLowerCase(),
        password: z
            .string()
            .min(8, "Password must at least have 8 characters")
            .max(128, "Password must be at most 128 characters")
    })
})

const registerSchema = z.object({
    body: z.object({
        email: z
            .email("Email must be valid")
            .trim()
            .toLowerCase(),
        password: z
            .string()
            .min(8, "Password must at least have 8 characters")
            .max(128, "Password must be at most 128 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
            ),
        confirmPassword: z.string(),
        firstName: z
            .string()
            .min(2, "First name must have at least 2 letters")
            .max(50, "First name must have at most 50 letters")
            .trim()
            .transform((val) => val.charAt(0).toUpperCase() + val.slice(1)),
        lastName: z
            .string()
            .min(2, "Last name must have at least 2 letters")
            .max(50, "Last name must have at most 50 letters")
            .trim()
            .transform((val) => val.charAt(0).toUpperCase() + val.slice(1)),
        phone: z
            .string()
            .regex(/^[0-9]{10}$/, "Le numéro doit contenir exactement 10 chiffres")
            .optional(),
        acceptTerms: z
            .boolean()
            .refine((val) => val === true, {
                message: "You must accept the terms and conditions"
            })
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    })
})

const updateSchema = z.object({
    body: z.object({
        firstName: z
            .string()
            .min(2, "First name must have at least 2 letters")
            .max(50, "First name must have at most 50 letters")
            .trim()
            .transform((val) => val.charAt(0).toUpperCase() + val.slice(1))
            .optional(),
        lastName: z
            .string()
            .min(2, "Last name must have at least 2 letters")
            .max(50, "Last name must have at most 50 letters")
            .trim()
            .transform((val) => val.charAt(0).toUpperCase() + val.slice(1))
            .optional(),
        phone: z
            .string()
            .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
            .optional(),
    })
})

const updatePasswordSchema = z.object({
    body: z.object({
        currentPassword: z
            .string()
            .min(8, "Password must at least have 8 characters")
            .max(128, "Password must be at most 128 characters"),
        newPassword: z
            .string()
            .min(8, "Password must at least have 8 characters")
            .max(128, "Password must be at most 128 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
            ),
        confirmNewPassword: z.string()
    }).refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match",
    })
})

const resetPasswordSchema = z.object({
    params: z.object({
        token: z.string().min(1, "Token is required")
    }),
    body: z.object({
        newPassword: z
            .string()
            .min(8, "Password must at least have 8 characters")
            .max(128, "Password must be at most 128 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
            ),
        confirmNewPassword: z.string()
    }).refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match",
    })
})

export {registerSchema, loginSchema, updateSchema, updatePasswordSchema, resetPasswordSchema};