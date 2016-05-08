var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

// Performs request to get all downloads available on a page at gosugamers
// Need to walk all pages
// Save to a file
// Need some way to make sure we dont duplicate
// * Read file first
// * Use a database?
request('http://www.gosugamers.net/replays?tournament=&team=&player=&recommended=0&rotw=0&game=15&filter=Submit', function(error, response, body) {
  if(!error && response.statusCode) {
    $ = cheerio.load(body);
    var i = 0;
    var downloadData = [];
    var objectInProgress = {};
    var stop = true;
    var date;
    var rows = $('table tbody tr[data-href= ]').each(function(i, element) {

      // fix the f-ing date
      date = element.children[0].next.next.next.next.next.next.next.next.next.next.next.children[0].data.split('.');
      date = Date.parse(date[0] + date[1]);
      downloadData.push({
        team1: element.children[0].next.children[0].data,
        team2: element.children[0].next.next.next.next.next.children[0].data,
        tournament: element.children[0].next.next.next.next.next.next.next.children[0].data,
        date_added: date, 
        download_link:'http://www.gosugamers.net' + element.children[0].next.next.next.next.next.next.next.next.next.next.next.next.next.children[1].attribs.href,
      });
    }); // get all rows of table
    downloadData = JSON.stringify(downloadData, null, 4) + '\n';

    // write to file
    fs.writeFile('output.json', downloadData);
  }
});
