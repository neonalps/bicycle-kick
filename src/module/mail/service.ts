import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import hbs from "nodemailer-express-handlebars"

export type SmtpConfig = {
    host: string;
    port: number;
    username: string;
    password: string;
}

export interface MailServiceConfig {
    smtp: SmtpConfig;
}

export interface Mail {

}

export class MailService {

    constructor(private readonly config: MailServiceConfig) {}

    async sendMail(mail: Mail): Promise<void> {
        const transporter = this.createPooledTransporter();

        const messageInfo = await transporter.sendMail({
            from: "no-reply@neonalps.at",
            to: "michael.stifter1@gmail.com",
            subject: "Welcome",
            template: "welcome",
            context: {
                name: "Michael"
            }
        } as any);

        console.log('message info', messageInfo);
    }

    private createPooledTransporter() {
        const transporter = nodemailer.createTransport({
            ...this.createSmtpTransport(this.config.smtp),
            pool: true,
            
        });

        transporter.use(
            "compile",
            hbs({
                viewEngine: {
                    extname: ".hbs",
                    layoutsDir: "src/mail/",
                    defaultLayout: false
                },
                viewPath: "src/mail/",
                extName: ".hbs"
            })
        );

        return transporter;
    }

    private createSmtpTransport(config: SmtpConfig): SMTPTransport.Options {
        return {
            host: config.host,
            port: config.port,
            auth: {
                user: config.username,
                pass: config.password,
            }
        }
    }

}