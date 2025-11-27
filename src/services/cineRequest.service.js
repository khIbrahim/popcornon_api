import CineRequest from "../models/cineRequest.model.js";
import User from "../models/user.model.js";
import { AppError } from "../utils/errors.js";
import cinemaService from "./cinema.service.js";

class CineRequestService {
    async create(userId, data) {
        const user = await User.findById(userId);
        if (user.role === "cine") {
            throw new AppError("Vous êtes déjà un gestionnaire de cinéma", 400);
        }

        const existing = await CineRequest.findOne({ user: userId, status: "pending" });
        if (existing) {
            throw new AppError("Vous avez déjà une demande en attente", 400);
        }

        return CineRequest.create({
            ...data,
            user: userId
        });
    }

    async getMyRequest(userId) {
        return CineRequest.findOne({ user: userId }).sort({ createdAt: -1 });
    }

    async hasSendRequest(userId) {
        const request = await CineRequest.findOne({ user: userId, status: "pending" });
        return !!request;
    }

    async getAll(status = null) {
        const query = status ? { status } : {};

        return CineRequest.find(query)
            .populate("user", "firstName lastName email")
            .sort({ createdAt: -1 });
    }

    async review(requestId, adminId, status, adminNote) {
        const request = await CineRequest.findById(requestId);
        if (! request) {
            throw new AppError("Demande non trouvée", 404);
        }

        if (request.status !== "pending") {
            throw new AppError("Cette demande a déjà été traitée", 400);
        }

        request.status     = status;
        request.reviewedBy = adminId;
        request.reviewedAt = new Date();
        request.adminNote  = adminNote;
        await request.save();

        if (status === "approved") {
            await User.findByIdAndUpdate(request.user, { role: "cine" });

            await cinemaService.create(request.user, {
                name: request.cinemaName,
                description: request.description,

                address: request.address,
                city: request.city,
                wilaya: request.wilaya,

                phone: request.phone,
                email: request.email,
                website: request.website,

                halls: request.halls,

                capacity: request.capacity,

                openingHours: undefined,

                motivation: request.motivation,
            });
        }

        return request;
    }
}

export default new CineRequestService();