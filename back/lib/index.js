(async () => {

    let conf = new (require ('./Config.js'))
       
	let pools = conf.pools
	
	const dispatcher = new class {

		constructor () {this.h = {
			_back  : require ('./Content/Handler/WebUiBackend.js'),
			_front : require ('./Content/Handler/WebUiStatic.js'),
			_rpc   : require ('./Content/Handler/RPC.js'),
		}}

		get_handler_class (url) {
		
			let name = 
				this.h._front.prototype.is_static (url) ? '_front' : 
				url.split ('/').filter (s => s) [0]                 // /_back/ -> '_back', /_front/ -> '_front'
			
			return this.h [name] || this.h._rpc
			
		}

	} ()	

    require ('http').createServer ((request, response) => {

		let url = request.url
		
		if (url == '/') return response.writeHead (302, {'Location': '/_front'}) + response.end ()

		let h = new (dispatcher.get_handler_class (url)) ({conf, pools, http: {request, response}})

		h.run ()

    }).listen (conf.listen, () => darn ('Listening to HTTP at ' + this._connectionKey))

}) ()
