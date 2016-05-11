var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var page = 0;
var url = 'http://www.gosugamers.net/replays?tournament=&team=&player=&recommended=0&rotw=0&game=15&filter=Submit&page=';
var finalData = [];
var Promise = require('es6-promise').Promise;

function promiseRequest(link) {
  return new Promise(function(resolve, reject) {
    request(link, function(err, response, body) {
      if(err !== null) {
        return reject(err);
      }
      return resolve(body);
    });
  });
}

function doRequest(page) {
  promiseRequest(url+page).then(function(body) {
    if(true) {
      $ = cheerio.load(body);
      var date;
      var rows = $('table tbody tr[data-href= ]').each(function(i, element) {

        // fix the f-ing date
        date = element.children[0].next.next.next.next.next.next.next.next.next.next.next.children[0].data.split('.');
        date = Date.parse(date[0] + date[1]);
        finalData.push({
          team1: element.children[0].next.children[0].data,
          team2: element.children[0].next.next.next.next.next.children[0].data,
          tournament: element.children[0].next.next.next.next.next.next.next.children[0].data,
          date_added: date, 
          download_link:'http://www.gosugamers.net' + element.children[0].next.next.next.next.next.next.next.next.next.next.next.next.next.children[1].attribs.href,
        });
      }); // get all rows of table
    }
  }).then(function() {
    if(page <= 56) {
      page++;
      doRequest(page);
    }else {
      finalData = JSON.stringify(finalData, null, 4) + '\n';

      // write to file
      fs.writeFile('output.json', finalData);
    }
  });
}

doRequest(page);
