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

app.use('/private', isAuthenticated, express.static(path.join(__dirname, 'private')));
app.use(express.json()); 
app.use(express.urlencoded()); 



app.use((req,res,next) => {
  console.log('Request received:', req.method, req.url);
  next();
});

app.get('/', (req,res) => {

  // asks if the user has been here before
  // if they have send them to the site
  // if not continue
  console.log("the cookie is ", req.session);


  if(req.session.isAuthenticated == true){

    res.redirect('/private/userpage.html')
  } else{
    res.redirect('index.html')
  }

});

app.use(express.static('public'));


app.post('/', (req,res) => {
    console.log(req.body);
    if (comparepassword(req.body.username, req.body.password)) {
        console.log("Im here");
        req.session.isAuthenticated = true;
        req.session.save()
        res.redirect('/private/userpage.html');
    } else {
        // Handle failed authentication here...
    }
});



app.get('/private/userpage.html',(req,res)=>{
/*
User object
User id Name Password Email
Time block object
Time block id Start time End time Project id User id
Project object
Project id Name Start date End date Mere???
User assigned project object
assigned id Project id User id Start date End date

*/

console.log("Hello")


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
    res.status(401).send('Acces not granted');
  }
}



