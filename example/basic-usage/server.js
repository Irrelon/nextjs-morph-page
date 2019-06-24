const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

app.prepare().then(() => {
	const server = express();
	
	server.use(cookieParser());
	server.use(compression());
	
	server.get('/', (req, res) => {
		const queryData =  Object.assign({}, req.params, req.query);
		
		return app.render(req, res, "/home", {
			...queryData,
			user: req.user
		});
	});
	
	server.get('/home', (req, res) => {
		const queryData =  Object.assign({}, req.params, req.query);
		
		return app.render(req, res, "/home", {
			...queryData,
			user: req.user
		});
	});
	
	server.get('/place', (req, res) => {
		const queryData =  Object.assign({}, req.params, req.query);
		
		return app.render(req, res, "/place", {
			...queryData,
			user: req.user
		});
	});
	
	server.get('/group', (req, res) => {
		const queryData =  Object.assign({}, req.params, req.query);
		
		return app.render(req, res, "/group", {
			...queryData,
			user: req.user
		});
	});
	
	server.use("/static", express.static('static'));
	
	server.get('*', (req, res) => {
		if (req.originalUrl.indexOf('/_next/') !== 0) {
			console.log('No server route set for', req.originalUrl);
		}
		
		return handle(req, res);
	});
	
	server.listen(3000, (err) => {
		if (err) {
			throw err;
		}
		console.log('> Ready on http://localhost:3000');
	});
});
