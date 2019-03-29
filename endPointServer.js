/**
 * endPointServer.js
 *
 * simple http server with powerpoint api
 * access control with: http://localhost:3000/control.html
 * (c) Nacho Ariza March 2019
 * MIT License
 */
const SlideShow = require("./slideshow")
const slideshow = new SlideShow("powerpoint2016");
const http = require('http');

const bodyParser = require('body-parser');
const http_port = 3010;
const express = require("express");
const app = express();
// your ppt file...
const ppt='../ppt/sample.pptx';

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json(true));
app.use(express.static(process.cwd() + '/public'));

app.get('/prev', (req, res) => {
	console.log('[prev]');
	slideshow.prev();
	res.sendStatus(200);
});
app.get('/next', (req, res) => {
	console.log('[next]');
  slideshow.next();
	res.sendStatus(200);
});
app.get('/close', (req, res) => {
	console.log('[close]');
	slideshow.close();
	res.sendStatus(200);
});
app.get('/open', (req, res) => {
	console.log('[open]');
	slideshow.boot();
	slideshow.open(ppt);
	res.sendStatus(200);
});
app.get('/start', (req, res) => {
	console.log('[start]');
	slideshow.start();

	res.sendStatus(200);
	
});
app.get('/stop', (req, res) => {
	console.log('[stop]');
	slideshow.stop();
	res.sendStatus(200);
});
app.get('/pause', (req, res) => {
	console.log('[pause]');
	slideshow.pause();
	res.sendStatus(200);
});
app.get('/first', (req, res) => {
	console.log('[first]');
	slideshow.first();
	res.sendStatus(200);
});
app.get('/last', (req, res) => {
	console.log('[last]');
	slideshow.last();
	res.sendStatus(200);
});
app.get('/resume', (req, res) => {
	console.log('[resume]');
	slideshow.resume();
	res.sendStatus(200);
});
app.get('/info', (req, res) => {
	console.log('[info]');
	slideshow.info().done(info=>{console.log('info',info)});
	res.sendStatus(200);
});
app.get('/stat', (req, res) => {
	console.log('[stat]');
	slideshow.stat().done(stat=>{console.log('stat',stat);res.send(stat)});
});
app.get('/goto', (req, res) => {
	console.log('[stat]');
	slideshow.goto(3).done(status=>{console.log(status)});
	res.sendStatus(200);
});

http.createServer(app).listen(http_port).on('error', (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
}).on('listening', () => {
	console.log(process.pid + ' - http listening on port:' + http_port);
});
process.on('uncaughtException', function (err) {
	console.error('Something went wrong in booting time (%s)');
});

