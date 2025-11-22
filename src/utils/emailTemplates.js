import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

class EmailTemplates {

    static async render(templateName, variables) {
        try {
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            const templatePath = path.join(
                __dirname,
                '../templates/email',
                `${templateName}.html`
            )

            let html = await fs.readFile(templatePath, 'utf8');

            Object.keys(variables).forEach((key) => {
                const regex = new RegExp(`{{${key}}}`, 'g');

                html = html.replace(regex, variables[key] || 'undefined');
            });

            return html;
        } catch (error) {
            throw new Error(`Error rendering email template: ${error.message}`);
        }
    }

    static async PasswordReset(user, resetUrl, ipAddress = 'N/A') {
        return this.render('passwordReset', {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            resetURL: resetUrl,
            requestDate: new Date().toLocaleString('fr-FR', {
                dateStyle: 'long',
                timeStyle: 'short',
            }),
            ipAddress,
            unsubscribeURL: `${process.env.CLIENT_URL}/unsubscribe`,
        });
    }

}

export default EmailTemplates;