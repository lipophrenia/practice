var http = require('http'); // Чтобы использовать HTTP-интерфейсы в Node.js
var fs = require('fs'); // Для взаимодействия с файловой системой
var path = require('path'); // Для работы с путями файлов и каталогов
var express = require('express');
var bodyParser = require('body-parser');
const ini = require('ini');
var os = require('os');
var exec = require('child_process').exec;
var execFile = require('child_process').execFile;
var selectedCam = '';

var app = express(); // создаем express-приложение
var path_to_config;
app.use(express.json());
var rootfsPath = "";

app.use(express.static(path.join('/etc/'))); // путь до папки, в которой лежат файлы

app.use(bodyParser.json());




app.get('/', function (req, res) {
	fs.readFile(path.resolve(__dirname, 'www', 'index.html'), 'utf8', function (err, data) {
		if (err) {
			res.status(500).send('');
			console.error(err);
		}
		else {
			var json_file;
			var type_of_cam; // переменная, в которой содержится тип камеры
			var filePath = path.join('/proc/device-tree/model'); // место, где лежит файл model

			function parseStr(str) {
				var result = "";
				function isCharNumber(char) {
					return char >= '0' && char <= '9';
				}
				function isLetter(char) {
					return ((char >= 'A' && char <= 'Z') ||
						(char >= 'a' && char <= 'z'));
				}

				for (var char of str)
					if (isCharNumber(char) || isLetter(char))
						result += char;

				console.log(result);
				return result;
			}

			fs.readFile(filePath, 'ascii', function (err, Modeldata) { // чтение файла model
				if (err)
					throw err;
				type_of_cam = Modeldata;
				type_of_cam = parseStr(Modeldata);
				console.log('Model: ' + type_of_cam);
				var filePath = path.join(__dirname, 'configsPath'); // переменная, в котором прописываются пути, до video.config
				fs.readFile(filePath, function (err, data) {   // чтение файла configsPath
					json_file = JSON.parse(data);
					path_to_config = json_file[type_of_cam];
					console.log("path is " + path_to_config);
				});
			}
			);
			res.send(data)
		}
	});
});


// выполнение консольных команд
app.post('/btnConf', function (req, res) {
	console.log(req.body["strUser"]);

	switch (req.body["strUser"]) {
		case "sony ev7520":
			selectedCam = 'OES1';
			fs.writeFileSync("selectedCam.txt", selectedCam);
			execFile('./switch.sh', ['OES1'], { shell: '/bin/bash' }, (err, stdout, stderr) => {
				if (err) {
					// ошибка
					console.error(err)
				} else {
					// весь стандартный вывод и стандартный поток (буферизованный)
					console.log(stdout);
					console.log(stderr);
					res.send(stdout);
				}
			});
			break;
		case "sony ev2700 + Noxant":
			selectedCam = 'OES2';
			fs.writeFileSync("selectedCam.txt", selectedCam);
			execFile('./switch.sh', ['OES2'], { shell: '/bin/bash' }, (err, stdout, stderr) => {
				if (err) {
					//ошибка
					console.error(err)
				} else {
					// весь стандартный вывод и стандартный поток (буферизованный)
					console.log(stdout);
					console.log(stderr);
					res.send(stdout);
				}
			});
			break;
		case "sony ev2700 + la6110":
			selectedCam = 'OES3';
			fs.writeFileSync("selectedCam.txt", selectedCam);
			execFile('./switch.sh', ['OES3'], { shell: '/bin/bash' }, (err, stdout, stderr) => {
				if (err) {
					//ошибка
					console.error(err)
				} else {
					// весь стандартный вывод и стандартный поток (буферизованный)
					console.log(stdout);
					console.log(stderr);
					res.send(stdout);
				}
			});
			break;
		case "sony ev7520 + tfm 1024":
			selectedCam = 'OES4';
			fs.writeFileSync("selectedCam.txt", selectedCam);
			execFile('./switch.sh', ['OES4'], { shell: '/bin/bash' }, (err, stdout, stderr) => {
				if (err) {
					//ошибка
					console.error(err)
				} else {
					//весь стандартный вывод и стандартный поток (буферизованный)
					console.log(stdout);
					console.log(stderr);
					res.send(stdout);
				}
			});
			break;
		case "tfm mx640":
			selectedCam = 'OES5';
			fs.writeFileSync("selectedCam.txt", selectedCam);
			execFile('./switch.sh', ['OES5'], { shell: '/bin/bash' }, (err, stdout, stderr) => {
				if (err) {
					//ошибка
					console.error(err)
				} else {
					// весь стандартный вывод и стандартный поток (буферизованный)
					console.log(stdout);
					console.log(stderr);
					res.send(stdout);
				}
			});
			break;
		case "savgood sg2090":
			selectedCam = 'OES6';
			fs.writeFileSync("selectedCam.txt", selectedCam);
			execFile('./switch.sh', ['OES6'], { shell: '/bin/bash' }, (err, stdout, stderr) => {
				if (err) {
					//ошибка
					console.error(err)
				} else {
					// весь стандартный вывод и стандартный поток (буферизованный)
					console.log(stdout);
					console.log(stderr);
					res.send(stdout);
				}
			});
			break;
		case "sony ev7520 + nit275":
			selectedCam = 'OES7';
			fs.writeFileSync("selectedCam.txt", selectedCam);
			execFile('./switch.sh', ['OES7'], { shell: '/bin/bash' }, (err, stdout, stderr) => {
				if (err) {
					//ошибка
					console.error(err)
				} else {
					// весь стандартный вывод и стандартный поток (буферизованный)
					console.log(stdout);
					console.log(stderr);
					res.send(stdout); 
				}
			});
			break;
		case "sony ev7520 + Xcore Micro III":
			selectedCam = 'OES8';
			fs.writeFileSync("selectedCam.txt", selectedCam);
			execFile('./switch.sh', ['OES8'], { shell: '/bin/bash' }, (err, stdout, stderr) => {
				if (err) {
					//ошибка
					console.error(err)
				} else {
					// весь стандартный вывод и стандартный поток (буферизованный)
					console.log(stdout);
					console.log(stderr);
					res.send(stdout);
				}
			});
			break;
		// case "Sony ev7520 + nit275":
		// 	execFile('./switch.sh', ['OES9'], { shell: '/bin/bash' }, (err, stdout, stderr) => {
		// 		if (err) {
		// 			//ошибка
		// 			console.error(err)
		// 		} else {
		// 			// весь стандартный вывод и стандартный поток (буферизованный)
		// 			console.log(stdout);
		// 			console.log(stderr);
		// 			res.send(stdout);
		// 		}
		// 	});
		// 	break;
	}
});
