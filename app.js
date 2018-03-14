let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let dialogflowClient = require('./dialogflow-client')


const STATIC_DIR = '/public'


app.use(express.static(__dirname + STATIC_DIR));


app.get('/', function (req, res, next) {
  res.sendFile(__dirname + STATIC_DIR + '/index.html');
});


io.on('connection', function (socket) {

  let socketid = null
  socket.on('user.id', function (data) {
    socketid = data;
  });

  socket.on('message.user', async function (queryText) {
    let response = await dialogflowClient.sendRequest(queryText)
    io.to(socketid).emit('message.bot', response);
  });

});


server.listen(4200);
