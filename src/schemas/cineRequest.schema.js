import z from "zod";

export const createRequestSchema = z.object({
    body: z.object({
        cinemaName: z.string().min(2, "Nom du cinéma requis").trim(),
        address: z.string().optional(),
        phone: z.string(),
        email: z.string().email("Email invalide"),
        motivation: z.string().min(10, "La motivation doit contenir au moins 10 caractères").trim()
    })
});

export const reviewRequestSchema = z.object({
    params: z.object({
        id: z.string().min(1)
    }),
    body: z.object({
        status: z.enum(['approved', 'rejected']),
        adminNote: z.string().optional()
    })
});