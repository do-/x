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

            async start () {
            
                super.start ()
                
                await this.h.db.do ("DELETE FROM sessions WHERE id_user = ?", [this.user.uuid])

                return this.h.db.insert ('sessions', {
                    id_user       : this.user.uuid,
                    ts            : new Date (),
                    uuid          : this.id,                    
                })
                
            }
            
            async finish () {            
                super.finish ()                
                return this.h.db.do ('DELETE FROM sessions WHERE uuid = ?', [this.old_id])
            }
            
            restrict_access () {
                let rq = this.h.rq
                if (rq.type != 'sessions' && rq.action != 'create') throw '401 Authenticate first'
                return undefined
            }
            
            keep_alive () {            
                setImmediate (() => 
                    this.h.db.do ('UPDATE sessions SET ts = ? WHERE uuid = ?', [new Date (), this.id])
                )
            }

            async get_user () {

                if (!this.id) return this.restrict_access ()
                
                let ts = new Date ()
                ts.setMinutes (ts.getMinutes () - this.o.timeout - 1)

                let r = await this.h.db.get ([                
                    {sessions: {
                        uuid:    this.id,
                        'ts >=': ts,
                    }},
                    {'$users (uuid, label)': {is_deleted: 0}}, 
                    'roles (name)'
                ])

                if (!r.uuid) return this.restrict_access ()
                
                this.keep_alive ()

                return {
                    uuid: r ['users.uuid'], 
                    label: r ['users.label'], 
                    role: r ['roles.name']
                }

            }
            
            async password_hash (salt, password) {
            
                const fs     = require ('fs')
                const crypto = require ('crypto')
                const hash   = crypto.createHash ('sha256')
                const input  = fs.createReadStream (this.h.conf.auth.salt_file)

                return new Promise ((resolve, reject) => {

                    input.on ('error', reject)

                    input.on ('end', () => {
                        hash.update (String (salt))
                        hash.update (String (password), 'utf8')
                        resolve (hash.digest ('hex'))
                    })

                    input.pipe (hash, {end: false})

                })

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

				let root = request.url.split ('/').filter (s => s) [0]; 
				
				if (root == conf.static.prefix) root = '_front'

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

		let url = rq.url

		let pre = this.conf.static.prefix

		rq.url = url.substr (1, pre.length) == pre ? url.replace (pre, '_') : '/index.html'

	}

}