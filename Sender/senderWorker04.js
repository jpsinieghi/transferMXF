var request = require('request');
var path = require('path');
var fs = require('fs');
var chokidar = require('chokidar');

//\\10.0.95.171\Portugal\MXF

var watcher = chokidar.watch('P:\\home\\ftp\\incoming\\Portugal\\MXF\\', {ignored: /(^|[\/\\])\../, persistent: true, usePolling: true});
var end_timeout = 10000;

function transfer(arquivo){
  
  var file_media = arquivo.replace('\\\\','\\')
  var file_media = file_media.split("\\")
  target = ('http://189.2.14.82:3000/upload/' + file_media[6]);
  ws = request.post(target)
  rs = fs.createReadStream(arquivo)
  //tamanhoArquivo = fs.statSync(file_media)["size"] * 100
  ws.on('drain', function () {
      //console.log("Transferindo " + target + "(" + (Math.round(rs.bytesRead / (fs.statSync(file_media))["size"] * 100)) + "%)")
      //console.log("Transferindo " + target + "(" + (Math.round(rs.bytesRead / tamanhoArquivo)) + "%)")
      //rs.close()
      rs.resume()
    })

               
    rs.on('end', function () {
      console.log(file_media[6] + " enviado")
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



//'P:\\home\\ftp\\incoming\\Portugal\\MXF\\'


watcher
    .on('add', function(path) {

        console.log('File', path, 'has been added');

        fs.stat(path, function (err, stat) {
            // Replace error checking with something appropriate for your app.
            if (err) throw err;
            setTimeout(checkEnd, end_timeout, path, stat);
        });
});