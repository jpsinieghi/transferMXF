var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');

var CAMINHO = 'T:/transferMXF/Receiver/MXF'
var app = express();

app.set('port', process.env.PORT || 3000);



app.post('/upload/:filename', function (req, res) {
    var filename = path.basename(req.params.filename);
    filename = path.resolve(CAMINHO, filename);
    var dst = fs.createWriteStream(filename);
    console.log("Iniciando transferencia do arquivo "+dst.path)
    req.pipe(dst);
    dst.on('drain', function () {

	console.log(dst.path+" - "+dst.bytesWritten)
	//console.clear()

        req.resume();
    });
    req.on('end', function () {
        res.sendStatus(200);
	console.log("Transferencia completa do arquivo "+dst.path)
        
    });
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});