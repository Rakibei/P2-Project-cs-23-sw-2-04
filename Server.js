

// The servers parameters are set up so that it works with express
import http from 'http';
import { join } from 'path';
import express from 'express';
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
    res.redirect('/private/userpage.html')
  } else{
    // If not send them to the login page
    res.redirect('index.html')
  }
});
// we now say that the client can acces the public folder otherwise the client dosent send a get requst
app.use(serveStatic ('public'));



// When the server recives a post requst to the server directly
app.post('/', (req,res) => {
  // The contents are printed
    console.log(req.body);
    if (comparepassword(req.body.username, req.body.password)) {
      // If the user is authenticated then the server redirects them and saves their cookie to show that they are
        console.log(req.body.username + " is here");
        req.session.isAuthenticated = true;
        req.session.save()
        res.redirect('/private/userpage.html?');
    } else {
        // Handle failed authentication here...
    }
});


// for when the user needs their userdata on the next page
app.get('/sesionData',(req,res)=>{


// Example data
let user ={
  id:"1234",
  Name:"Daniel", 
  Password:"Lolmand",
  Email:"Lol@das.dk",
}
let Timeblock ={
  id:12351,
  StartTime:12.21,
  EndTime:22.22,
  ProjectID:123,
  UserIDs:[1234,23321] ,
}

let project1 ={
  projectID:12351,
  name:"Project1",
  startDate:19.02,
  EndDate:20.12,
  UserIDs:[1234,23321] ,
}
let project2 ={
  projectID:12351,
  name:"Project2",
  startDate:19.02,
  EndDate:20.12,
  UserIDs:[1234,23321] ,
}
let project3 ={
  projectID:12351,
  name:"Project3",
  startDate:19.02,
  EndDate:20.12,
  UserIDs:[1234,23321] ,
}


// The info is stored in session and is sent to the client
req.session.user = user;
req.session.Timeblock = Timeblock;
req.session.projects =[project1,project2,project3];
req.session.save();
res.json(req.session);



console.log("Data Sent")


});






function comparepassword(username,password){
    return username === "Daniel" && password === "Lolmand";
}

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



