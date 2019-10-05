const handler = {
	_back:    require ('./Content/Handler/WebUiBackend.js'),
	_front:   require ('./Content/Handler/WebUiStatic.js'),
	_default: require ('./Content/Handler/RPC.js'),
}

module.exports.create_http_server = function (conf) {

	let pools = conf.pools

    require ('http')
    
        .createServer (
        
            (request, response) => {
            
            	let url = request.url
            	
            	if (url == '/') return response.writeHead (302, {'Location': '/_front'}) + response.end ()
            	
            	let root = (() => {
            		
            		if (url == '/favicon.ico') return '_front'

					let root = request.url.split ('/').filter (s => s) [0]; 
					
					if (url.charAt (1) == '_' && url.charAt (2) == '_') return '_front'
					
					return root

            	})();

				let h = new (handler [root] || handler._default) ({conf, pools, http: {request, response}})

				h.run ()
				
            }

        )
        
        .listen (conf.listen, () => darn ('Listening to HTTP at ' + this._connectionKey))

}