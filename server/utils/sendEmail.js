import nodemailer from "nodemailer"

const sendEmail = async(subject, message, sent_to, sent_from, reply_to) => {
   
    // Transporter : a variable which will transport the mail
    // and it will do the authentication, request form the mail host
    const trasporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      })
    
    // options are the info about than .sendMail function needs
    const options = {
        from: sent_from,
        to: sent_to,
        replyTo: reply_to,
        subject: subject,
        html: message,
    }

    // .sendMail() is the used to send the mail at last
    await trasporter.sendMail(options, function(err, info){
        if(err){
            console.log(err);
        }
        else{
            console.log(info);
        }
    })
}

export default sendEmail