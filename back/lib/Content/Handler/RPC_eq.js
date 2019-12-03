module.exports = class extends require ('./RPC.js') {
    
    get_session () {
    	return new (require ('./HTTP/EqSession.js')) (this)
    }

    parse_http_request_body () {
    
    	super.parse_http_request_body ()

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

    is_transactional () { return false }
    
    send_out_data (result) {

		this.send_out_json (200, {
			ID_SAP: this.rq.id,
			GUID: this.uuid,
			response: "ok"
		})

    }
    
    send_out_error (x) {

    	if (x == 401) return this.send_out_text ("401")
    	if (x == 403) return this.send_out_text ("403")

 		darn (x)

		this.send_out_json (200, {response: "format_fail"})

    }
    
}