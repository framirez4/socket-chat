
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clients = {};

app.use(require('express').static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket){
  console.log('New user connected: ' + socket.id);
  socket.on('join', function(name){
    clients[socket.id] = name;
    console.log(clients);
    io.emit('update-users', clients);

    socket.emit('update', "You have connected to the server.");
    socket.broadcast.emit('update', name + " has joined the server.")
  })

  socket.on('disconnect', function(){
    console.log('User <b>' + clients[socket.id] + '</b> disconnected');
    socket.broadcast.emit('update', 'User <b>' + clients[socket.id] + '</b> disconnected')
    delete clients[socket.id];

    console.log(clients);
    io.emit('update-users',  clients);

  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg + ' by ' + clients[socket.id]);
    socket.broadcast.emit('chat message', msg, clients[socket.id]);
  });

  socket.on('typing', function(){
    socket.broadcast.volatile.emit('typing', clients[socket.id])
  })
});





http.listen(8000, function(){
  console.log('listening on *:8000');
});
