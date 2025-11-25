import mongoose from 'mongoose';

const cinemaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    address: String,
    phone: String,
    halls: [String],
    isActive: {
        type: Boolean,
        default: true
    },
    photo: {
        type: String,
        default: null
    }
}, { timestamps: true });

export default mongoose.model('Cinema', cinemaSchema);