const Dia = require ('../Ext/Dia/Dia.js')

module.exports = {
    
////////////////////////////////////////////////////////////////////////////////
    
get_item_of_equipment_cfg_schedule: 

    async function () {
        
        let data = await this.db.get ([{equipment_cfg_schedule: {id: 1}}])
        
        delete data.shop_pass
        
        data._fields = this.db.model.tables.equipment_cfg_schedule.columns
        
        return data

    },
        
////////////////////////////////////////////////////////////////////////////////

do_update_equipment_cfg_schedule: 

    async function () {
    
        let data = this.rq.data
        
        data.id = 1
        
        return this.db.update ('equipment_cfg_schedule', data)

    },

}