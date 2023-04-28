import nodemailer from 'nodemailer'
import cron from 'node-cron'

export async function autoMailer(hours,mins, Weekday){

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
    bcc: 'tobias.k.w.a@gmail.com, Danielkp1234@hotmail.com',
    subject: 'YoYo MonnerBoy!',
    text: 'Time for another monner!',
    html: 'Time for another monner! <img src="cid:monner"/>',
        attachments: [{
            filename: 'monner.jpeg',
            path: 'C:/Users/tkwa/OneDrive/Skrivebord/Lort/monner.jpeg',
            cid: 'monner' //same cid value as in the html img src
        }]  
    }



// Here we define a time for the mail to go out, right now it is set to every minut
// 0 mean at minut zero.
// 10 mean at 10 hours.
// * is an empty parameter.
// 1 is the day of the week, i.e. Monday. this is a function of cron.
cron.schedule(mins + ' ' + hours + ' * * '+ Weekday, () => { 
    console.log("cron hours"+hours);
    console.log("cron mins"+mins);  
    console.log("cron Weekday"+ JSON.stringify(Weekday));  
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {    
            console.log('Email sent: ' + info.response);
        }
    });
});
};