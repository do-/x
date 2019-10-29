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
    	
    	if (this.http.request.url == '/equipment_cfg/') {
    	
			let rq = this.rq						
			
        	if (rq.GUID == null) throw "-32600 Missing GUID"
        	let id = rq.GUID
        	delete rq.GUID
        	        	
        	if (rq.ID_SAP == null) throw "-32600 Missing ID_SAP"
        	let params = {id: rq.ID_SAP}
        	delete rq.ID_SAP        	

        	params.items = Object.values (rq)
        	        	
			rq.id = id
			rq.params = params
        	rq.jsonrpc = "2.0"
			rq.method = 'post'

    	}

    }    

    is_transactional () { return false }
    
    send_out_data (result) {

    	if (this.http.request.url == '/equipment_cfg/') {
			this.send_out_json (200, {
				ID_SAP: this.rq.id,
				GUID: this.uuid,
				response: "ok"
			})
		}
		else {
			super.send_out_data (result)
		}

    }
    
    send_out_error (x) {

    	if (this.http.request.url == '/equipment_cfg/') {
			this.send_out_json (200, {
				response: "format_fail"
			})
		}
		else {
			super.send_out_error (x)
		}
		
    }
    
}