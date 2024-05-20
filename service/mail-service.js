const nodemailer = require('nodemailer');

class MailService {
    constructor () {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT, 10),
            secure: false,
            auth: {
                user: process.env.YA_USER,
                pass: process.env.YA_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.YA_USER,
            to,
            subject: `Активация аккаунта на сайте ${process.env.CLIENT_URL}`,
            text: 'Для активации перейдите по ссылке: ' + link,
            html: `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
                </div>
            `
        })
    }
}

module.exports = new MailService();