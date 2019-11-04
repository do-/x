module.exports = class {

    get_method_name () {
		let rq = this.rq
		if (rq.part)   return 'get_' + rq.part + '_of_' + rq.type
		if (rq.action) return 'do_'  + rq.action + '_' + rq.type
		return (rq.id ? 'get_item_of_' : 'select_') + rq.type
    }

    get_log_banner () {
        return `${this.get_module_name ()}.${this.get_method_name ()} (${this.rq.id}) #${this.uuid}`
    }
    
    async encrypt_password (pasword, salt) {
    	return this.pwd_calc.encrypt (pasword, salt)
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

}