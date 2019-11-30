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

        this.pools.equip_timer.on ()

        return 1

    },

////////////////////////////////////////////////////////////////////////////////

do_check_equipment_cfg_schedule: 

    async function () {
    
        let sch = await this.db.get ([{equipment_cfg_schedule: {id: 1}}])

        if (sch.fq == 0) return 'The frequency is set to 0, bailing out'
        
        let q = await this.db.add_all_cnt ({}, [{equipment_cfg_items: {ORDER: 'uuid', LIMIT: sch.fq}}
        	, '$equipment_cfg_items_queue ON equipment_cfg_items.uuid = equipment_cfg_items_queue.uuid'
        ])
darn (q)        
        if (q.cnt == 0) return 'The queue is empty, bailing out'
        
        for (let i of q.equipment_cfg_items) {
        	let id = i.uuid
        	let item = JSON.parse (i.json)
        	this.fork0 ({type: 'equipment_cfg_items', action: 'send', id}, {item})
        }
        
        if (q.cnt > sch.fq) {
    	    this.pools.equip_timer.next ()
	        return q.length + 'request(s) sent, more to do'
        }
        else {
	        return 'last' + q.length + 'request(s) sent'
        }

    },

}