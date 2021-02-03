import * as nodemailer from "nodemailer";
import config from './config';

class Mail {

    constructor(
        public to?: any,
        public subject?: string,
        public message?: string) { }


    sendMail(): any {
        let mailOptions = {
            from: config.user,
            to: this.to,
            subject: this.subject,
            html: this.message
        };

        const transporter = nodemailer.createTransport({
            host: config.host,
            port: 587,
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: config.user,
                pass: config.password
            },
            tls:{
                rejectUnauthorized:false
            }
        });

        console.log(mailOptions);

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return error;
            } else {
                return "E-mail sended successful! " + info;
            }
        });
    }
}

export default new Mail();