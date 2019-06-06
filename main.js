const express   = require('express');
const helmet    = require('helmet');
const path      = require('path');
const Monolith  = require('./src/monolith.js');
const Ritual    = require('./src/ritual.js');
const Portal    = require('./src/portal.js');
const sacrifice = require('./src/sacrifice.js');
const alter     = require('./src/alter.js');
const log       = require('./src/log.js');

const ports     = { http_port: 3000, https_port: 3443 };
const RootedMonolith = new Monolith({ filepath:	`${__dirname}`, title: 'test', ...sacrifice(path.join(__dirname, 'src', 'dist', 'test.html')) }, true, true);
const VirtualMonolith = new Monolith(RootedMonolith, true); VirtualMonolith.reassign({ body: alter(VirtualMonolith) }, true, true);
const theDance = (req, res) => {
	const isAlpha = (str) => { let pattern = new RegExp(/^[a-z]+$/gi); return (pattern.test(str) && str.length < 24); };
	if (isAlpha(req.body.title)) {
		VirtualMonolith.reassign(req.body);
		RootedMonolith .reassign(req.body, false, true);
		RootedMonolith .write();
		VirtualMonolith.reassign({ body: alter(VirtualMonolith) }, true, true);
		res.status(200).send(VirtualMonolith.payload);
	} else { log('You may only assign an alphabetic path/filename.', 'red'); res.end(); };
};
const theUninitiated = new Ritual(
	[
		{ path: '/', 	page: VirtualMonolith, post: [ express.urlencoded({extended: false}), theDance ] },
		{ path: '/sanity', 	 page: RootedMonolith.payload },
		{ path: '/*', 		 page: 'nothing here bud' }
	], express.Router(), ports.https_port
);
let client = express();
client.use(
	helmet(),
	helmet.permittedCrossDomainPolicies(),
	helmet.noCache(),
	helmet.referrerPolicy(),
	(req, res, next) => { theUninitiated.ritual(req, res, next); }
);
Portal(client, ports);
