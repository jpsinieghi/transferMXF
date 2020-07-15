var request = require('request');
var path = require('path');
var fs = require('fs');
var chokidar = require('chokidar');


var watcher = chokidar.watch('./MXF/*.mxf', {ignored: /(^|[\/\\])\../, persistent: true, usePolling: true});
var end_timeout = 10000;


function transfer(arquivo){
  
  var file_media = arquivo.split("/")
  target = ('http://189.2.14.82:3000/upload/' + file_media[1]);
  ws = request.post(target)
  rs = fs.createReadStream(arquivo)
  ws.on('drain', function () {
      rs.resume()
    })
 
               
    rs.on('end', function () {
      console.log('Arquivo',file_media[1],'enviado')
      fs.unlinkSync(arquivo)
  
      })

    ws.on('error', function (err) {
        console.error('cannot send file to ' + target + ': ' + err);
        })
    
    rs.pipe(ws)  

}


function checkEnd(path, prev) {
  fs.stat(path, function (err, stat) {

      if (err) throw err;
      if (stat.mtime.getTime() === prev.mtime.getTime()) {
          console.log('Arquivo',path, 'criado na pasta MXF');
        console.log(path)
	//transfer(path)
	

      }
      else
          setTimeout(checkEnd, end_timeout, path, stat);
  });
}

watcher
    .on('add', function(path) {

        console.log('Arquivo', path, 'sendo transferindo na pasta MXF');

        fs.stat(path, function (err, stat) {
            if (err) throw err;
            setTimeout(checkEnd, end_timeout, path, stat);
        });
});
