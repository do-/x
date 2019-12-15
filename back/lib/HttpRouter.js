const c = {
	front:  require ('./Ext/Dia/Content/Handler/HTTP/EluStatic.js'),
	back:   require ('./Content/Handler/WebUiBackend.js'),
	rpc:    require ('./Content/Handler/RPC.js'),
	rpc_eq: require ('./Content/Handler/RPC_eq.js'),
}

module.exports = class extends require ('./Ext/Dia/Content/Handler/HTTP/Router.js') {

	is_static (url) {
		if (url == '/') return true
		if (url == '/favicon.ico') return true
		return url.charAt (1) == '_' && url.charAt (2) == '_'
	}

	is_back (url) {
		if (url.match (/^\/_back/)) return true
		return url.charAt (1) == '?'
	}

	get_key (url) {

		switch (url) {
			case '/ssh_batch/': return 'rpc'
			case '/equipment_cfg/': return 'rpc_eq'
			default: return this.is_back (url) ? 'back' : 'front'
		}

	}

	create_http_handler (http) {
	
		let key = this.get_key (http.request.url)
		
		let clazz = c [key]
		
		if (key == 'front') return new clazz ({http})
		
		let pools = Object.assign ({}, this.conf.pools)

		if (key == 'back') pools.db = this.conf.ui_db_pool

		return new clazz ({conf: this.conf, pools, http})

	}
		
}