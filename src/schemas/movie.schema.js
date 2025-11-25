import z from "zod";

export const createMovieSchema = z.object({
    body: {
        tmdbId: z.number("Vous devez fournir l'ID TMDB"),
        title: z.string("Vous devez fournir le titre"),
        originalTitle: z.string().optional(),
        overview: z.string("Vous devez fournir le résumé du film"),
        poster: z.string("Vous devez fournir le chemin de l'affiche du film"),
        backdrop: z.string("Vous devez fournir le chemin de l'image de fond du film"),
        releaseDate: z.string("Vous devez fournir la date de sortie du film"),
        runtime: z.number("Vous devez fournir la durée du film en minutes"),
        genres: z.array(z.string()),
        voteAverage: z.number().min(0).max(5).optional(),

        basePrice: z.number().min(0).default(500),
        date: z.date("Vous devez fournir la date de la projection du film"),
        time: z.string(),
    }
})