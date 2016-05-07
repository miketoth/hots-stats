var fs = require('fs');
var PythonShell = require('python-shell');
var request = require('request');
var cheerio = require('cheerio');

// * Performs request to get all downloads available on a page at gosugamers
/*
request('http://www.gosugamers.net/replays?tournament=&team=&player=&recommended=0&rotw=0&game=15&filter=Submit', function(error, response, body) {
  if(!error && response.statusCode) {
    $ = cheerio.load(body);
    var a  = $('a');
    var downloadIds = [];
    for(i=0;i<a.length;i++) { 
      if(a[i].attribs.href.indexOf('/replays/download?id=') !== -1) { 
        downloadIds.push('http://www.gosugamers.net' + a[i].attribs.href);
      }
    };
    console.log(downloadIds);
  }
});
*/


var options = {
  mode: 'text',
  pythonPath: '/usr/bin/python',
  scriptPath: '/Users/skullum/workspace/heroes_analyst/heroprotocol/',
  args: ['--details', '8518_R1_1458527865.StormReplay']
};

PythonShell.run('heroprotocol.py', options, function (err, result) {
  if (err) throw err;
  var data;

  result.forEach(function(line) {
    data += line;
  }); 

  data = data.replace(/'/g,'"');
  data = data.replace(/True/g,'"TRUE"');
  data = data.replace(/False/g,'"FALSE"');
  data = data.replace(/None/g,'"NONE"');
  var split_data = data.split('m_campaignIndex');
  split_data = '{"m_campaignIndex' + split_data[1];
  data = JSON.parse(split_data);
  var game = {
    team1: {
      name: 'Cloud 9',
      result: 1,
      members: []
    },
    team2: {
      name: 'Panda Global',
      result: 0,
      members: []
    },
    map: data.m_title,
    date: data.m_timeUTC
  };

  data.m_playerList.forEach(function(player) {
    if(player.m_teamId === 0) {
      game.team1.members.push({name: player.m_name, character: player.m_hero});
    } else {
      game.team2.members.push({name: player.m_name, character: player.m_hero});
    }
  });
  console.log(game);
});

