var watch = require('node-watch');
 
var count = 0
watch('.\\MXF\\', { recursive: true }, function(evt, name) {
  
  if(evt == 'update'){
    count++
    console.log(count)
    if(count == 2){
      console.log("Console = 2")
      count = 0

    }

  }
  
  console.log('%s changed.', name);
  console.log(evt);
    
});

