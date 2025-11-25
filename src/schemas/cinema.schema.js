import z from 'zod';

export const createCinemaSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(2, "Nom du cinema requis")
            .trim(),
        address: z
            .string()
            .optional(),
        phone: z
            .string()
            .optional(),
        halls: z
            .array(z.string())
            .optional(),
        isActive: z
            .boolean()
            .optional()
    })
});

export const updateCinemaSchema = z.object({
    body: z.object({
        name: z.string().min(2).trim().optional(),
        city: z.string().min(2).trim().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        halls: z.array(z.string()).optional(),
        isActive: z.boolean().optional()
    })
})