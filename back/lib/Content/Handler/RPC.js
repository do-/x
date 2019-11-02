const HTTPJsonRpc = require ('../../Ext/Dia/Content/Handler/HTTP/JsonRpc.js')

module.exports = class extends HTTPJsonRpc.Handler {

    constructor (o) {
    	super (o)
    	this.import ((require ('./Base')), ['get_log_banner', 'get_method_name', 'fork'])
    }
    
    parse_http_request_body () {
    
    	super.parse_http_request_body ()

    	if (this.http.request.url == '/ssh_batch/') {
    	
			let rq = this.rq
			
			let id = rq.GUID; if (id == null) throw "-32600 Missing GUID"
			delete rq.GUID
			rq.id = id
        	rq.jsonrpc = "2.0"
			rq.params = {
				request: rq.REQUEST,
				hosts: rq.HOSTS
			}
			rq.method = 'run'

    	}
    	
    }    

    is_transactional () { return false }

}