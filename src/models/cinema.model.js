import mongoose from 'mongoose';

const hallSchema = new mongoose. Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    capacity: {
        type: Number,
        required: true,
        min: 1,
    },
    type: {
        type: String,
        enum: ['standard', 'vip', 'imax', '3d'],
        default: 'standard',
    },
}, { _id: false });

const dayHoursSchema = new mongoose.Schema({
    open: {
        type: String,
        default: "14:00",
    },
    close: {
        type: String,
        default: "23:00",
    },
    closed: {
        type: Boolean,
        default: false,
    },
}, { _id: false });

const socialLinksSchema = new mongoose.Schema({
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    twitter: { type: String, default: "" },
}, { _id: false });

const cinemaSchema = new mongoose.Schema({
    owner: {
        type: mongoose. Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },

    name: {
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

    socialLinks: {
        type: socialLinksSchema,
        default: () => ({}),
    },

    capacity: {
        type: Number,
        default: 0,
    },

    halls: {
        type: [hallSchema],
        default: [],
    },

    openingHours: {
        monday: { type: dayHoursSchema, default: () => ({ open: "14:00", close: "23:00", closed: false }) },
        tuesday: { type: dayHoursSchema, default: () => ({ open: "14:00", close: "23:00", closed: false }) },
        wednesday: { type: dayHoursSchema, default: () => ({ open: "14:00", close: "23:00", closed: false }) },
        thursday: { type: dayHoursSchema, default: () => ({ open: "14:00", close: "23:00", closed: false }) },
        friday: { type: dayHoursSchema, default: () => ({ open: "14:00", close: "00:00", closed: false }) },
        saturday: { type: dayHoursSchema, default: () => ({ open: "10:00", close: "00:00", closed: false }) },
        sunday: { type: dayHoursSchema, default: () => ({ open: "10:00", close: "23:00", closed: false }) },
    },

    status: {
        type: String,
        enum: ['active', 'pending', 'suspended'],
        default: 'pending',
    },

    stats: {
        totalMovies: { type: Number, default: 0 },
        totalScreenings: { type: Number, default: 0 },
        totalViews: { type: Number, default: 0 },
    },

}, { timestamps: true });

cinemaSchema.pre('save', function(next) {
    if (this.halls && this.halls.length > 0) {
        this.capacity = this.halls. reduce((sum, hall) => sum + hall.capacity, 0);
    }
    next();
});

cinemaSchema.index({ name: 'text', city: 'text', wilaya: 'text' });
cinemaSchema.index({ wilaya: 1, status: 1 });

export default mongoose. model('Cinema', cinemaSchema);