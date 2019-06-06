const http 	= require('http');
const https = require('https');
const Log   = require('./log.js');
const creds = require('../creds/creds.js')();

module.exports = (expressClient, ports = { http_port: 3000, https_port: 3443, db_port: 27017 }) => {
	const httpServer  = http.createServer (expressClient);
	const httpsServer = https.createServer(creds, expressClient);
	const announce 	  = (port) => { Log(`accepting requests on port: ${port}`, 'blue'); };
	httpServer .listen(ports.http_port,  () => { announce(ports.http_port);  });
	httpsServer.listen(ports.https_port, () => { announce(ports.https_port); });
};

// Insert DB of choice, or just remove this
// const mongoose = require('mongoose');
// mongoose.connect(
// 	`mongodb://localhost:${ports.db_port}/testdb`,
// 	{ useNewUrlParser: true, useCreateIndex: true },
// 	(e) => { Log(!!e ? e : `database online on port: ${db_port}`, 'blue') } // TODO
// );
