const Log = require('./log.js');

class Ritual
{
	constructor(
		pages = [
			{ path: '/',  page: 'Hello World' },
			{ path: '/*', page: '404 Page Not Found' }
		],
		router = express.Router(),
		redirect_port = false
	) {
		this.pages = pages;
		for (let pageIndex = 0; pageIndex < this.pages.length; pageIndex++) {
			// For each of the api's we handle their keys to represent express.Router's
			let {
				path	= '',
				page	= '',
				get			= null,
				post		= null,
				update	= null,
				remove	= null
			} = this.pages[pageIndex];
			// By default present the Monolith's payload as page
			let devGet	= (req, res, next) => { res.status(200).send(page.payload || page); };
			// For CRUD they will log an illegal access attempt
			let devLog	= (req, res, next) => { Log('Route not implimented.', 'red'); };
			// By default we want all traffic on https
			let redirect	= (req, res, next) => {
				req.secure ? next() : res.redirect(`https://${req.hostname}${
					typeof redirect_port === 'number' ? ':' + redirect_port : ''
					}${req.url}`)
			};
			// Establish the routes with the redirect middleware
			router.get   (path, redirect,	get    || devGet);
			router.post  (path, redirect,	post   || devLog);
			router.put   (path, redirect,	update || devLog);
			router.delete(path, redirect, remove || devLog);
		}
		// Set the router as ritual so it can be later over written by an authenticated admin
		this.ritual = router;
	};
	// TODO: Clone and Update methods
};

module.exports = Ritual;
