const Dia = require ('./Ext/Dia/Dia.js')
const Async = require ('./Ext/Dia/Content/Handler/Async.js')
const HTTPJsonRpc = require ('./Ext/Dia/Content/Handler/HTTP/JsonRpc.js')
const HTTPStatic = require ('./Ext/Dia/Content/Handler/HTTP/Static.js')
const CachedCookieSession = require ('./Ext/Dia/Content/Handler/HTTP/Session/CachedCookieSession.js')

let Async_handler = class extends Async.Handler {

    get_method_name () {
		let rq = this.rq
		if (rq.part)   return 'get_' + rq.part + '_of_' + rq.type
		if (rq.action) return 'do_'  + rq.action + '_' + rq.type
		return (rq.id ? 'get_item_of_' : 'select_') + rq.type
    }

    is_transactional () { return false }

    get_log_banner () {
        return `${this.get_module_name ()}.${this.get_method_name ()} (${this.rq.id}) #${this.uuid}`
    }
    	
	async fork (tia, data, pools) {

		let conf = this.conf
		if (!pools) pools = conf.pools

		let rq = {}

		if (data) for (let k in data) rq [k] = data [k]
		for (let k of ['type', 'id', 'action']) rq [k] = tia [k] || this.rq [k]

		let b = this.get_log_banner ()

		return new Promise (function (resolve, reject) {

			let h = new Async_handler ({conf, rq, pools}, resolve, reject)

			darn (b + ' -> ' + h.get_log_banner ())

			setImmediate (() => h.run ())        

		})

	}
	
	async fork0 (tia, data) {
		return this.fork (tia, data, [])
	}
    
}

let handler = {}

handler._back = class extends Dia.HTTP.Handler {

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

for (let hn of ['_back', '_default']) 
	for (let mn of ['get_method_name', 'fork']) 
		handler [hn].prototype [mn] = Async_handler.prototype [mn]