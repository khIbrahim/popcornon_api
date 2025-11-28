import z from 'zod';

const hallSchema = z.object({
    name: z.string().min(1, "Nom de salle requis").trim(),
    capacity: z.number().min(1, "Capacité minimum 1"),
    type: z.enum(["standard", "vip", "imax", "3d"]). default("standard"),
});

const dayHoursSchema = z.object({
    open: z.string(). default("14:00"),
    close: z.string().default("23:00"),
    closed: z. boolean().default(false),
});

const socialLinksSchema = z.object({
    facebook: z.string().url().optional(). or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url(). optional().or(z.literal("")),
});

const openingHoursSchema = z.object({
    monday: dayHoursSchema. optional(),
    tuesday: dayHoursSchema.optional(),
    wednesday: dayHoursSchema.optional(),
    thursday: dayHoursSchema.optional(),
    friday: dayHoursSchema.optional(),
    saturday: dayHoursSchema. optional(),
    sunday: dayHoursSchema.optional(),
});

export const createCinemaSchema = z. object({
    body: z.object({
        name: z
            .string()
            .min(2, "Nom du cinéma requis (min 2 caractères)")
            .max(100)
            .trim(),
        description: z
            . string()
            . max(500, "Description max 500 caractères")
            .optional(),

        address: z
            .string()
            .min(5, "Adresse requise")
            . trim(),
        city: z
            .string()
            .min(2, "Ville requise")
            .trim(),
        wilaya: z
            .string()
            .min(2, "Wilaya requise")
            . trim(),

        phone: z
            .string()
            .min(9, "Numéro de téléphone invalide")
            . optional(),
        email: z
            .string()
            .email("Email invalide")
            .optional(),
        website: z
            .string()
            .url("URL invalide")
            .optional()
            .or(z. literal("")),

        socialLinks: socialLinksSchema.optional(),

        halls: z
            .array(hallSchema)
            . min(1, "Au moins une salle requise")
            . optional(),

        photo: z. string().optional(). nullable(),
        coverPhoto: z.string(). optional().nullable(),

        openingHours: openingHoursSchema. optional(),

        amenities: z
            .array(z.string())
            .optional(),

        status: z
            .enum(["active", "pending", "suspended"])
            .optional(),
    })
});

export const updateCinemaSchema = z.object({
    body: z. object({
        name: z
            .string()
            .min(2)
            .max(100)
            . trim()
            .optional(),
        description: z
            .string()
            .max(500)
            . optional(),

        address: z. string().trim().optional(),
        city: z.string().trim().optional(),
        wilaya: z.string().trim().optional(),

        phone: z.string(). optional(),
        email: z.string(). email().optional(),
        website: z.string().url().optional().or(z.literal("")),

        socialLinks: socialLinksSchema.optional(),

        halls: z.array(hallSchema).optional(),

        photo: z.string().optional().nullable(),
        coverPhoto: z. string().optional().nullable(),

        openingHours: openingHoursSchema.optional(),

        amenities: z.array(z.string()).optional(),

        status: z
            .enum(["active", "pending", "suspended"])
            .optional(),
    })
});

export const updateHoursSchema = z.object({
    body: openingHoursSchema,
});

export const updateHallsSchema = z.object({
    body: z. object({
        halls: z.array(hallSchema).min(1, "Au moins une salle requise"),
    })
});

export const updateLocationSchema = z.object({
    body: z.object({
        location: z.object({
            type: z.literal('Point'),
            coordinates: z.array(z.number()).length(2)
        })
    })
});