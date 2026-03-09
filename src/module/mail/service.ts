import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import hbs from "nodemailer-express-handlebars"
import { Account } from '@src/model/internal/account';

export type MailTemplate = 'magicLinkLogin';

export type SmtpConfig = {
    host: string;
    port: number;
    username: string;
    password: string;
}

export interface MailServiceConfig {
    from: string;
    smtp: SmtpConfig;
}

export type MagicLinkLoginMailContext = {
    loginLink: string;
}

export interface Mail {
    to: string;
    fromOverride?: string;
    subject: string;
    templateName: MailTemplate;
    context: Record<string, unknown>;
}

export class MailService {

    constructor(private readonly config: MailServiceConfig) {}

    async sendMagicLinkLoginMail(to: string, payload: MagicLinkLoginMailContext): Promise<void> {
        await this.sendMail({
            to: to,
            subject: '1909 - Login',
            templateName: 'magicLinkLogin',
            context: payload,
        })
    }

    private async sendMail(mail: Mail): Promise<void> {
        const transporter = this.createPooledTransporter();

        const messageInfo = await transporter.sendMail({
            from: this.config.from,
            to: mail.to,
            subject: mail.subject,
            template: mail.templateName,
            context: mail.context,
        } as any);
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