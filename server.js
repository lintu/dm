var express = require('express');
var app = express();
var path = require('path');
var multer = require('multer');
var fs = require('fs');
var uuid = require('uuid');
var jsmediatags = require("jsmediatags");
var btoa = require('btoa');


app.use(express.static(path.join(__dirname, '')));
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './user_data/songs/' + req.query.userId + '/');
    },
    filename: function (req, file, cb) {
        file.songId = uuid.v1();
        console.log(file.originalname);
        var extArray = file.originalname.split('.');
        cb(null, file.songId + '.' + extArray[extArray.length - 1]);
    }
});
var upload = multer({ storage: storage }).single('file');
try {
    var server = app.listen(90, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Server on http: ', host, port);
    });
} catch (error) {
    console.log(error);
}
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/upload', function (req, res, next) {
    console.log('req from ' + req.query.userId);
    var userFolder = 'user_data/songs/' + req.query.userId;
    var imageFolder = 'user_data/thumbs/' + req.query.userId;
    if (!fs.existsSync(userFolder)){
        fs.mkdirSync(userFolder);
    }
    if (!fs.existsSync(imageFolder)){
        fs.mkdirSync(imageFolder);
    }
    upload(req, res, () => {
        console.log('done uploadin');
        jsmediatags.read(req.file.destination + req.file.filename, {
            onSuccess: (tags) =>{
                
                if(tags.tags.picture) {
                    console.log('1');
                    var base64String = "";
                    for (var i = 0; i < tags.tags.picture.data.length; i++) {
                        base64String += String.fromCharCode(tags.tags.picture.data[i]);
                    }
                    var imageUrl = imageFolder + '/' +req.file.filename + '.' +tags.tags.picture.format.split('/')[1];
                    dataUrl = btoa(base64String);
                    console.log('2');
                    require("fs").writeFile('./'+imageUrl , dataUrl, 'base64',  (err)=> {
                        console.log('3');
                        tags.tags.thumbUrl = imageUrl;
                        tags.tags.songUrl = userFolder + '/' + req.file.filename;
                        tags.tags.songId = req.file.filename.split('.')[0];
                        tags.tags.originalName = req.file.originalname;
                        tags.tags.size = req.file.size;
                        console.log('4');
                        console.log(tags);
                        res.json(tags);
                    });
                } else {
                    tags.tags.songUrl = userFolder + '/' + req.file.filename;
                    tags.tags.thumbUrl = '/default.jpg';
                    tags.tags.songId = req.file.filename.split('.')[0];
                    tags.tags.originalName = req.file.originalname;
                    tags.tags.size = req.file.size;
                    res.json(tags);
                }
            },
            onError: (error)=> {
                console.log('done reading onSuccess');
                res.json({message: error});
            }
        });
    })
});