import User from "../models/user.model.js";
import {AppError, NotFoundError, UnauthorizedError} from "../utils/errors.js";
import jwt from "jsonwebtoken";
import {sendMail} from "./mail.service.js";
import EmailTemplates from "../utils/emailTemplates.js";
import crypto from "crypto";

class AuthService {
    async register(userData) {
        const existingEmail = await User.findOne({email: userData.email});
        if (existingEmail) {
            throw new AppError("L'Email est déjà utilisé", 400);
        }

        const user = await User.create({
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone,
        });

        const token = this.generateToken(user._id);

        return {
            user: this.sanitizeUser(user),
            token
        }
    }

    async login(email, password, ip) {
        const user = await User.findByEmail(email);
        if(! user || ! (await user.correctPassword(password, user.password))){
            if(user) {
                await user.incLoginAttempts();
            }

            throw new UnauthorizedError("Email ou mot de passe incorrect")
        }

        if(user.isLocked){
            throw new AppError("Compte bloqué après multiple tentative de connexion échouées", 423)
        }

        await user.resetLoginAttempts();

        user.lastLoginAt = Date.now();
        user.lastLoginIP = ip;

        await user.save({validateBeforeSave: false});

        return {
            user: this.sanitizeUser(user),
            token: this.generateToken(user._id)
        }
    }

    async update(userId, updateData) {
        const user = await User.findById(userId);
        if(! user) {
            throw new NotFoundError("Utilisateur non trouvé")
        }

        if(updateData.firstName) {
            user.firstName = updateData.firstName;
        }
        if(updateData.lastName) {
            user.lastName = updateData.lastName;
        }
        if(updateData.phone) {
            user.phone = updateData.phone;
        }

        await user.save();

        return this.sanitizeUser(user);
    }

    async delete(userId) {
        try {
            await User.findOneAndDelete({_id: userId})

            return true;
        } catch (error) {
            console.log("Une erreur s'est produite lors de la suppression de l'utilisateur");

            return false;
        }
    }

    async updatePassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId).select('+password');
        if(! user) {
            throw new NotFoundError("Utilisateur non trouvé")
        }

        if(! await user.correctPassword(currentPassword, user.password)){
            throw new UnauthorizedError("Mot de passe actuel incorrect")
        }

        user.password = newPassword;
        user.passwordChangedAt = Date.now();
        user.updateOne({
            $unset: {
                passwordResetToken: "",
                passwordResetExpires: ""
            }
        })

        await user.save();
    }

    async forgotPassword(email, ipAddress = 'N/A') {
        const user = await User.findByEmail(email);
        if(! user) {
            return {
                message: "Instructiosn de réinitialisation du mot de passe envoyées à l'email si il existe"
            }
        }

        const resetToken = user.createPasswordResetToken();
        await user.save({validateBeforeSave: false});

        try {
            const resetURL = `${process.env.APP_URL}/api/v1/auth/reset-password/${resetToken}`;
            const html = await EmailTemplates.PasswordReset(user, resetURL, ipAddress);
            await sendMail({
                to: user.email,
                subject: "Password Reset Request",
                html: html
            });

            return {
                message: "Instructions de réinitialisation du mot de passe envoyées à l'email si il existe"
            }
        } catch(error) {
            user.passwordResetToken   = undefined;
            user.passwordResetExpires = undefined;
            await user.save({validateBeforeSave: false});

            throw new AppError("Une erreur est survenue lors de l'envoi de l'email. Veuillez réessayer plus tard.");
        }
    }

    async resetPassword(token, newPassword) {
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: {$gt: Date.now()}
        });

        if(! user){
            throw new AppError("Le lien de réinitialisation est invalide ou a expiré", 400);
        }

        user.password             = newPassword;
        user.passwordChangedAt    = Date.now();
        user.passwordResetToken   = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        const jwtToken = this.generateToken(user._id);

        return {
            message: "Le mot de passe a été réinitialisé avec succès",
            token: jwtToken,
            user: user
        }
    }

    generateToken(userId) {
        return jwt.sign(
            {id: userId},
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES || '7d'
            }
        )
    }

    sanitizeUser(user) {
        const userObject = user.toObject();

        delete userObject.password;
        delete userObject.passwordChangedAt;
        delete userObject.passwordResetToken;
        delete userObject.passwordResetExpires;
        delete userObject.emailVerificationToken;
        delete userObject.loginAttempts;
        delete userObject.lockUntil;
        delete userObject.__v;

        return userObject;
    }
}

export default new AuthService();