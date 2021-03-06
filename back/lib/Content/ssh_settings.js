const Dia = require ('../Ext/Dia/Dia.js')
const HTTP = require ('../Ext/Dia/HTTP.js')

module.exports = {
    
////////////////////////////////////////////////////////////////////////////////
    
get_item_of_ssh_settings: 

    async function () {
        
        let data = await this.db.get ([{ssh_settings: {id: 1}}])
        
        delete data.shop_pass
        
        data._fields = this.db.model.tables.ssh_settings.columns
        
        return data

    },
        
////////////////////////////////////////////////////////////////////////////////

do_update_ssh_settings: 

    async function () {
    
        let data = this.rq.data
        
        data.id = 1
        
        if (data.shop_pass != null) {
			data.shop_salt = await this.encrypt_password (new Date ().toJSON ())
			data.shop_pass = await this.encrypt_password (data.shop_pass, data.shop_salt)
        }
        else {
        	delete data.shop_pass
        }
        
        await this.db.update ('ssh_settings', data)

        await this.db.commit ()
        
		await this.fork ({action: 'load'})

    },
    
////////////////////////////////////////////////////////////////////////////////

do_load_ssh_settings: 

    async function () {
    
		let s = this.conf.ssh_settings = await this.db.get ([{ssh_settings: {id: 1}}])
		
		this.conf.http = {}

		let o = {timeout: 100}

		if (s.cb_user) o.auth = s.cb_user + ':' + s.cb_pass

		for (let k of ['cb_url', 'cf_url']) this.conf.http [k] = new HTTP (Object.assign ({url: s [k]}, o))

		this.conf.http2 = {}

		let o2 = {timeout: 100}

		if (s.cb2_user) o2.auth = s.cb2_user + ':' + s.cb2_pass

		for (let k of ['cb2_url', 'cf2_url']) if (s [k]) this.conf.http2 [k.replace (/2/, '')] = new HTTP (Object.assign ({url: s [k]}, o2))

    },

}