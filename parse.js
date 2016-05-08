var PythonShell = require('python-shell');
var downloadList = require('./small-output');
var Promise = require('es6-promise').Promise;

// needs to read output.json file for list of games to download and parse

// Promisify PythonShell
function runPython(fileName, opts) {
  return new Promise(function(resolve, reject) {
    PythonShell.run(fileName, opts, function(err, result) {
      if(err !== null) {
        return reject(err);
      }
      return resolve(result);
    });
  });
} 

downloadList.forEach(function(match) {
  var gameArray = [];
  var options = {
    mode: 'text',
    pythonPath: '/usr/bin/python', // python could be else where. Check for env variable
    scriptPath: '/Users/skullum/workspace/heroes_analyst/heroprotocol/', // need to abstract out script path
    args: ['--details', '8518_R1_1458527865.StormReplay']
  };


  // include on Reject
  runPython('heroprotocol.py', options).then(function(result) {
    var data;

    result.forEach(function(line) {
      data += line;
    }); 

    // Fixes incorrect JSON
    data = data.replace(/'/g,'"');
    data = data.replace(/True/g,'"TRUE"');
    data = data.replace(/False/g,'"FALSE"');
    data = data.replace(/None/g,'"NONE"');
    var split_data = data.split('m_campaignIndex');
    split_data = '{"m_campaignIndex' + split_data[1];

    data = JSON.parse(split_data);
    var game = {
      team1: {
        name: match.team1, // the team names seem to be in the same order on gg as the replay file. Need to see if this is true for all games
        members: []
      },
      team2: {
        name: match.team2,
        members: []
      },
      map: data.m_title,
      date_played: data.m_timeUTC
    };

    data.m_playerList.forEach(function(player) {
      if(player.m_teamId === 0) {
        game.team1.members.push({name: player.m_name, character: player.m_hero});
        game.team1.result = player.m_result === 1 ? 1:0; // m_result seems to be 2 for loss and 1 for a win. Doesn't really make sense to me. Need to check with a larger sample size
      } else {
        game.team2.members.push({name: player.m_name, character: player.m_hero});
        game.team2.result = player.m_result === 1 ? 1:0;
      }
    });
    return game;
  }).then(function(result) {
    gameArray.push(result);
    console.log(gameArray);
  });
});

