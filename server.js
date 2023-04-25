const host = 'localhost';
const port = 8080;
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser')

const express = require("express");
const app = express();
 
app.use(express.json());
app.use(bodyParser.json());

// app.use(function (request, response) {
//   response.sendFile(__dirname + "/www/index.html");
// });

app.get('/index', function (req, res) {
	res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

app.patch("/api/update", function (request, response) {

  var fileName = '/home/practice/test/test.json';
  var data = JSON.stringify(request.body);

  fs.writeFile(fileName, data, function (err) {
    if (err) {
      response.json({ "msg": "Update error" });
      console.error(err);
    }
    else {
      response.json({ "msg": "File updated" });
    }
  });

  
  //console.log(request.body);
  if(!request.body) return response.sendStatus(400);
  
  //response.json(request.body);
});
  

app.listen((port),()=>{
  console.log(`Server is running on http://${host}:${port}/index`);
});