import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sentOtpMail=(email,otp)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailConfigurations = {

        // It should be a string of sender/server email
        from: process.env.MAIL_USER,

        to: email,

        // Subject of Email
        subject: 'OTP to Register on Quiz App',
        
        // This would be the text of email body
        text: `Your OTP for Registration on Quiz App is: ${otp}. It is valid for 10 minutes.thanks for using our service!.we are glad to have you on board!`
    };

    transporter.sendMail(mailConfigurations, function(error, info){
        if (error) throw Error(error);
        console.log('OTP Sent Successfully');
        console.log(info);
    });
}
