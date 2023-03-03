const http = require('http');
const { json } = require('stream/consumers');
const port = 3000;

const server = http.createServer((req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Content-Type', 'application/json');


  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      console.log(body);
      res.end(JSON.stringify("Req suc"));
    });
  } else {
    res.end(JSON.stringify("Req suc"));
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});