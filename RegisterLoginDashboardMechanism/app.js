//Required modules
var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var validator = require('validator')
var fs = require('fs')
var ursa = require('ursa')
var session = require('express-session')
var dotenv = require('dotenv').config()
var crypto = require('crypto')
var pg = require('pg')
// pg.types.setTypeParser(1114, function(stringValue) {
//     console.log(stringValue);
//     return new Date(Date.parse(stringValue + "+0000"));
// })
//const { Client } = require('pg')

var app = express()

//Global Variables
app.use((req,res,next)=>{
	res.locals.errors = null
	res.locals.user = null
	next()
})

//express-session Middleware
app.use(session({
	secret:'supasecretkey',
	cookieName: 'login-session',
	saveUninitialized: true,
	resave: true,
	cookie: {
		maxAge: 5 * 60 * 60 * 1000,
		secure: false
	}
}))

//EJS Middleware
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//body-parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: false
}))

//set static path
app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "registration/success/js/jsencrypt/jsencrypt.js")))


//Routes
//Root route
app.get('/', (req,res)=>{
	//res.send("Hello World")
	var requestedView = req.query.view
	if(requestedView == 'login'){
		var email = req.query.email
		var success = req.query.msg
		res.render("login",{
			email: email,
			success: success,
			view: 'login'
		})
	}else if(requestedView == 'dashboard'){
		res.render("dashboard",{
			email: req.session.email,
			expires: req.session.expiration,
			sessionToken: req.session.sessionToken,
			view: 'dashboard'
		})
	}else{
		//By default send to the register route
		res.render('register',{
			view: 'register'
		})
	}
})

// //Registration view route
// app.get('/register', (req,res)=>{
// 	res.render('register')
// })

