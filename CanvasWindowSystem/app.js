var express = require('express');
var bodyParser = require('body-parser');
var $ = require('jquery');
var path = require('path');
var app = express();
//Express Middleware For Static Pages
app.use(express.static(path.join(__dirname, 'public')));

//bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
})); 

//Express route for /
app.get('/', function (req, res){
	res.render('index');
});
app.listen(3000);