let usercontrol = require('./usercontrol');
let io = require('socket.io')();

io.on('connection', function(socket) {
  //socket.emit('test', {hello: 'world'});

  socket.on('account_manage', function(msg) {
    let result = usercontrol.getUser(msg.name, false);
    //console.log(result);
    socket.emit('account_manage', result);
  });
});

exports.io = io;

