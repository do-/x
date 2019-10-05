module.exports.create_http_server = function (conf) {

	let pools = conf.pools
	
	const dispatcher = new class {

		constructor () {
			this._back    = require ('./Content/Handler/WebUiBackend.js')
			this._front   = require ('./Content/Handler/WebUiStatic.js')
			this._default = require ('./Content/Handler/RPC.js')
		}

		get_name (url) {
			if (this._front.prototype.is_static (url)) return '_front'
			return url.split ('/').filter (s => s) [0]		
		}	

		get_class (url) {
			return this [this.get_name (url)] || this._default
		}	

	} ()	

    require ('http')
    
        .createServer (
        
            (request, response) => {
            
            	let url = request.url
            	
            	if (url == '/') return response.writeHead (302, {'Location': '/_front'}) + response.end ()
            	            	
				let h = new (dispatcher.get_class (url)) ({conf, pools, http: {request, response}})

				h.run ()
				
            }

        )
        
        .listen (conf.listen, () => darn ('Listening to HTTP at ' + this._connectionKey))

}