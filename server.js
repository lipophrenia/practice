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

  //var fileName = '/home/practice/practice/test/practice/test.json'; //home
  var fileName = '/home/practice/practice/test.json'; //practice
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

app.get('/api/net-save', function (req, res) {
	var fileName = path.resolve('/home/practice/practice/files/', 'ip.network'); // путь до файла ip.network
	fs.readFile(fileName, 'utf8', function (err, fileData) {
		if (err) {
			res.status(500).json({ "msg": "Something went wrong." });
			console.error(err);
		}
		else {
			var json = {
				"ip1": "",
				"ip2": "",
        "ip3": "",
				"gtw": ""
			};
			var arrStr = fileData.split(/\r\n|\r|\n/g);
			for (var i = 0; i < arrStr.length; i++) {
				arrStr[i].trim();
				if (arrStr[i][0] != '#') {
					if (arrStr[i].indexOf('Address') >= 0) {
						var arr = arrStr[i].split('=');
						if (json.ip1 == '') {
							json.ip1 = arr[1];
              console.log(arr[1]);
						}
						else {
							json.ip2 = arr[1];
              console.log(arr[1]);
						}
					}
					if (arrStr[i].indexOf('Gateway') >= 0) {
						var arr = arrStr[i].split('=');
						json.gtw = arr[1];
						break;
					}
				}
			}
			res.json(json);
		}
	});
});

app.listen((port),()=>{
  console.log(`Server is running on http://${host}:${port}/index`);
});