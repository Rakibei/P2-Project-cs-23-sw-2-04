import nodemailer from 'nodemailer'
//import cron, { schedule } from 'node-cron'
import schedule from 'node-schedule';
import {GetAllSubmitStatus, GetEmailfromSubmitstaus} from '../database/databaseTimeSheet.js';
import {ConnectToDatabase} from '../database/databaseSetup.js';
const poolData = ConnectToDatabase();

export async function autoMailer(hours,mins,Weekday){

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


let mailOptions;


schedule.scheduleJob(mins + ' ' + hours + ' * * '+ Weekday, async () => {
let userIds = await GetAllSubmitStatus(poolData);
let emails = await GetEmailfromSubmitstaus(poolData,userIds);
console.log(emails);

mailOptions = {
    from: 'p2projectmail@gmail.com',
    bcc:  emails,
    subject: 'YoYo MonnerBoy!',
    text: 'Time for another monner!',
    html: 'Time for another monner! <img src="cid:monner"/>',
        attachments: [{
            filename: 'monner.jpeg',
            path: 'C:/Users/tkwa/OneDrive/Skrivebord/Lort/monner.jpeg',
            cid: 'monner' //same cid value as in the html img src
        }]  
    }


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