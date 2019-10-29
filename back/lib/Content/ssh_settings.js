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
			data.shop_salt = await this.fork ({type: 'users', action: 'encrypt_password'}, {salt: Math.random (), password: new Date ().toJSON ()})
			data.shop_pass = await this.fork ({type: 'users', action: 'encrypt_password'}, {salt: data.shop_salt, password: data.shop_pass})
        }
        else {
        	delete data.shop_pass
        }
        
        return this.db.update ('ssh_settings', data)

    },

}