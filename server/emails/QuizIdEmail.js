import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const QuizIdEmail = (email, id) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailConfigurations = {
    // It should be a string of sender/server email
    from: process.env.MAIL_USER,

    to: email,

    // Subject of Email
    subject: "You Have Created Quiz on Quizzer",

    // This would be the text of email body
    text: `Your quiz has been created successfully! 🎉  
Quiz ID: ${id}  
Thank you for using Quizzer.`,
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) throw Error(error);
    console.log("OTP Sent Successfully");
    console.log(info);
  });
};
