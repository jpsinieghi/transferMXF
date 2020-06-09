var request = require('request');
var path = require('path');
var fs = require('fs');

var filename = process.argv[2];

var target = 'http://189.2.14.82:3000/upload/' + path.basename(filename);



function getFilesizeInBytes(filename) {
  var stats = fs.statSync(filename)
  var fileSizeInBytes = stats["size"]
  return fileSizeInBytes
}



fs.readdir(path.join(__dirname, 'MXF'), function (err, files) {
  if (files.length == 0) {
    console.log("Sem arquivo")
    
  }
  else {
    //for(i=0,i<=files.length,i++)
    //  console.log(files[i])
    //}
    console.log(files[0])
    ws = request.post(target)
    rs = fs.createReadStream(filename)
    ws.on('drain', function () {

      console.log("Transferindo " + target + "(" + (Math.round(rs.bytesRead / getFilesizeInBytes(filename) * 100)) + "%)")
      rs.resume()
    })

    rs.on('end', function () {
      console.log('uploaded to ' + target);
      //apagar o arquivo transferido
      console.log("Apagando " + filename)
      //fs.unlinkSync(filename)

    });

    ws.on('error', function (err) {
      console.error('cannot send file to ' + target + ': ' + err);
    });

    //rs.pipe(ws)



  }
})

























