const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})
const path = require('path')
const clients = {}

app.use(require('express').static(path.join(__dirname, '/public')))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/views/index.html'))
})

io.on('connection', socket => {
  console.log('New user connected: ' + socket.id)
  socket.on('join', name => {
    clients[socket.id] = name
    console.log(clients)
    io.emit('broadcast', clients)

    socket.emit('update', 'You have connected to the server.')
    socket.broadcast.emit('update', name + ' has joined the server.')
  })

  socket.on('disconnect', () => {
    console.log('User <b>' + clients[socket.id] + '</b> disconnected')
    socket.broadcast.emit(
      'update',
      'User <b>' + clients[socket.id] + '</b> disconnected'
    )
    delete clients[socket.id]

    console.log(clients)
    io.emit('update-users', clients)
  })

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg + ' by ' + clients[socket.id])
    socket.broadcast.emit('chat message', msg, clients[socket.id])
  })

  socket.on('typing', () => {
    socket.broadcast.volatile.emit('typing', clients[socket.id])
  })
})

server.listen(8000, () => {
  console.log('listening port 8000')
})
