import nodemailer from 'nodemailer'
import cron from 'node-cron'

export async function autoMailer(){

//If you need to access the email account, the username is p2projectmail@gmail.com.
//The password is "vorespassword".

// the "host" mail
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'p2projectmail@gmail.com', //NB. we will most likely have to add this 'app' to the google account.
        pass: 'vqcdbdfyzsjdazwo', //App-key generated på gmail.
    }
});

// E-mail content
const mailOptions = {
    from: 'p2projectmail@gmail.com',
    to: 'nikolajfagejensen@gmail.com, , tobias.k.w.a@gmail.com',
    subject: 'Yo Boy!',
    text: 'SUBMIT YOU BASTARD!'
};

// Here we define a time for the mail to go out, right now it is set to every minut
// 0 mean at minut zero.
// 10 mean at 10 hours.
// * is an empty parameter.
// 1 is the day of the week, i.e. Monday. this is a function of cron.
cron.schedule('0 10 * * 1', () => {   
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
});
};