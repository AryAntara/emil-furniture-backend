import { SMTPClient } from "emailjs"
import { logger } from "../log";

export class Email {
    private user: string = process.env.EMAIL_USER ?? "ary";
    private password: string = process.env.EMAIL_PASSWORD ?? "password";
    private host: string = process.env.EMAIL_HOST ?? "http://localhost";
    private ssl: boolean = process.env.EMAIL_SSL === 'true' ?? false;
    private smtpClient: SMTPClient;

    private from: string = process.env.EMAIL_OWNER ?? "EMIL <ikomangaryantara382@gmail.com>";

    /**
     * @param to Person that you wanna send your email "Clint <client-emil@g.com>"
     */
    constructor(
        private to: string
    ) {
        this.smtpClient = new SMTPClient({
            user: this.user,
            password: this.password,
            host: this.host,
            ssl: this.ssl
        })
    }

    /**
     * 
     * @param from who is send the email, is can be yours "You <emil@g.com>"
     */
    setFrom(from: string) {
        this.from = from;
        return this;
    }

    /**
     * Send the email from html file
     */
    sendHTML(
        subject: string,
        HTMLcontent: string
    ) {
        const message = {
            text: 'i hope this works',
            from: this.from,
            to: this.to,
            subject: subject,
            attachment: [
                { data: HTMLcontent, alternative: true },
            ],
        }
        
        this.smtpClient.send(message, function(error, message){
            if(error) return logger.error(error) 

            logger.info(message)
        });
    
    }


}