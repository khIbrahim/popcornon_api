import z from "zod";

export const createMovieSchema = z.object({
    body: z.object({
        tmdbId: z. number(). int(). positive(),
        title: z.string().min(1),
        poster: z.string(). min(1).default(""),
        backdrop: z.string(). min(1).default(""),
        overview: z.string().min(1).default(""),
        runtime: z.number().min(1).default(0),
        genres: z.array(z.string()).default([]),
        voteAverage: z.number().min(0).max(10).default(0),
        releaseDate: z.string().min(1).default(""),

        // Séance MVP jrappelle
        price: z. number().min(0),
        date: z.string(),
        time: z.string(),
        hall: z.string(),
        status: z.enum(["active", "draft", "archived"]),
    })
});

export const updateMovieSchema = z.object({
    body: z.object({
        tmdbId: z. number(). int(). positive().optional(),
        title: z.string().min(1).optional(),
        poster: z.string(). min(1).optional(),
        backdrop: z.string(). min(1).optional(),
        overview: z.string().min(1).optional(),
        runtime: z.number().min(1).optional(),
        genres: z.array(z.string()).optional(),
        voteAverage: z.number().min(0).max(10).optional(),
        releaseDate: z.string().min(1).optional(),

        price: z.number().min(0).optional(),
        date: z.string().optional(),
        time: z.string().optional(),
        hall: z.string().optional(),
        status: z.enum(["active", "draft", "archived"]).optional(),
    }),
});