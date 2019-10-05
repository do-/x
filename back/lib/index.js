const conf  = new (require ('./Config.js'));       
const pools = conf.pools

const dispatcher = new class {

	constructor () {
	
		this.h = {
			_back  : require ('./Content/Handler/WebUiBackend.js'),
			_front : require ('./Content/Handler/WebUiStatic.js'),
			_rpc   : require ('./Content/Handler/RPC.js'),
		}
		
		this.constructor.prototype.is_static = this.h._front.prototype.is_static
		
	}

	get_handler_class (url) {
	
		let name = this.is_static (url) ? '_front' : url.split ('/').filter (s => s) [0]
		
		return this.h [name] || this.h._rpc
		
	}

} ()	

require ('http').createServer ((request, response) => {

	let url = request.url; if (url == '/') return response.writeHead (302, {'Location': '/_front'}) + response.end ()

	let h = new (dispatcher.get_handler_class (url)) ({conf, pools, http: {request, response}})

	h.run ()

}).listen (conf.listen, () => darn ('Listening to HTTP at ' + this._connectionKey))

