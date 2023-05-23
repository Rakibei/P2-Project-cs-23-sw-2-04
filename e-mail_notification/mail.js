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
    subject: 'Missing timesheet submission',
    text: 'You are recieveing this email because you have not yet submitted your timesheet.\n Please remember to do this before the deadline.'
    
    }
 
transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {    
        console.log('Email sent: ' + info.response);
    }
});
});

};