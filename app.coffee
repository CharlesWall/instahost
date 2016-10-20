
module.exports = (options)->
	express = require 'express'
	http = require 'http'
	path = require 'path'
	app = express()

	{port, hostPath} = options

	viewsDir = path.join __dirname, '/views'

	routes = require('./routes')({hostPath})

	app.set 'port', port
	app.set 'views', viewsDir
	app.set 'view engine', 'jade'
	app.use express.logger('dev')
	app.use app.router

	# all environments
	console.log "hosting #{hostPath}"
	# app.use express.static hostPath

	# development only
	app.use express.errorHandler() if 'development' == app.get 'env'

	app.use routes

	http.createServer(app).listen port, ->
		console.log "Express server listening on port #{port}"
