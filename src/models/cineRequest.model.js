import mongoose from "mongoose";

const hallSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        capacity: { type: Number, required: true, min: 1 },
        type: {
            type: String,
            enum: ["standard", "vip", "imax", "3d"],
            default: "standard",
        },
    },
    { _id: false }
);

const cineRequestSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        cinemaName: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            maxlength: 500,
            default: "",
        },

        address: {
            type: String,
            required: true,
            trim: true,
        },

        city: {
            type: String,
            required: true,
            trim: true,
        },

        wilaya: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            default: "",
        },

        email: {
            type: String,
            lowercase: true,
            trim: true,
            default: "",
        },

        website: {
            type: String,
            default: "",
        },

        halls: {
            type: [hallSchema],
            default: [],
        },

        capacity: {
            type: Number,
            default: 0,
        },

        motivation: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            index: true,
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        reviewedAt: Date,
        adminNote: String,
    },
    { timestamps: true }
);

cineRequestSchema.pre("save", function (next) {
    if (this.halls && this.halls.length > 0) {
        this.capacity = this.halls.reduce(
            (sum, hall) => sum + hall.capacity,
            0
        );
    }
    next();
});

cineRequestSchema.index({ user: 1, status: 1 });

const CineRequest = mongoose.model("CineRequest", cineRequestSchema);
export default CineRequest;