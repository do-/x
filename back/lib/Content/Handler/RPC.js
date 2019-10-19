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
darn (rq)			
    	}
    	
    	if (this.http.request.url == '/equipment_cfg/') {
    	
			let rq = this.rq
			
			let ID = rq.ID; if (ID == null) throw "-32600 Missing ID"
			
        	if (ID.GUID == null) throw "-32600 Missing ID/GUID"
        	if (ID.ID_SAP == null) throw "-32600 Missing ID/ID_SAP"
        	
        	delete rq.ID
        	
        	let items = []; for (let k in rq) if (k != 'ID') {
        		let item = rq [k]
        		if (k != item.ID_FULL) throw `#${k}#:ID_FULL mismatch`
        		items.push (item)
        	}

        	rq.id = ID.GUID
        	rq.jsonrpc = "2.0"
			rq.params = {items, id: ID.ID_SAP}
			rq.method = 'post'

    	}

    }    

    is_transactional () { return false }

}