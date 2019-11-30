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
        
        await this.db.update ('equipment_cfg_schedule', data)
        
		this.fork ({action: 'load'}, {})

    },

////////////////////////////////////////////////////////////////////////////////

do_load_equipment_cfg_schedule: 

    async function () {
    
        let sch = await this.db.get ([{equipment_cfg_schedule: {id: 1}}])

		let dd  = (n)    => (n < 10 ? '0' : '') + n
		let hms = (h, m) => dd (h) + ':' + dd (m) + ':00'
        
        this.pools.equip_timer.from_to (hms (sch.hh_from, sch.mm_from), hms (sch.hh_to, sch.mm_to))

        this.pools.equip_timer.next ()

        return 1

    },

////////////////////////////////////////////////////////////////////////////////

do_check_equipment_cfg_schedule: 

    async function () {
    
        let sch = await this.db.get ([{equipment_cfg_schedule: {id: 1}}])
darn (sch)        
        if (sch.fq == 0) {
        	darn ('The frequency is set to 0, bailing out')
        	return
        }
        
        this.pools.equip_timer.next ()

        return 1

    },

}