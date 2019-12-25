const Async = require ('../../Ext/Dia/Content/Handler/Async.js')

module.exports = class extends Async.Handler {

    constructor (o, resolve, reject) {
    	super (o, resolve, reject)
    	this.import ((require ('./Base')), ['get_log_banner', 'get_method_name', 'fork'])
    }

    is_transactional () { return false }
	
	async fork0 (tia, data) {
		return this.fork (tia, data, [])
	}

	async call_cmdb_service (o) {	
	
		let todo = [this.fork ({action: 'call', type: 'cmdb_service'}, o, {http: this.conf.http [o.url]})]
	
		let http = this.conf.http2 [o.url]; if (http) {
		
			let o2 = clone (o)

			let f = o2.log.fields; for (let k in f) f [k] += '2'
		
			todo.push (this.fork ({action: 'call', type: 'cmdb_service'}, o2, {http}))
		
		}
		
		return Promise.all (todo)
		
	}

}