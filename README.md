# List of Node Examples

## 1. Node Canvas Windows System Mockup 
- This example shows the basics of working with canvas object. A minimal window system like mechanism.

***

## 2. VigoChat
- This example shows the use of WebSockets in a multiuser realtime chat with the ability to private message. The application was optimized for use with Heroku. To deploy this example application to Heroku do the following steps:

a. Clone the repository and navigate to the Node folder. 

`git clone https://github.com/AldanisVigo/Node.git`<br>
`cd Node`

b. Delete the .git folder by doing:

`rm -rf .git`

c. Create a new repo with 

`git init`<br>
`git add .`<br>
`git commit -m "First Commit"`<br>
`

d. Go into the vigochat directory

`cd vigochat`

e. Create a heroku app with:

`heroku create` <br>
`git push heroku master`

And finally open the app with:
`heroku open`

If you'd like to see a live demo: [Demo](https://vigochat.herokuapp.com)
