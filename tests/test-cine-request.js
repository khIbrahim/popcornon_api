import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/user.model.js";
import CineRequest from "../src/models/cineRequest.model.js";

dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // 1. Créer un user normal
        let user = await User.findOne({ email: "demandeur@test.com" });
        if (!user) {
            user = await User.create({
                email: "demandeur@test.com",
                password: "Test1234!",
                firstName: "Ahmed",
                lastName: "Benali",
                role: "user"
            });
            console.log("✅ User créé:", user.email);
        }

        const request = await CineRequest.create({
            user: user._id,
            cinemaName: "Cinéma AFDSHFDHU",
            city: "Oran",
            address: "Boulevard de ORAN",
            phone: "0555123456",
            motivation: "Je gère ce cinéma depuis 5 ans"
        });
        console.log("Demande créée:", request.cinemaName, "- Status:", request.status);

        const requestWithUser = await CineRequest.findById(request._id)
            .populate('user', 'firstName lastName email');

        console.log("\nDemande complète:");
        console.log("  Demandeur:", requestWithUser.user.fullName);
        console.log("  Cinéma:", requestWithUser.cinemaName);
        console.log("  Ville:", requestWithUser.city);
        console.log("  Status:", requestWithUser.status);

        console.log("\nTest réussi !");

    } catch (err) {
        console.error("Erreur:", err.message);
    } finally {
        await mongoose.disconnect();
    }
};

test();