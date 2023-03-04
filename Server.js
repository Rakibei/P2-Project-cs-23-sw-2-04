const http = require('http');
const express = require('express');
const { stringify } = require('querystring');
const app = express();

app.listen(3000);
app.use(express.static('public'));
app.use(express.json()); 
app.use(express.urlencoded()); 




app.get('/',(req,res) =>{

res.sendFile(__dirname + '/index.html')

}
);


app.post('/', (req, res) => {
  console.log(req.body);
  if (comparepassword(req.body.username, req.body.password) == true) {
    res.redirect('/userpage.html')
    console.log("im done");
  }
});



function comparepassword(username, password){
console.log(username + password);


  if(username == "Daniel" && password == "Lolmand"){
    return true;
  }
}