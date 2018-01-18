var React = require('react')
var createClass = require('create-react-class')
var MasterLayout = createClass({
	render: function(){
		return (
			<html lang="en">
				<head>
					<title>{this.props.name}</title>
					<link rel="stylesheet" href="css/main.css"/>
					<script src="http://localhost:35729/livereload.js"></script>
				</head>
				<body>
					{this.props.children}
				</body>
			</html>
		)
	}
})
module.exports = MasterLayout
