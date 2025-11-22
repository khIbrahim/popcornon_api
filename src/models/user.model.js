import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        select: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },

    isActive: {
        type: Boolean,
        default: true,
        select: false,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,

    loginAttempts: {
        type: Number,
        default: 0,
        select: false,
    },
    lockUntil: {
        type: Date,
        select: false,
    },

    role: {
        type: String,
        enum: ['user', 'admin', 'cine'],
        default: 'user'
    },
    lastLoginAt: Date,
    lastLoginIP: String
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ createdAt: -1 })

userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
})

userSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now())
})

userSchema.pre('save', async function (next) {
    if(! this.isModified('password')) {
        return next();
    }

    try {
        this.password = await bcrypt.hash(this.password, 12);

        if(! this.isNew){
            this.passwordChangedAt = Date.now() - 1000;
        }

        next();
    } catch(error) {
        next(error);
    }
})

userSchema.pre('/^find/', function(next) {
    this.find({ isActive: { $ne: true } });

    next();
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

userSchema.methods.hasActivePasswordResetToken = function () {
    return this.passwordResetToken && this.passwordResetExpires && Date.now() < this.passwordResetExpires;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // 10 minutes
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

userSchema.methods.incLoginAttempts = function() {
    if(this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 },
        });
    }

    const updates = { $inc: {loginAttempts: 1} }

    const maxAttempts = 5;
    const lockTime = 2 * 60 * 1000;

    if(this.loginAttempts + 1 >= maxAttempts && ! this.isLocked) {
        updates.$set = {lockUntil: Date.now() + lockTime}
    }

    return this.updateOne(updates);
}

userSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $set: { loginAttempts: 0 },
        $unset: { lockUntil: 1 }
    });
}

userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email }).select('+password +loginAttempts +lockUntil');
}

const User = mongoose.model('User', userSchema);
export default User;