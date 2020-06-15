var request = require('request');
var path = require('path');
var fs = require('fs');
var chokidar = require('chokidar');

var watcher = chokidar.watch('MXF', {ignored: /^\./, persistent: true});
var end_timeout = 10000;

//var filename = process.argv[2];

//var target = 'http://189.2.14.82:3000/upload/' + path.basename(filename);




function transfer(arquivo){
    //console.log("Transferindo "+arquivo)
    file_media = arquivo.split("\\")
    target = ('http://189.2.14.82:3000/upload/' + file_media[1]);
    ws = request.post(target)
    rs = fs.createReadStream(file_media[1])
    //rs.on('error',function(){console.log("Arquivo ainda sendo copiado")})

    ws.on('drain', function () {
    //console.log("Transferindo " + target + "(" + (Math.round(rs.bytesRead / (fs.statSync(file_media))["size"] * 100)) + "%)")
    rs.resume()
    })

    rs.on('end', function () {
    //console.log(arquivo + " enviado")
    fs.unlinkSync(arquivo)

    })
  
    ws.on('error', function (err) {
    console.error('cannot send file to ' + target + ': ' + err);
    })
    
    rs.pipe(ws)
  
}


function checkEnd(path, prev) {
  fs.stat(path, function (err, stat) {

      // Replace error checking with something appropriate for your app.
      if (err) throw err;
      if (stat.mtime.getTime() === prev.mtime.getTime()) {
          console.log("finished");
          // Move on: call whatever needs to be called to process the file.
        transfer(path)

      }
      else
          setTimeout(checkEnd, end_timeout, path, stat);
  });
}


watcher
    .on('add', function(path) {

        console.log('File', path, 'has been added');

        fs.stat(path, function (err, stat) {
            // Replace error checking with something appropriate for your app.
            if (err) throw err;
            setTimeout(checkEnd, end_timeout, path, stat);
        });
});





