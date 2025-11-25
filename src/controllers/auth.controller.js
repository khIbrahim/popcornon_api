import catchAsync from "../utils/catchAsync.js";
import authService from "../services/auth.service.js";

class AuthController {
    register = catchAsync(async (req, res) => {
        const {email, password, firstName, lastName, phone} = req.body;

        const {user, token} = await authService.register({
            email,
            password,
            firstName,
            lastName,
            phone
        });

        this.sendTokenResponse(res, token, 201, {
            success: true,
            message: "Utilisateur enregistré avec succès",
            data: user
        })
    })

    login = catchAsync(async (req, res) => {
        const {email, password} = req.body;
        const ip = req.ip || req.headers['X-forwarded-for'] || req.connection.remoteAddress || '';

        const {user, token} = await authService.login(email, password, ip)

        this.sendTokenResponse(res, token, 201, {
            success: true,
            message: "Utilisateur connecté avec succès",
            data: user
        })
    })

    logout = catchAsync(async (req, res) => {
        res.cookie('jwt', 'loggedout', {
            expires: new Date(Date.now() + 10 * 1000), // 10 secondes
            httpOnly: true
        })

        res.status(200).json({
            success: true,
            message: "Utilisateur déconnecté avec succès",
        })
    })

    me = catchAsync(async (req, res) => {
        const user = req.user;

        return res.status(200).json({
            success: true,
            message: "Utilisateur récupéré avec succès",
            data: user
        })
    })

    update = catchAsync(async (req, res) => {
        const user = req.user;
        const {firstName, lastName, phone} = req.body;

        const updatedUser = await authService.update(user.id, {
            firstName,
            lastName,
            phone,
        })

        res.status(200).json({
            message: "Utilisateur mis à jour avec succès",
            data: updatedUser
        })
    })

    updatePassword = catchAsync(async (req, res) => {
        const user = req.user;
        const {currentPassword, newPassword} = req.body;

        await authService.updatePassword(user.id, currentPassword, newPassword);

        res.clearCookie('jwt');

        res.status(200).json({
            success: true,
            message: "Utilisateur mot de passe mis à jour avec succès. Veuillez vous reconnecter.",
        })
    })

    forgotPassword = catchAsync(async (req, res) => {
        const {email} = req.body;

        const result = await authService.forgotPassword(email, req.ip || req.headers['X-forwarded-for'] || req.connection.remoteAddress || 'N/A');

        res.status(200).json({
            success: true,
            message: result.message,
        });
    });

    resetPassword = catchAsync(async (req, res) => {
        const {token}       = req.params;
        const {newPassword, confirmNewPassword} = req.body;

        if (newPassword !== confirmNewPassword){
            return res.status(400).json({
                message: "Mot de passe et confirmation du mot de passe ne correspondent pas",
                success: false
            })
        }

        const result = await authService.resetPassword(token, newPassword);

        this.sendTokenResponse(res, result.token, 201, {
            success: true,
            message: result.message,
            data: result.user
        })
    })

    sendTokenResponse(res, token, statusCode, payload) {
        const cookieOptions = {
            expires: new Date(
                Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES || '7') * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
        }

        res.cookie('jwt', token, cookieOptions)

        res.status(statusCode).json({
            ...payload,
            token,
            success: true
        })
    }
}

export default new AuthController();