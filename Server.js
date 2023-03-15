

// The servers parameters are set up so that it works with express
import http from 'http';
import { join } from 'path';
import express from 'express';

import {connectToDatabase, getUsers, getUser, createUser, comparePassword, createProject, getUserProjects,getUserIdWithName} from './database.js';

const { json } = express;
const { urlencoded } = express;
const { static: serveStatic } = express;
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
import session from 'express-session';
import { stringify } from 'querystring';
// The server is given the name app and calls from the express function
const app = express();

//The server listens on port 3000 localhost so the ip is 127.0.0.1:3000
app.listen(3000);


// Database connection
const poolData = await connectToDatabase();

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
  const comp = await comparePassword(poolData,req.body.username, req.body.password)
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

  let userID = await getUserIdWithName(poolData,req.session.userName);
  let userProjects = await getUserProjects(poolData,userID);



// The info is stored in session and is sent to the client
req.session.projects = userProjects;
req.session.userID = userID;
req.session.save();
res.json(req.session);



console.log("Data Sent")


});


// handle Admin functions

// This folder is only accelisble after the user is confirmed to be an admin
app.use('/admin', isAuthenticated, serveStatic(join(__dirname, 'admin')));

// Handle the admin page
app.get('/admin/admin.html', async (req, res) => {

});


// Handle the Admins requsts
app.post('/adminRequests', isAuthenticated, async (req, res) => {



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