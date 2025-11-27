import z from "zod";

export const hallSchema = z.object({
    name: z.string().min(1, "Nom requis").trim(),
    capacity: z.number().min(1, "Capacité invalide"),
    type: z.enum(["standard", "vip", "imax", "3d"])
});

export const createRequestSchema = z.object({
    body: z.object({
        cinemaName: z.string().min(2, "Nom du cinéma requis").trim(),
        description: z.string().max(500).optional().default(""),

        address: z.string().min(2).trim(),
        city: z.string().min(2).trim(),
        wilaya: z.string().min(2).trim(),

        phone: z.string().min(1, "Téléphone requis"),
        email: z.string().email("Email invalide"),
        website: z.string().url().optional().or(z.literal("")),

        halls: z.array(hallSchema).min(1, "Ajoutez au moins une salle"),

        capacity: z.number().optional(),

        motivation: z
            .string()
            .min(10, "La motivation doit contenir au moins 10 caractères")
            .trim(),
    })
});
