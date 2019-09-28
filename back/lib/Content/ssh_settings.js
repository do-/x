const Dia = require ('../Ext/Dia/Dia.js')

module.exports = {
    
////////////////////////////////////////////////////////////////////////////////
    
get_item_of_ssh_settings: 

    async function () {
        
        let data = await this.db.get ([{ssh_settings: {id: 1}}])
        
        data._fields = this.db.model.tables.ssh_settings.columns
        
        return data

    },
        
////////////////////////////////////////////////////////////////////////////////

do_update_ssh_settings: 

    async function () {
    
        let data = this.rq.data
        
        data.id = 1
        
        return this.db.update ('ssh_settings', data)

    },

}