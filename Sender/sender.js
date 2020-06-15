var request = require('request');
var path = require('path');
var fs = require('fs');

//var filename = process.argv[2];

//var target = 'http://189.2.14.82:3000/upload/' + path.basename(filename);




function transfer(arquivo){
  
  //verificar se é MXF
  extensaoArquivo = arquivo.split(".")[1]
  if(arquivo.split(".")[1] === 'mxf'){
    console.log(extensaoArquivo)
    //console.log("Transferindo "+arquivo)
    file_media = ".\\MXF\\"+arquivo


    fs.renameSync(file_media,file_media+'.tmp')

    target = ('http://189.2.14.82:3000/upload/' + arquivo);
    ws = request.post(target)
    rs = fs.createReadStream(file_media+'.tmp')
    rs.on('error',function(){console.log("Arquivo ainda sendo copiado")})

    ws.on('drain', function () {
    //console.log("Transferindo " + target + "(" + (Math.round(rs.bytesRead / (fs.statSync(file_media))["size"] * 100)) + "%)")
    rs.resume()
    })

    rs.on('end', function () {
    //console.log(arquivo + " enviado")
    fs.unlinkSync(file_media+'.tmp')

    })
  
    ws.on('error', function (err) {
    console.error('cannot send file to ' + target + ': ' + err);
    })
    
    rs.pipe(ws)
  }
  else{
    console.log("Extensão diferente de MXF")

  }
}

fs.readdir(path.join(__dirname, 'MXF'), function (err, files) {
  if (files.length == 0) {
    console.log("Sem arquivo")
     }
  else {
    for(i=0;i<files.length;i++){
      transfer(files[i])}
    }
})