//Registration process route
app.post('/process/registration', (req,res)=>{
	console.log("Processing Registration Request")

	//Retrieve the new user information
	var newUserInformation = {
		fname: 			req.body.fname,
		lname: 			req.body.lname,
		email: 			req.body.email,
		emailconf: 		req.body.emailconf,
		password:    	req.body.password,
		passwordconf: 	req.body.passwordconf
	}

	//Decrypt the incoming register form data
	//Load the private rsa key from the rsa folder
	var key = ursa.createPrivateKey(fs.readFileSync('./rsa/rsa_1024_priv.pem'))
	
	//Log the encrypted version of the first name
	console.log("Encrypted First Name:\n" + newUserInformation.fname + "\n\n")
	//Decrypt it using the private rsa key
	newUserInformation.fname = key.decrypt(newUserInformation.fname, 'base64', 'utf8', ursa.RSA_PKCS1_PADDING)
	
	//Log the encrypted version of the last name
	console.log("Encrypted Last Name:\n" + newUserInformation.lname + "\n\n")
	//Decrypt it
	newUserInformation.lname = key.decrypt(newUserInformation.lname, 'base64', 'utf8', ursa.RSA_PKCS1_PADDING)
	
	//Log the encrypted version of the email
	console.log("Encrypted Email:\n" + newUserInformation.email + "\n\n")
	//Decrypt it
	newUserInformation.email = key.decrypt(newUserInformation.email, 'base64', 'utf8', ursa.RSA_PKCS1_PADDING)

	//Log the encrypted version of the email confirmation
	console.log("Encrypted Email Confirmation:\n" + newUserInformation.emailconf + "\n\n")
	//Decrypt it
	newUserInformation.emailconf = key.decrypt(newUserInformation.emailconf, 'base64', 'utf8', ursa.RSA_PKCS1_PADDING)

	//Log the encrypted version of the password
	console.log("Encrypted Password:\n" + newUserInformation.password + "\n\n")
	//Decrypt it
	newUserInformation.password = key.decrypt(newUserInformation.password, 'base64', 'utf8', ursa.RSA_PKCS1_PADDING)

	//Log the encrypted version of the password confirmation
	console.log("Encrypted Password Confirmation:\n" + newUserInformation.passwordconf + "\n\n")
	//Decrypt it
	newUserInformation.passwordconf = key.decrypt(newUserInformation.passwordconf, 'base64', 'utf8', ursa.RSA_PKCS1_PADDING)

	//Log the decrypted version of the first name
	console.log("Decrypted First Name:\n" + newUserInformation.fname + "\n\n")
	//Log the decrypted version of the last name
	console.log("Decrypted Last Name:\n" + newUserInformation.lname + "\n\n")
	//Log the decrypted version of the email
	console.log("Decrypted Email:\n" + newUserInformation.email + "\n\n")
	//Log the decrypted version of the email confirmation
	console.log("Decrypted Email Confirmation:\n" + newUserInformation.emailconf + "\n\n")
	//Log the decrypted version of the password
	console.log("Decrypted Password:\n" + newUserInformation.password + "\n\n")
	//Log the decrypted version of the password confirmation
	console.log("Decrypted Password Confirmation:\n" + newUserInformation.passwordconf + "\n\n")


	//Validator checks
	var errors = []
	//Validate that the first name is not empty
	if(validator.isEmpty(newUserInformation.fname)){
		errors.push("First name is required")
	}
	//Validate that the last name is not empty
	if(validator.isEmpty(newUserInformation.lname)){
		errors.push("Last name is required")
	}
	//Validate that the email is a valid email and that it's not empty
	if(validator.isEmpty(newUserInformation.email)){
		errors.push("Email is required")
	}
	if(!validator.isEmail(newUserInformation.email,{ 
		allow_display_name: false, 
		require_display_name: false, 
		allow_utf8_local_part: true, 
		require_tld: true 
	})){
		errors.push("The email provided is not a valid email")
	}
	/*
		Check that the email confirmation is not empty,
		that it's a valid email,
		and that it matches the email field
	*/
	if(validator.isEmpty(newUserInformation.emailconf)){
		errors.push("The email confirmation is required")
	}
	if(!validator.isEmail(newUserInformation.emailconf,{ 
		allow_display_name: false, 
		require_display_name: false, 
		allow_utf8_local_part: true, 
		require_tld: true 
	})){
		errors.push("The email confirmation is not a valid email")
	}
	if(!validator.equals(newUserInformation.emailconf,newUserInformation.email)){
		errors.push("The email and email confirmation don't match")
	}
	//Validate that the password is not empty
	if(validator.isEmpty(newUserInformation.password)){
		errors.push("The password is required")
	}
	/*
		Check that the password confirmation is not empty,
		and that it matches the password field
	*/
	if(validator.isEmpty(newUserInformation.passwordconf)){
		errors.push("The password confirmation is required")
	}
	if(!validator.equals(newUserInformation.passwordconf,newUserInformation.password)){
		errors.push("The password and password confirmation don't match")
	}


	//Retrieve the validation errors
	if(errors.length > 0){
		console.log("Errors Found")
		console.log(errors)
		res.render('register', {
			errors: errors,
			user: newUserInformation
		})
	}else{
		console.log("===> User information validated, registering..")
		console.log("===> Hashing the password with SHA256..")
		var password = newUserInformation.password;
		newUserInformation.password = crypto.createHash('sha256').update(newUserInformation.password).digest('hex')
		console.log("===> Hashed Password:")
		console.log(newUserInformation.password)
		//Connect the client to the database
		//Create a PostgreSQL Client
		console.log("Connection String:" + process.env.DATABASE_URL)
		var postgresql_client = new pg.Client({
			connectionString: process.env.DATABASE_URL,
			ssl: true
		})
		postgresql_client.connect((err)=>{
			if(err){
				throw err
			}else{
				var query = "INSERT INTO users(fname,lname,email,password) VALUES('" + newUserInformation.fname + "','" + newUserInformation.lname + "','" + newUserInformation.email + "','" + newUserInformation.password + "');"
				//Insert the user information into the db
				postgresql_client.query(query, 
					(err)=>{
						if(err){
							throw err
						}else{
							//Render the success route
							var msg = "You have successfully registered. Please login to your new account."
							res.json({redirect: '/?view=login&email=' + newUserInformation.email + "&msg=" + msg})
						}
						postgresql_client.end()
					}
				)
			}
		})
		//postgresql_client.end()
		console.log("===> Added user to database.")
	}
})

