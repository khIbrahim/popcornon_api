import Cinema from '../models/cinema.model.js';
import { AppError } from '../utils/errors.js';
import authService from "./auth.service.js";
import User from "../models/user.model.js";
import CineRequest from "../models/cineRequest.model.js";
import mediaService from "./media.service.js";

class CinemaService {

    async getByOwner(ownerId) {
        return Cinema.findOne({ owner: ownerId });
    }

    async getById(cinemaId) {
        const cinema = await Cinema. findById(cinemaId)
            .populate('owner', 'firstName lastName email');

        if (! cinema) {
            throw new AppError("Cinéma non trouvé", 404);
        }

        return cinema;
    }

    async getAll(filters = {}) {
        const query = { status: 'active' };

        if (filters.wilaya) {
            query.wilaya = filters.wilaya;
        }
        if (filters.city) {
            query.city = new RegExp(filters. city, 'i');
        }

        return Cinema.find(query)
            .select('name city wilaya photo capacity halls status')
            .sort({ createdAt: -1 });
    }

    async search(term) {
        return Cinema.find({
            status: 'active',
            $text: { $search: term }
        }).select('name city wilaya photo').limit(10);
    }

    async create(ownerId, data) {
        const existing = await Cinema. findOne({ owner: ownerId });
        if (existing) {
            throw new AppError("Vous possédez déjà un cinéma associé à ce compte", 400);
        }

        return Cinema.create({
            ...data,
            owner: ownerId,
            status: 'pending'
        });
    }

    async update(ownerId, data) {
        const cinema = await Cinema. findOneAndUpdate(
            { owner: ownerId },
            { $set: data },
            { new: true, runValidators: true }
        );

        if (! cinema) {
            throw new AppError("Cinéma non trouvé", 404);
        }

        return cinema;
    }

    async updateById(cinemaId, data) {
        const cinema = await Cinema.findByIdAndUpdate(
            cinemaId,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (! cinema) {
            throw new AppError("Cinéma non trouvé", 404);
        }

        return cinema;
    }

    async updateHalls(ownerId, halls) {
        const cinema = await Cinema. findOne({ owner: ownerId });
        if (! cinema) {
            throw new AppError("Cinéma non trouvé", 404);
        }

        console.log("putting : ", halls);
        cinema.halls = [];
        cinema.halls.push(...halls);
        cinema.markModified("halls");
        await cinema.save();

        console.log("updated cinema halls:", cinema.halls);

        return cinema;
    }

    async updateHours(ownerId, openingHours) {
        const cinema = await Cinema.findOneAndUpdate(
            { owner: ownerId },
            { $set: { openingHours } },
            { new: true }
        );

        if (! cinema) {
            throw new AppError("Cinéma non trouvé", 404);
        }

        return cinema;
    }

    async updateStatus(ownerId, status) {
        const cinema = await Cinema.findOneAndUpdate(
            { owner: ownerId },
            { status },
            { new: true }
        );

        if (! cinema) {
            throw new AppError("Cinéma non trouvé", 404);
        }

        return cinema;
    }

    async delete(ownerId) {
        const cinema = await Cinema.findOneAndDelete({ owner: ownerId });

        if (! cinema) {
            throw new AppError("Cinéma non trouvé", 404);
        }

        console.log("deleting cine request for user : ", ownerId);
        console.log("cine request exists ? : ", await CineRequest.exists({ user: ownerId }));
        await User.findByIdAndUpdate(ownerId, { role: 'user' });
        await CineRequest.findOneAndDelete({ user: ownerId });

        return cinema;
    }

    async deleteById(cinemaId) {
        const cinema = await Cinema.findByIdAndDelete(cinemaId);

        if (! cinema) {
            throw new AppError("Cinéma non trouvé", 404);
        }

        return cinema;
    }


    async incrementStat(ownerId, stat, value = 1) {
        const update = {};
        update[`stats.${stat}`] = value;

        return Cinema.findOneAndUpdate(
            { owner: ownerId },
            { $inc: update },
            { new: true }
        );
    }

    async getStats(ownerId) {
        const cinema = await Cinema.findOne({ owner: ownerId })
            .select('stats halls capacity');

        if (! cinema) {
            throw new AppError("Cinéma non trouvé", 404);
        }

        return {
            ...cinema. stats. toObject(),
            totalHalls: cinema.halls.length,
            totalCapacity: cinema.capacity,
        };
    }

    async exists(ownerId) {
        const count = await Cinema.countDocuments({ owner: ownerId });
        return count > 0;
    }

    async isOwner(cinemaId, userId) {
        const cinema = await Cinema.findById(cinemaId). select('owner');
        return cinema && cinema.owner. toString() === userId. toString();
    }

    async updateLocation(cinemaId, location) {
        const cinema = await Cinema.findByIdAndUpdate(
            cinemaId,
            { location },
            { new: true }
        );

        if (! cinema) {
            throw new AppError("Cinéma non trouvé", 404);
        }

        return cinema;
    }

    async updateImage(_id, {photo, cover}) {
        console.log(photo, cover);
    }
}

export default new CinemaService();