var request = require('request');
var path = require('path');
var fs = require('fs');
var watch = require('node-watch');
var countUpdate = 0


function transfer(arquivo){
  
  var file_media = arquivo.replace('\\\\','\\')
  var arquivoMXF = file_media.split("\\")
  target = ('http://189.2.14.82:3000/upload/' + arquivoMXF[4]);
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
      console.log(arquivoMXF[4] + " enviado")
      fs.unlinkSync(arquivo)
  
      })

    ws.on('error', function (err) {
        console.error('cannot send file to ' + target + ': ' + err);
        })
    
    rs.pipe(ws)  

}


//'P:\\home\\ftp\\incoming\\Portugal\\MXF\\'


watch('\\\\10.0.95.170\\Portugal\\MXF\\', {}, function(evt, name) {

 console.log(evt)
 
  if(evt == 'update'){
    countUpdate++
    if(countUpdate == 2){
      countUpdate = 0
      transfer(name)
    }
  }
});
