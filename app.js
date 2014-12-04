/*
 * Module dependencies

 */

 
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')

var http = require('http');
var app = express();
//var server = http.createServer(app);
//var io = require('socket.io').listen(server);

//=============================================================================
//    EXPRESS SETUP
//=============================================================================


function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))

//=============================================================================
//    ROUTING
//=============================================================================

app.get('/', function (req, res) {
  res.render('index',
  { title : 'Kyle Mattimore', locals:{currentURL: '/'} });
})


app.get('/about/', function (req, res) {
  res.render('about',
  { title : 'About Me', locals:{currentURL: '/about/'}});
})

app.get('/contact/', function (req, res) {
  res.render('contact',
  { title : 'Contact', locals:{currentURL: '/contact/'}});
})


var server = http.createServer(app).listen(3000);

//required for appfog to work? 
var io = require('socket.io').listen(server);
io.configure('development', function(){
  io.set('transports', ['xhr-polling']);
});

require('./routes');
//app.listen(3000)

//=============================================================================
//    SOCKETS CREATION
//=============================================================================
io.sockets.on('connection', function (socket) {

    socket.on('ishuman', function (data) {
      console.log("Got a human, bitches");
      socket.emit('message', '<p><p>Thanks!<p><p> kmattimo@umich.edu <p> more info goes here' );
      console.log("Package has been delivered");
      socket.disconnect();
    socket.on('disconnect', function(){});
    });
  });
