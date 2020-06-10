var request = require('request');
var path = require('path');
var fs = require('fs');

//var filename = process.argv[2];

//var target = 'http://189.2.14.82:3000/upload/' + path.basename(filename);




function transfer(arquivo){
  file_media = ".\\MXF\\"+arquivo

  target = ('http://189.2.14.82:3000/upload/' + arquivo);
  ws = request.post(target)
  rs = fs.createReadStream(file_media)
  ws.on('drain', function () {
    //console.log("Transferindo " + target + "(" + (Math.round(rs.bytesRead / (fs.statSync(file_media))["size"] * 100)) + "%)")
    rs.resume()
  })

  rs.on('end', function () {
  console.log(arquivo + " enviado")
  fs.unlinkSync(".\\MXF\\"+arquivo)

  })
  
  ws.on('error', function (err) {
  console.error('cannot send file to ' + target + ': ' + err);
  })

  rs.pipe(ws)

}

function execute(){
fs.readdir(path.join(__dirname, 'MXF'), function (err, files) {
  if (files.length == 0) {
    console.log("Sem arquivo")
     }
  else {
    for(i=0;i<files.length;i++){
      console.log("Transferindo "+files[i])
      transfer(files[i])}
    }
})
}

setInterval(execute, 10000)
