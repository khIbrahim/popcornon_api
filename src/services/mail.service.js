import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
})

export async function sendMail({ to, subject, html }) {
    const mailOptions = {
        from: `PopcornOn 🍿 <${process.env.MAIL_FROM}>`,
        to,
        subject,
        html,
    };

    console.log('Sending email to:', to);
    await transporter.sendMail(mailOptions);
}