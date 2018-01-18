var express = require('express')
var ip = require('ip')
var dotenv = require('dotenv').config()
var app = express()
var path = require('path')
var routes =  require('./routes/routes')
app.use('/', routes)
var hello = "hello";

//Server Static Content
app.use(express.static(path.join(__dirname,"public")))

//Setup react view engine
app.set('views',__dirname + "/views");
app.set('view engine','jsx');
app.engine('jsx', require('express-react-views').createEngine());

app.get('/test', function(req, res){
	res.send("Yo comeon, dude, forreal, zomygoood")
})
var server = app.listen(process.env.PORT,function(){
	console.log("Running react app on " + ip.address() + ":" + process.env.PORT);
})