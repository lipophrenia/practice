const host = "localhost";
const port = 8080;
const fs = require("fs");
const os = require("node:os");
const path = require("path");
const bodyParser = require("body-parser");
const execFile = require('child_process').execFile;

const express = require("express");
const app = express();
app.use(express.json());
var jsonParser = bodyParser.json()
var path_to_config;
var lastSelectedCam;
var Selected;
var confs;

function Init(){
  lastSelectedCam = fs.readFileSync("model", "utf8");
  var configsList = fs.readFileSync("configs.json", "utf8");
  confs = JSON.parse(configsList);
  for (var i = 0; i < confs.length; i++) {
    if (lastSelectedCam == confs[i].name) {
      Selected = confs[i].id;
      path_to_config = confs[i].path;
    }
  }
}

function Select(Selected){
  var configsList = fs.readFileSync("configs.json", "utf8");
  confs = JSON.parse(configsList);
  for (var i = 0; i < confs.length; i++) {
    if (Selected == confs[i].name) {
      lastSelectedCam = confs[i].name;
      path_to_config = confs[i].path;
    }
  }
  return lastSelectedCam;
}

app.use("/static", express.static(__dirname + "/www/static"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "www", "index.html"));
  Init();
});

//get config list
app.get("/api/conflist-get",function (req, res) {
  res.json(confs);
});

//get last selection
app.get("/api/last-selection",function (req, res) {
  res.json({ selected: lastSelectedCam });
});

//config select
app.patch("/api/conf-select", jsonParser, function (req, res) {
  Selected = req.body.id;
  Select(Selected);
  fs.writeFile("model", lastSelectedCam, function (err) {
    if (err) {
      res.status(500).json({ msg: "Error!" });
      console.error(err);
    } else {
      res.json({ msg: "Selected id - "+lastSelectedCam });
    }
  });
});

//get video config
app.get("/api/conf-get", function (req, res) {
  var confFile = fs.readFileSync("/home/practice/practice/files/" + path_to_config); // путь до файла
  res.json(JSON.parse(confFile));
});

//save video config
app.patch("/api/conf-save", function (req, res) {
  var fileJson = path.join("/home/practice/practice/files/", path_to_config); // папка, в которой лежат файлы video.config
  var dataJson = JSON.stringify(req.body, null, 4);
  fs.writeFile(fileJson, dataJson, function (err) {
    if (err) {
      res.status(500).json({ msg: "VidConf save error!" });
      console.error(err);
    } else {
      res.json({ msg: "VidConf saved!" });
    }
  });
});

//get net config
app.get("/api/net-get", function (req, res) {
  var fileName = path.resolve("/home/practice/practice/files/", "ip.network"); // путь до файла ip.network
  fs.readFile(fileName, "utf8", function (err, fileData) {
    if (err) {
      res.status(500).json({ msg: "Something went wrong." });
      console.error(err);
    } else {
      var json = {
        ip1: "",
        ip2: "",
        ip3: "",
        gate: "",
      };
      var arrStr = fileData.split(/\r\n|\r|\n/g);
      for (var i = 0; i < arrStr.length; i++) {
        arrStr[i].trim();
        if (arrStr[i][0] != "#") {
          if (arrStr[i].indexOf("Address") >= 0) {
            var arr = arrStr[i].split("=");
            if (json.ip1 == "") {
              json.ip1 = arr[1];
            } else if (json.ip2 == "") {
              json.ip2 = arr[1];
            } else {
              json.ip3 = arr[1];
            }
          }
          if (arrStr[i].indexOf("Gateway") >= 0) {
            var arr = arrStr[i].split("=");
            json.gate = arr[1];
            break;
          }
        }
      }
      res.json(json);
    }
  });
});

//save net config
app.patch("/api/net-save", function (req, res) {
  if (
    req.body.hasOwnProperty("ip1") &&
    req.body.hasOwnProperty("ip2") &&
    req.body.hasOwnProperty("ip3") &&
    req.body.hasOwnProperty("gate")
  ) {
    var fileName = path.resolve("/home/practice/practice/files/", "ip.network"); // путь до файла ip.network
    fs.readFile(fileName, "utf8", function (err, fileData) {
      if (err) {
        res.status(500).json({ msg: "Something went wrong." });
        console.error(err);
      } else {
        addrCounter = 0;
        var arrStr = fileData.split(/\r\n|\r|\n/g);
        for (var i = 0; i < arrStr.length; i++) {
          arrStr[i].trim();
          if (arrStr[i][0] != "#") {
            if (arrStr[i].indexOf("Address") >= 0) {
              var arr = arrStr[i].split("=");
              if (addrCounter == 0) {
                arr[1] = req.body.ip1;
                addrCounter++;
              } else if (addrCounter == 1) {
                arr[1] = req.body.ip2;
                addrCounter++;
              } else {
                arr[1] = req.body.ip3;
              }
              arrStr[i] = arr.join("=");
            }
            if (arrStr[i].indexOf("Gateway") >= 0) {
              var arr = arrStr[i].split("=");
              arr[1] = req.body.gate;
              arrStr[i] = arr.join("=");
              break;
            }
          }
        }
        var str = arrStr.join(os.EOL);
        fs.writeFile(fileName, str, function (err) {
          if (err) {
            res.status(500).json({ msg: "NetConf save error!" });
            console.error(err);
          } else {
            res.json({ msg: "NetConf saved!" });
          }
        });
      }
    });
  } else {
    res.status(409).json({ msg: "Wrong parameters." });
  }
});

//reboot
app.get("/reboot", function (req, res) {
  execFile("./reboot.sh", { shell: "/bin/bash" }, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    } else {
      console.log(stdout);
      console.log(stderr);
      res.send(stdout);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}/`);
});