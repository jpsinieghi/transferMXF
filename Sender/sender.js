var request = require('request');
var path = require('path');
var fs = require('fs');

var filename = process.argv[2];

var target = 'http://189.2.14.82:3000/upload/' + path.basename(filename);

var rs = fs.createReadStream(filename)
var ws = request.post(target)

function getFilesizeInBytes(filename) {
  var stats = fs.statSync(filename)
  var fileSizeInBytes = stats["size"]
  return fileSizeInBytes
}

ws.on('drain', function(){
  
  console.log("Transferindo " + target + "(" + (Math.round(rs.bytesRead/getFilesizeInBytes(filename)*100)) + "%)")
  
  rs.resume()
}) 




rs.on('end', function () {
  console.log('uploaded to ' + target);
  //apagar o arquivo transferido
  console.log("Apagando "+filename)
  fs.unlinkSync(filename)

});

ws.on('error', function (err) {
  console.error('cannot send file to ' + target + ': ' + err);
});

rs.pipe(ws)
