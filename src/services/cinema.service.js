import Cinema from '../models/cinema.model.js';

class CinemaService {
    async getByOwner(ownerId) {
        return Cinema.findOne({owner: ownerId})
    }

    async getById(cinemaId) {
        return Cinema.findById(cinemaId)
            .populate('owner', 'firstName lastName email');
    }

    async create(ownerId, data){
        const existing = await Cinema.findOne({owner: ownerId});
        if(existing){
            throw new AppError("Vous possédez déjà un cinéma associé à ce compte", 400);
        }

        return Cinema.create({...data, owner: ownerId});
    }

    async update(ownerId, data) {
        const cinema = await Cinema.findOneAndUpdate(
            {owner: ownerId},
            data,
            {new: true, runValidators: true}
        );

        if(! cinema) {
            throw new AppError("Cinéma non trouvé pour ce propriétaire", 404);
        }

        return cinema;
    }

    async delete(ownerId) {
        const cinema = await Cinema.findOneAndDelete({owner: ownerId})

        if(! cinema) {
            throw new AppError("Cinéma non trouvé pour ce propriétaire", 404);
        }

        return cinema;
    }

}

export default new CinemaService();