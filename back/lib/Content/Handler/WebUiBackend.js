const Dia = require ('../../Ext/Dia/Dia.js')

module.exports = class extends Dia.HTTP.Handler {

    constructor (o) {
    	super (o)
    	this.import ((require ('./Base')), ['get_log_banner', 'get_method_name', 'fork'])
    }
    
    check () {
        super.check ()
        let m = this.http.request.method
        if (m != 'POST') throw '405 No ' + m + 's please'
    }

    get_session () {

    	let h = this

    	return new (require ('../../Ext/Dia/Content/Handler/HTTP/Session/CachedCookieSession.js')) (h, {
    		sessions:    h.pools.sessions,
    		cookie_name: h.conf.auth.sessions.cookie_name || 'sid',
    	})

    }
    
    is_anonymous () {
        return this.rq.type == 'sessions' && this.rq.action == 'create'
    }
    
    w2ui_filter () {
        return new (require ('../../Ext/Dia/Content/Handler/HTTP/Ext/w2ui/Filter.js')) (this.rq)
    }

}