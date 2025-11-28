import Cinema from "../models/cinema.model.js";

class PublicCinemaService {
    async getAll({wilaya, city, q, page = 1, limit = 20, sort = "createdAt", order = "desc"}) {
        const filters = { status: "active" };

        if (wilaya) {
            filters.wilaya = wilaya;
        }
        if (city) {
            filters.city = new RegExp(city, "i");
        }
        if (q) {
            filters.$text = { $search: q };
        }

        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

        const sortFieldMap = {
            createdAt: "createdAt",
            name: "name",
            city: "city",
            wilaya: "wilaya",
        };
        const sortField = sortFieldMap[sort] || "createdAt";
        const sortOrder = order === "asc" ? 1 : -1;

        const [cinemas, total] = await Promise.all([
            Cinema.find(filters)
                .select(
                    "name description address city wilaya capacity halls openingHours socialLinks phone email website status stats location"
                )
                .sort({ [sortField]: sortOrder })
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum)
                .lean(),
            Cinema.countDocuments(filters),
        ]);

        return {
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
            data: cinemas
        };
    }
}

export default new PublicCinemaService();