import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.set("debug", true);

export async function connectDB() {
    try {
        const options = {
            serverSelectionTimeoutMS: process.env.MONGODB_REQUEST_TIMEOUT,
            socketTimeoutMS: process.env.MONGODB_REQUEST_TIMEOUT,
            maxPoolSize: process.env.MONGODB_MAX_POOL_SIZE,
            minPoolSize: process.env.MONGODB_MIN_POOL_SIZE,
            appName: process.env.MONGODB_APP_NAME,
        }

        const url = process.env.MONGODB_URI;

        await mongoose.connect(url, options);

        mongoose.connection.on("error", (err) => {
            console.log("Erreur de connexion MongoDB :", err);
        })

        mongoose.connection.on("disconnect", (err) => {
            console.log("MongoDB déconnecté :", err);
        })

        mongoose.connection.on("reconnected", () => {
            console.log("MongoDB reconnecté");
        })

        return mongoose;
    } catch(err) {
        console.error("Erreur de connexion MongoDB :", err);
        process.exit(1);
    }
}