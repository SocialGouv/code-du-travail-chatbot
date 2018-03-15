let express = require('express')
let path = require('path')
let app = express()
let server = require('http').createServer(app)
let io = require('socket.io')(server)
let dialogflowClient = require('./dialogflow-client')


const STATIC_DIR = '/public'


app.use(express.static(path.join(__dirname, STATIC_DIR)))


app.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, STATIC_DIR, '/index.html'))
})


io.on('connection', function (socket) {

  let socketid = null
  socket.on('user.id', function (data) {
    socketid = data
  })

  socket.on('message.user', async function (queryText) {
    let response = await dialogflowClient.sendRequest(queryText)
    io.to(socketid).emit('message.bot', response)
  })

})


let port
let host

if (process.env.NODE_ENV === 'production') {
  port = 80
  host = '0.0.0.0'// Listen on IPv4.
} else {
  port = 4200
  host = 'localhost'
}

server.listen(port, host)
console.log('Listening at http://' + host + ':' + port + '\n')
