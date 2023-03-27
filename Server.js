

// The servers parameters are set up so that it works with express
import http from 'http';
import { join } from 'path';
import express from 'express';

import {ConnectToDatabase, GetUsers, GetUser, CreateUser,GetmanagerProjects, ComparePassword, CreateProject, GetUserProjects,GetUserIdWithName,GetUserLevel, SetUserLevel,GetProjects,CreateUserManagerLink,CreateUserProjectLink,GetProjectIdWithName, GetProject} from './database.js';
import {CreatePDF} from './pdf/pdfTest.js'
import {ConvertJsonToExcel} from './xlsx/xlsxTest.js'
import path from 'node:path'

const { json } = express;
const { urlencoded } = express;
const { static: serveStatic } = express;
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
import session from 'express-session';
import { stringify } from 'querystring';
//import { autoMailer } from './e-mail_notification/mail.js';

// The server is given the name app and calls from the express function
const app = express();

//The server listens on port 3000 localhost so the ip is 127.0.0.1:3000
app.listen(3000);


// Database connection
const poolData = ConnectToDatabase();

// Use session to set up cookies middleware before other middleware functions
app.use(session({
  secret: 'your secret here',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

//The servers private folder is static and is only able to be used after the isAuthenticated function has confirmed the user
app.use('/private', isAuthenticated, serveStatic(join(__dirname, 'private')));

//This middleware allows the server to parse data sent in JSON and html forms format
app.use(json()); 
app.use(urlencoded()); 


// This middleware is to log all requsts sent to the server and log what methond they used and what they want.
app.use((req,res,next) => {
  console.log('Request received:', req.method, req.url);
  next();
});

// This get middleware is for when the server is called just on the url
app.get('/', (req,res) => {
  // The server logs the users cookie
  console.log("the cookie is ", req.session);

// We check if the user has accesed the site before 
  if(req.session.isAuthenticated == true){
    // If they are authenticated then redirect them to the next site
    res.redirect('/private/homepage.html')
  } else{
    // If not send them to the login page
    res.redirect('index.html')
  }
});
// we now say that the client can acces the public folder otherwise the client dosent send a get requst
app.use(serveStatic ('public'));



// When the server recives a post requst to the server directly
app.post('/', async (req,res) => {
  // The contents are printed
  const comp = await ComparePassword(poolData,req.body.username, req.body.password)
    console.log(req.body);
    if (comp) {
      // If the user is authenticated then the server redirects them and saves their cookie to show that they are
        console.log(req.body.username + " is here");
        req.session.isAuthenticated = true;
        req.session.userName = req.body.username
        req.session.save()
        res.redirect('/private/homepage.html');
    } else {
        // Handle failed authentication here...  
    }
});

// for when the user needs their userdata on the next page
app.get('/sesionData',async(req,res)=>{

  let userID = await GetUserIdWithName(poolData,req.session.userName);
  let userProjects = await GetUserProjects(poolData,userID);

// The info is stored in session and is sent to the client
req.session.projects = userProjects;
req.session.userID = userID;
req.session.save();
res.json(req.session);

console.log("Data Sent")

});



// handle the manager function

app.use('/manager', isAuthenticated, serveStatic(join(__dirname, 'manager')));



//Maneger skal kunne se brugere under sig og hvilke projekter der er under sig



app.post('/managerRequests', isAuthenticated, async (req, res) => {
console.log(req.body);
if (req.body.function == "LinkUsers"){
  let managerID = await GetUserIdWithName(poolData,req.body.managerToLink);
  let userID = await GetUserIdWithName(poolData,req.body.userToLink);
  let projectID = await GetProjectIdWithName(poolData,req.body.projectToLink)
  let newLinkData = await CreateUserManagerLink(poolData,userID,managerID,projectID);
  console.log(newLinkData);}
});

app.get('/managerRequests', isAuthenticated, async (req, res) => {
  console.log("Someone wants projects");


  // Se hvad deres ID er
  // Få alle projetor
  let managerID = await GetUserIdWithName(poolData, req.session.userName);
  let managerProjects = await GetmanagerProjects(poolData,managerID);
  console.log(managerProjects);
  res.send(managerProjects);
});






// Get a list of all projects that the manager is linked too

// let req.session.userName














// handle Admin functions

// This folder is only accelisble after the user is confirmed to be an admin
app.use('/admin', isAuthenticated, serveStatic(join(__dirname, 'admin')));


// Handle the Admins requsts
app.post('/adminRequests', isAuthenticated, async (req, res) => {

  console.log(req.body);
  if (req.body.functionName == "CreateUser"){
    let CreateUserData = await CreateUser(poolData,req.body.createUsername,req.body.createPassword, 0);
    console.log(CreateUserData);
  }

  if (req.body.functionName == "CreateProject"){
    let CreateProjectData = await CreateProject(poolData,req.body.projectName, req.body.projectStartDate, req.body.projectEndDate, req.body.projectHoursSpent);
    console.log(CreateProjectData);
  }
  
  if (req.body.functionName == "seeUserLevel"){
    let userID = await GetUserIdWithName(poolData,req.body.seeUserLevel);
    let seeUserLevelData = await GetUserLevel(poolData,userID);
    console.log(seeUserLevelData);
    res.json(seeUserLevelData);
  }

  if (req.body.functionName == "setUserLevel"){
    let userID = await GetUserIdWithName(poolData,req.body.setUserLevelName);
    console.log(userID);

    let seeUserNewLevelData = await SetUserLevel(poolData,userID,parseInt(req.body.setUserLevelValue));
    console.log(seeUserNewLevelData);
  }


  if (req.body.functionName == "CreateUserProjectLink"){
    let managerID = await GetUserIdWithName(poolData,req.body.createManager);
    let projectID = await GetProjectIdWithName(poolData,req.body.projectToLink)

    let newLinkData = await CreateUserProjectLink(poolData,managerID,projectID,1);
    console.log(newLinkData);
  }
  
  if (req.body.functionName == "ExportPDF"){
    let userID = req.session.userName;
    GetProjects(poolData).then(projects =>{
    CreatePDF(userID,projects).then(pdfPath =>{
      console.log(pdfPath);
      res.download(pdfPath)
    })})
  }
  if (req.body.functionName == "ExportExcel") {
    let userID = req.session.userName;
    GetProjects(poolData).then(projects =>{
      JSON.stringify(projects)
      ConvertJsonToExcel(projects,userID).then(xlsxPath =>{
        console.log(xlsxPath);
        res.download(xlsxPath)
      })
    })
  }
});




// Handle 404 errors
app.use((req,res) => {
  res.status(404).send('404 error page does not exist');
});

function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    next();
  } else {
    // send error message
    res.status(401).send('Acces not granted');
  }
}



