const Async = require ('../../Ext/Dia/Content/Handler/Async.js')

module.exports = class extends Async.Handler {

    get_method_name () {
		let rq = this.rq
		if (rq.part)   return 'get_' + rq.part + '_of_' + rq.type
		if (rq.action) return 'do_'  + rq.action + '_' + rq.type
		return (rq.id ? 'get_item_of_' : 'select_') + rq.type
    }

    is_transactional () { return false }

    get_log_banner () {
        return `${this.get_module_name ()}.${this.get_method_name ()} (${this.rq.id}) #${this.uuid}`
    }
    	
	async fork (tia, data, pools) {

		let conf = this.conf
		if (!pools) pools = conf.pools

		let rq = {}

		if (data) for (let k in data) rq [k] = data [k]
		for (let k of ['type', 'id', 'action']) rq [k] = tia [k] || this.rq [k]

		let b = this.get_log_banner ()

		return new Promise (function (resolve, reject) {

			let h = new (require ('./Async')) ({conf, rq, pools}, resolve, reject)

			darn (b + ' -> ' + h.get_log_banner ())

			setImmediate (() => h.run ())        

		})

	}
	
	async fork0 (tia, data) {
		return this.fork (tia, data, [])
	}

}