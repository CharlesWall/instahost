#!/usr/bin/env node
require('coffee-script/register');

options = {
	port: 3000,
	hostPath: '.'
}

for(var i = 0; i < process.argv.length; i++){
	var arg = process.argv[i];
	switch(arg){
		case '-p':
			options.port = process.argv[++i]
			break;
		default:
			options.hostPath = arg
			break;
	}
}

require('./app')(options);
