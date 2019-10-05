const Dia = require ('./Ext/Dia/Dia.js')
const HTTPJsonRpc = require ('./Ext/Dia/Content/Handler/HTTP/JsonRpc.js')
const HTTPStatic = require ('./Ext/Dia/Content/Handler/HTTP/Static.js')
const CachedCookieSession = require ('./Ext/Dia/Content/Handler/HTTP/Session/CachedCookieSession.js')

const Async_handler = require ('./Content/Handler/Async.js') 

let handler = {}

handler._back = class extends Dia.HTTP.Handler {

    constructor (o) {
    	super (o)
    	this.import (Async_handler, ['get_method_name', 'fork'])
    }

    check () {
        super.check ()
        let m = this.http.request.method
        if (m != 'POST') throw '405 No ' + m + 's please'
    }

    get_session () {

    	let h = this

    	return new CachedCookieSession (h, {
    		sessions:    h.pools.sessions,
    		cookie_name: h.conf.auth.sessions.cookie_name || 'sid',
    	})

    }
    
    is_anonymous () {
        return this.rq.type == 'sessions' && this.rq.action == 'create'
    }
    
    w2ui_filter () {
        return new (require ('./Ext/DiaW2ui/Filter.js')) (this.rq)
    }
    	
}

function http_listener (conf) {

    (request, response) => {new HTTP_handler ({
        conf, 
        pools: {db: conf.pools.db}, 
        http: {request, response}}
    ).run ()}

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

//					if (root == conf.static.prefix) return '_front'
					
					return root

            	})();

				let h = new (handler [root] || handler._default) ({conf, pools, http: {request, response}})

				h.run ()
				
            }

        )
        
        .listen (
        
            conf.listen, 
            
            function () {
                darn ('default app is listening to HTTP at ' + this._connectionKey)
            }
        
        )

}

handler._default = class extends HTTPJsonRpc.Handler {

    constructor (o) {
    	super (o)
    	this.import (Async_handler, ['get_method_name', 'fork'])
    }

    is_transactional () { return false }

    get_log_banner () {
        return `${this.get_module_name ()}.${this.get_method_name ()} (${this.rq.id}) #${this.uuid}`
    }
    
}

handler._front = class extends HTTPStatic.Handler {

	check_params () {

		let rq = this.http.request

		rq.url = (url => {
		
			if (url == '/favicon.ico') return '/_mandatory_content/favicon.ico'

//			let pre = this.conf.static.prefix; if (url.substr (1, pre.length) == pre) return url.replace (pre, '_')

			if (url.charAt (1) == '_' && url.charAt (2) == '_') {
				let parts = url.substr (1).split ('/')
				parts [0] = '_'
				return '/' + parts.join ('/')
			}

			return '/index.html'

		}) (rq.url)

	}

}