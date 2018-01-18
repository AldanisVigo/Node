var React = require('react')
var createClass = require('create-react-class')
var MasterLayout = require('./layout/master')


var SampleComponent = createClass({
	render: function(){
		return (
			<MasterLayout name={this.props.name}>
				<div>
					<h1>React/Node/Gulp/Sass Boilerplate</h1>
					<p>
						<ul>
							<li>
								To use live reload on Chrome download the <a href="https://chrome.google.com/webstore/detail/remotelivereload/jlppknnillhjgiengoigajegdpieppei">RemoteLiveReload</a> or <a href="https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei">LiveReload Official</a> extension.
							</li>
							<li>
								Once you visit this page with the LiveReload/RemoteLiveReload extension installed on Chrome you should see the dot in the center of the icon filled in as so:<br/><br/><br/>
								<img src="img/live_reload.png"/> ← LiveReload Extension or<br/>
								<img src="img/live_reload_remote.png"/> ← RemoteLiveReload Extension <br/><br/><br/>
								If your icon looks like that, then you are all set up and ready to go.<br/><br/><br/>
							</li>
							<li>
								All react components should be surrounded by the &lt;MasterLayout&gt; react component because that component adds the LiveReload script to the &lt;head&gt; tag of the page.
							</li>
							<li>
								Once you make changes  to the JSX or SCSS files, Gulp will reload the page so the changes will take effect automatically. Enjoy!
							</li>
							<li>
								If you make a mistake in the JSX file and an error is displayed on the page, you have to manually reload the page once again once the error is corrected and the LiveReload functionality will be restored.
							</li>
							<li>
								Grunt will automatically compile SASS stylesheets and process them so that the effects will be seen immediately.
							</li>
							<li>
								<h3>Be Awesome, Make a beautiful app!</h3>
							</li>
						</ul>
					</p>
				</div>
			</MasterLayout>
		)
	}
})
module.exports = SampleComponent
