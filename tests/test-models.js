import dotenv from "dotenv";
import User from "../src/models/user.model.js";
import Cinema from "../src/models/cinema.model.js";
import Movie from "../src/models/movie.model.js";
import mongoose from "mongoose";

dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        let user = await User.findOne({role: 'cine'})
        if(! user){
            user = await User.create({
                email: "cinema@test.com",
                password: "Test1234!",
                firstName: "Test",
                lastName: "Cinema",
                role: "cine"
            });
            console.log("Utilisateur cine de test créé :", user);
        }

        console.log("Utilisateur cine de test :", user);

        let cinema = await Cinema.findOne({owner: user._id});
        if(! cinema){
            cinema = await Cinema.create({
                name: "Cinéma de Test",
                address: "123 Rue de Test, Testville",
                owner: user._id,
                phone: "0123456789",
                halls: ["Salle 1", "Salle 2", "Salle 3"]
            });
            console.log("Cinéma de test créé :", cinema);
        }

        console.log("Cinéma de test :", cinema);

        const movie = await Movie.create({
            cinema: cinema._id,
            tmdbId: 872585,
            title: "Oppenheimer",
            posterPath: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
            rating: 8.1,
            genres: ["Drame", "Historique"],
            runtime: 181,
            price: 800,
            date: "2025-11-26",
            time: "19:00",
            hall: "Salle 1",
            status: "active"
        });
        console.log("Film de test créé :", movie);

        const movieWithCinema = await Movie.findById(movie._id).populate({
            path: 'cinema',
            populate: {
                path: 'owner',
                select: 'firstName lastName email'
            }
        });

        console.log("Film avec relations: ");
        console.log(" Titre du film :", movieWithCinema.title);
        console.log(" Cinéma :", movieWithCinema.cinema.name);
        console.log(" Propriétaire du cinéma :", movieWithCinema.cinema.owner.firstName, movieWithCinema.cinema.owner.lastName, "-", movieWithCinema.cinema.owner.email);

        console.log("Test terminé avec succès.");
    } catch (error) {
        console.error("Erreur lors du test des modèles :", error);
    } finally {
        await mongoose.disconnect();
    }
}

test();