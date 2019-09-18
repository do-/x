const Dia = require ('./Ext/Dia/Dia.js')
const Async = require ('./Ext/Dia/Content/Handler/Async.js')
const HTTPJsonRpc = require ('./Ext/Dia/Content/Handler/HTTP/JsonRpc.js')
const HTTPStatic = require ('./Ext/Dia/Content/Handler/HTTP/Static.js')

function get_method_name () {
	let rq = this.rq
	if (rq.part)   return 'get_' + rq.part + '_of_' + rq.type
	if (rq.action) return 'do_'  + rq.action + '_' + rq.type
	return (rq.id ? 'get_item_of_' : 'select_') + rq.type
}

async function fork (tia, data) {

	let conf = this.conf
	let pools = conf.pools

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

let handler = {}

handler._back = class extends Dia.HTTP.Handler {

    check () {
        super.check ()
        let m = this.http.request.method
        if (m != 'POST') throw '405 No ' + m + 's please'
    }
    
    check_params () {
        super.check ()
        let h = this.http.request.headers
        let rq = this.rq
        this.uri = `${h.scheme}://${h.host}/${rq.type}/`
        if (rq.id) this.uri += rq.id
    }

    get_session () {

        return new class extends this.CookieSession {
        
        	time () {
        		return new Date ().getTime ()
        	}
                
            keep_alive () {
            	this.h.sessions.set (this.id, this.user.uuid)
            	return this.user
            }

            async start () {  
                await super.start ()
                this.keep_alive ()
            }
            
            async finish () {            
                await super.finish ()
                this.h.sessions.del (this.id)
            }

            restrict_access () {
            	if (!this.h.is_anonymous ()) throw '401 Authenticate first'
                return undefined
            }
            
            invalidate_user (uuid) {
            	this.h.users.del (uuid)
            }

            async get_user () {

                if (!this.id) return this.h.no_user ()
                
                let uuid = this.h.sessions.get (this.id)

                if (!uuid) {
                	darn (`session ${this.id} not found`)
                	return this.h.no_user ()
                }
                
                this.user = await this.h.users.to_get (uuid, async () => {
                	let r = await this.h.db.get ([{vw_users: {uuid}}])
                	return r.uuid ? r : null
                })
                
                if (!this.user) {
                	darn (`session ${this.id}: valid user ${uuid} not found`)
                	return this.h.no_user ()
                }

                return this.keep_alive ()
                                
            }
            
        } ({
            cookie_name: this.conf.auth.sessions.cookie_name || 'sid',
            timeout: this.conf.auth.sessions.timeout || 10,
        })
        
    }
    
    async get_user () {
        let user = await super.get_user ()
        if (!this.is_transactional () || !user) return user
        await this.db.do ("SELECT set_config ('tasks.id_user', ?, true)", [user.uuid])
        return user
    }
    
    get_method_name () { return get_method_name.apply (this) }

    is_anonymous () {
        return this.rq.type == 'sessions' && this.rq.action == 'create'
    }
    
    w2ui_filter () {
        return new (require ('./Ext/DiaW2ui/Filter.js')) (this.rq)
    }
    
	async fork (tia, rq) {return fork.apply (this, [tia, rq])}
	
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

					if (root == conf.static.prefix) return '_front'
					
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

let Async_handler = class extends Async.Handler {

    get_method_name () { return get_method_name.apply (this) }

    is_transactional () { return false }

    get_log_banner () {
        return `${this.get_module_name ()}.${this.get_method_name ()} (${this.rq.id}) #${this.uuid}`
    }
    
    async fork (tia, rq) {return fork.apply (this, [tia, rq])}

}

handler._default = class extends HTTPJsonRpc.Handler {

    get_method_name () { return get_method_name.apply (this) }

    is_transactional () { return false }

    get_log_banner () {
        return `${this.get_module_name ()}.${this.get_method_name ()} (${this.rq.id}) #${this.uuid}`
    }
    
    async fork (tia, rq) {return fork.apply (this, [tia, rq])}

}

handler._front = class extends HTTPStatic.Handler {

	check_params () {

		let rq = this.http.request

		rq.url = (url => {
		
			if (url == '/favicon.ico') return '/_mandatory_content/favicon.ico'
			
			let pre = this.conf.static.prefix; if (url.substr (1, pre.length) == pre) return url.replace (pre, '_')
			
			return '/index.html'
			
		}) (rq.url)

	}

}