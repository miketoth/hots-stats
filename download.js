var Promise = require('es6-promise').Promise;
var downloadList = require('./output');
var promiseArray = [];
var exec = require('child_process').exec;

function promiseRequest(id, link) {
  return new Promise(function(resolve, reject) {
    var cmd = 'wget -O ' + id + '.StormReplay ' + link;
    console.log(cmd);
    exec(cmd, function(err, stdout, stderr) {
      if(err!== null) { 
        console.log('Error: ', err);
      }
    });
  });
}

downloadList.forEach(function(item) {
  promiseArray.push(promiseRequest(item.id, item.download_link));
});

Promise.all(promiseArray);

