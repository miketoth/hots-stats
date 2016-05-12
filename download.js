var fs = require('fs');
var Promise = require('es6-promise').Promise;
var request = require('request');
var downloadList = require('./output');
var promiseArray = [];

function promiseRequest(link) {
  return new Promise(function(resolve, reject) {
    request(link, function(err, response, body) {
      if(err !== null) {
        return reject(err);
      }
      return resolve(response, body);
    });
  });
}

downloadList.forEach(function(item) {
  promiseArray.push(promiseRequest(item.download_link).then(function(res, body) {
    res.pipe(fs.createWriteStream('/Volumes/MINT/storm_replays/' + item.id + '.StormReplay'));
  }));
});

Promise.all(promiseArray).then(function() {
  // all loaded nothing to do
});

