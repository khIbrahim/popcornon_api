import mongoose from "mongoose";

const cineRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    cinemaName: {
        type: String,
        required: true,
        trim: true
    },
    address: String,
    phone: String,
    email: String,
    motivation: String,

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        index: true
    },

    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedAt: Date,
    adminNote: String

}, { timestamps: true });

cineRequestSchema.index({ user: 1, status: 1 });

export default mongoose.model('CineRequest', cineRequestSchema);