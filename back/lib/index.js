const conf  = new (require ('./Config.js'));       
const pools = conf.pools

const dispatcher = new class {

	constructor () {
	
		this.for = {
			_back  : require ('./Content/Handler/WebUiBackend.js'),
			_front : require ('./Content/Handler/WebUiStatic.js'),
			_rpc   : require ('./Content/Handler/RPC.js'),
		}
		
		this.constructor.prototype.is_static = this.for._front.prototype.is_static
		
	}
	
	route (request, response) {
	
		let url = request.url; if (url == '/') return response.writeHead (302, {'Location': '/_front'}) + response.end ()
		
		let root = this.is_static (url) ? '_front' : url.split ('/').filter (s => s) [0]
		
		let handler = this.for [root] || this.for._rpc
		
		let instance = new handler ({conf, pools, http: {request, response}})
		
		instance.run ()

	}

} ();

(async () => {

	try {
		await conf.init ()
	}
	catch (e) {
		return darn (['Failed to initialize', e])
	}

	require ('http')
		.createServer ((q, p) => dispatcher.route (q, p))
		.listen       (conf.listen, function () {darn ('Listening to HTTP at ' + this._connectionKey)})

}) ()
