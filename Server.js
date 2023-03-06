const http = require('http');
const path = require('path');
const express = require('express');
const session = require('express-session');
const { stringify } = require('querystring');
const app = express();

app.listen(3000);
// Use session middleware before other middleware functions
app.use(session({
  secret: 'your secret here',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.static('public'));
app.use('/private', isAuthenticated, express.static(path.join(__dirname, 'private')));
app.use(express.json()); 
app.use(express.urlencoded()); 



app.use((req,res,next) => {
  console.log('Request received:', req.method, req.url);
  next();
});

app.get('/', checkIfAlreadyAuthenticated, (req,res) => {
  console.log("the cookie is " + req.session);
});



app.post('/', (req,res) => {
    console.log(req.body);
    if (comparepassword(req.body.username, req.body.password)) {
        console.log("Im here");
        req.session.isAuthenticated = true;
        req.session.save()
        console.log("the cookie is " + JSON.stringify(req.session));
        res.redirect('private/userpage.html')
    } else {
        // Handle failed authentication here...
    }
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
    // Redirect to login page or send error message
    res.code('/login');
  }
}

function checkIfAlreadyAuthenticated(req, res, next) {
  console.log("m");
  // Check if the user is authenticated (e.g., by checking for a session cookie)
  if (req.session.isAuthenticated) {
    res.redirect('private/userpage.html');
  } else {
    console.log("the user was not granted acces with this cookie " + JSON.stringify(req.session));
    res.sendFile(__dirname + '/index.html');
  }
}