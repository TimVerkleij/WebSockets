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
				totalTime = 0
				timers[`${id}`] = { startTime, stopTime, totalTime }
				setInterval(sendTimerData, 1000, ws, id, timers[`${id}`])
				break
			case "Stop":
				stopTime = new Date().getTime()
				timers[`${id}`].stopTime = stopTime
				totalTime =  stopTime - timers[`${id}`].startTime
				timers[`${id}`].totalTime += totalTime
				break
			case "Pause":
				pauseTime = new Date().getTime()
				totalTime = pauseTime - timers[`${id}`].startTime
				timers[`${id}`].totalTime += totalTime
				break
			case "Resume":
				startTime = new Date().getTime()
				timers[`${id}`].startTime = startTime
				break
		}

		console.log(timers)
		let timerData = {clientID: id, timer: timers[`${id}`], running: true}
		ws.send(JSON.stringify(timerData))


	});

	let data = {clientID: uuid(), running: false}
	ws.send(JSON.stringify(data))
});

wss.on('close', function close() {
	console.log("Client closed connection")
});

console.log("listening on port: " + process.env.PORT)
app.listen(process.env.PORT)

function sendTimerData(ws, clientID, timer) {
	let timerData = {clientID, timer, running: true}
	timer.currentTime = new Date().getTime() - timer.startTime
	ws.send(JSON.stringify(timerData))
}

function uuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}