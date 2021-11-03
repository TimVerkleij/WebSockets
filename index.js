const Express = require('express')
const bodyParser = require('body-parser')

const app = Express()

const dotenv = require('dotenv')
dotenv.config();

app.use(bodyParser())
app.use(require('./routes/api'))
app.use(Express.static('public/'));

const { WebSocketServer } = require('ws')

const wss = new WebSocketServer({ port: 6969 });

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);

    ws.send("I received your message")
  });

  ws.send('Wow');
  ws.send('Hello there');
  ws.send('Have some more data');
  ws.send('And some more');
});

console.log("listening on port: " + process.env.PORT)
app.listen(process.env.PORT)