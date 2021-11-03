const Express = require('express')
const bodyParser = require('body-parser')

const app = Express()

const dotenv = require('dotenv')
dotenv.config();

app.use(bodyParser())
app.use(require('./routes/api'))
app.use(Express.static('public/'));

const { WebSocketServer } = require('ws')


let timers = {}

const wss = new WebSocketServer({ port: 6969 });

wss.on('connection', function connection(ws) {
	ws.on('message', function message(data) {
		let response = JSON.parse(data)
		// console.log(response)

		let id = response.clientID

		switch (response.action) {
			case "Start":
				startTime = new Date().getTime()
				stopTime = null
				timers[`${id}`] = { startTime, stopTime }
				break
			case "Stop":
				stopTime = new Date().getTime()
				timers[`${id}`].stopTime = stopTime
				break
		}

		console.log(timers)



	});

	ws.send(uuid())
});

wss.on('close', function close() {
	console.log("Client closed connection")
});

console.log("listening on port: " + process.env.PORT)
app.listen(process.env.PORT)

function uuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}