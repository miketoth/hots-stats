var PythonShell = require('python-shell');

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