function generateNonce(email,postgresql_client){
	//Generate and save nonce
	var nonceLength = 10
	var nonceValue = (nonceLength)=>{
		var generatedNonce = ""
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
		do{
			generatedNonce += possible.charAt(Math.floor(Math.random() * possible.length))
		}while(--nonceLength != 0)
		return generatedNonce
	}

	//Generate a new nonce
	var myNonce = nonceValue(nonceLength)
	var HoursOfExpiration = 5;
	var dateTime = "CURRENT_TIMESTAMP + interval '" + HoursOfExpiration + " hours'"
	var query = "INSERT INTO nonces(nonce,email,expires) VALUES('" + myNonce + "','" + email + "'," + dateTime + ");" 
	var timeStamp = new Date()
	timeStamp.setHours(timeStamp.getHours() + HoursOfExpiration)

	postgresql_client.query(query,(queryerr)=>{
		if(queryerr){
			throw queryerr
		}else{
			console.log("\n\n====CREATING/STORING A NEW SESSION KEY NONCE====")
			console.log("Nonce:" + myNonce)
			console.log("Expires:" + timeStamp)
			console.log("Associated User Email:" + email + "\n\n")
			postgresql_client.end();
		}
	})
	return {
		nonce: myNonce,
		expires: timeStamp
	}
}
//Route to process logout requests
app.post('/process/logout', (req, res)=>{
	req.session.destroy();
	res.json({
		redirect: '/?view=login'
	})
})
//Route to process login requests
app.post('/process/login', (req,res)=>{
	//Retrieve the encrypted email and password
	var email = req.body.email
	var password = req.body.password
	//Load the private rsa key from the rsa folder
	var key = ursa.createPrivateKey(fs.readFileSync('./rsa/rsa_1024_priv.pem'))
	//Log the encrypted version of the email
	console.log("Encrypted Email:\n" + email + "\n\n")
	//Decrypt it using the private rsa key
	var decrypted_email = key.decrypt(email, 'base64', 'utf8', ursa.RSA_PKCS1_PADDING)
	//Log the encrypted version of the password
	console.log("Encrypted Password:\n" + password + "\n\n")
	//Decrypt it
	var decrypted_password = key.decrypt(password, 'base64', 'utf8', ursa.RSA_PKCS1_PADDING)
	//Log the decrypted version of the email
	console.log("Decrypted Email:\n" + decrypted_email + "\n\n")
	//Log the decrypted version of the password
	console.log("Decrypted Password:\n" + decrypted_password + "\n\n")
	//Hash the password
	var hashedPassword = crypto.createHash('sha256').update(decrypted_password).digest('hex')
	console.log("Hashed Password:\n" + hashedPassword + "\n\n")
	//Pull the user information
	var postgresql_client = new pg.Client({
		connectionString: process.env.DATABASE_URL,
		ssl: true
	})
	postgresql_client.connect((err)=>{
		if(err){
			throw err
		}else{
			//Insert the user information into the db
			postgresql_client.query("SELECT * FROM users WHERE email='" + decrypted_email + "' AND password='" + hashedPassword + "';", 
				(err, result)=>{
					if(err){
						throw err
					}else{
						console.log("While looking for user in DB retrieved " + result.rowCount + " rows.")
						//Get the rowCount
						if(result.rowCount > 0){
							console.log("Found User:" + result.rows[0].fname + " " + result.rows[0].lname)
							console.log("Successfully logged in")
							//Set the session variables
							var myNonce = generateNonce(decrypted_email,postgresql_client)
							req.session.sessionToken = myNonce['nonce']
							req.session.expiration = myNonce['expires']
							console.log("session.expiration=" + req.session.expiration)
							console.log("session.sessionToken=" + req.session.sessionToken)
							req.session.email = decrypted_email
							req.session.password = password
							console.log("Your session token expiration:" + req.session.expiration)
							console.log("Your session cookie expiration:" + ((req.session.cookie.maxAge / 1000) / 60) + " hours")
							res.json({
								msg: "Sucessfully Logged In", 
								redirect: "/?view=dashboard"
							})
						}else{
							console.log("Not logged in")
						}
						//postgresql_client.end()
					}
				}
			)
		}
	})
	//postgresql_client.end();
})

//Launch the server
app.listen(process.env.PORT || 8080, function(){
	console.log('Server started on port 3000')
})
