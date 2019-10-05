const HTTPStatic = require ('../../Ext/Dia/Content/Handler/HTTP/Static.js')

module.exports = class extends HTTPStatic.Handler {

	rewrite (url) {
	
		if (url == '/favicon.ico') return '/_mandatory_content/favicon.ico'
		
		if (/^\/__/.test (url)) return '/_/' + url.substr (1).split ('/').slice (1).join ('/')
		
		return '/index.html'
	
	}
    
	check_params () {

		let rq = this.http.request

		rq.url = this.rewrite (rq.url)

	}

}