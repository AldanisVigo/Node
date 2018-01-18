var express = require('express')
var router = express.Router()
router.get('/', function(req,res){
	res.render('index',{
		name: "React/Node/Gulp/Saas Boilerplate"
	})
})
module.exports = router