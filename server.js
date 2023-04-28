const host = "localhost";
const port = 8080;
const fs = require("fs");
const os = require('node:os');
const path = require("path");
const bodyParser = require("body-parser");
var path_to_config = 'video.conf';

const express = require("express");
const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.use("/static", express.static(__dirname + "/www/static"));

app.get("/index", function (req, res) {
  res.sendFile(path.join(__dirname, "www", "index.html"));
});

//получение конфигурации сети
app.get('/api/net-get', function (req, res) {
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
				"gate": ""
			};
			var arrStr = fileData.split(/\r\n|\r|\n/g);
			for (var i = 0; i < arrStr.length; i++) {
				arrStr[i].trim();
				if (arrStr[i][0] != '#') {
					if (arrStr[i].indexOf('Address') >= 0) {
						var arr = arrStr[i].split('=');
						if (json.ip1 == '') {
							json.ip1 = arr[1];
						}
						else if (json.ip2 == '') {
							json.ip2 = arr[1];
						}
						else {
							json.ip3 = arr[1];
						}
					}
					if (arrStr[i].indexOf('Gateway') >= 0) {
						var arr = arrStr[i].split('=');
						json.gate = arr[1];
						break;
					}
				}
			}
			res.json(json);
		}
	});
});

//сохранение конфигурации сети
app.patch('/api/net-save', function (req, res) {
	if (req.body.hasOwnProperty('ip1') && req.body.hasOwnProperty('ip2') && req.body.hasOwnProperty('ip3') && req.body.hasOwnProperty('gate')) {
		var fileName = path.resolve('/home/practice/practice/files/', 'ip.network'); // путь до файла ip.network
		fs.readFile(fileName, 'utf8', function (err, fileData) {
			if (err) {
				res.status(500).json({ "msg": "Something went wrong." });
				console.error(err);
			}
			else {
				addrCounter = 0;
				var arrStr = fileData.split(/\r\n|\r|\n/g);
				for (var i = 0; i < arrStr.length; i++) {
					arrStr[i].trim();
					if (arrStr[i][0] != '#') {
						if (arrStr[i].indexOf('Address') >= 0) {
							var arr = arrStr[i].split('=');
							if (addrCounter == 0) {
								arr[1] = req.body.ip1;
								addrCounter++;
							}
							else if (addrCounter == 1) {
								arr[1] = req.body.ip2;
								addrCounter++;
							}
							else {
								arr[1] = req.body.ip3;
							}
							arrStr[i] = arr.join('=');
						}
						if (arrStr[i].indexOf('Gateway') >= 0) {
							var arr = arrStr[i].split('=');
							arr[1] = req.body.gate;
							arrStr[i] = arr.join('=');
							break;
						}
					}
				}
				var str = arrStr.join(os.EOL);
				fs.writeFile(fileName, str, function (err) {
					if (err) {
						res.status(500).json({ "msg": "Update error" });
						console.error(err);
					}
					else {
						res.json({ "msg": "File updated" });
					}
				});
			}
		});
	}
	else {
		res.status(409).json({ "msg": "Wrong parameters." });
	}
});

//сохранение конфига
app.patch('/api/conf-save', function (req, res) {
	var fileJson = path.join('/home/practice/practice/files/', path_to_config); // папка, в которой лежат файлы video.config
	var dataJson = JSON.stringify(req.body, null, 4);
	// console.log(dataJson);
	fs.writeFile(fileJson, dataJson, function (err) {
		if (err) {
			res.status(500).json({ "msg": "Update error" });
			console.error(err);
		}
		else {
			res.json({ "msg": "Upload completed." });
		}

	})
});

app.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}/index`);
});
