const Dia = require ('../Ext/Dia/Dia.js')

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
        
		await this.fork ({action: 'load'})

    },
    
////////////////////////////////////////////////////////////////////////////////

do_load_ssh_settings: 

    async function () {
    
		this.conf.ssh_settings = await this.db.get ([{ssh_settings: {id: 1}}])

darn (this.conf)

    },

}