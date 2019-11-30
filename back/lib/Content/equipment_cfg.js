module.exports = {

////////////////////////////////////////////////////////////////////////////////
    
get_item_of_equipment_cfg: 

    async function () {
        
        let data = await this.db.get ([{equipment_cfgs: 

            {uuid: this.rq.id},

        }])
        
        data._fields = this.db.model.tables.ssh_commands.columns
        
        return data

    },
    
////////////////////////////////////////////////////////////////////////////////

select_equipment_cfg: 
    
    async function () {
   
        this.rq.sort = this.rq.sort || [{field: "ts_created", direction: "desc"}]

        if (this.rq.searchLogic == 'OR') {

            let q = this.rq.search [0].value

            this.rq.search = [
                {field: 'sap_id', operator: 'contains', value: q},
            ]
            
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test (q)) 
            	this.rq.search.push ({field: 'uuid', operator: 'is', value: q})

        }

        let filter = this.w2ui_filter ()
        
        filter.is_deleted = 0

        let data = await this.db.add_all_cnt ({}, [{equipment_cfgs: filter}])
        		
        return data

    },

////////////////////////////////////////////////////////////////////////////////

do_post_equipment_cfg: 

    async function () {

    	let items = this.rq.items
    
        try {
	       	await this.db.insert ('equipment_cfgs', {
	       		uuid:   this.uuid,
				sap_id: this.rq.id,
				json:   JSON.stringify (items),
	       	})
        }
        catch (x) {
            if (this.db.is_pk_violation (x)) return {}
            throw x
        }
        
//        let idx = {}
    
    	for (let item of items) {
    		
    		let ext_id = item.uniq_ID
    	    		
    		item = {x5storeequipment: item}

	       	let uuid = await this.db.insert ('equipment_cfg_items', {				
				ext_id,
				id_cfg: this.uuid,
				json:   JSON.stringify (item),
	       	})

//	       	idx [uuid] = item
	       	
	    }
	    
        this.pools.equip_timer.on ()
	    
	    
//      let s = await this.db.select_hash ('SELECT cf_par FROM ssh_settings WHERE id = 1')

//		this.fork ({action: 'send'}, {idx, par: s.cf_par})
    
    },
    
    
////////////////////////////////////////////////////////////////////////////////
/*
do_send_equipment_cfg: 

    async function () {
    
    	let idx = this.rq.idx    	
    	
    	let ids = Object.keys (idx)
    	
		let par = parseInt (this.rq.par); if (!(par > 0)) throw `#par#:Broken parallelism limit value: ${item.par}`

		let on = 0, task = async (id) => {			
			try {
				await this.fork0 ({type: 'equipment_cfg_items', id}, {item: idx [id]})
			}
			finally {
				on --
			}			
		}
		
		let tasks = []
		
		let watch = null
		
		function terminate () {
		
			if (watch) clearInterval (watch)
								
			watch = null
			
		}
		
		watch = setInterval (function () {
		
			if (!watch) return

			let todo = ids.length

			if (todo == 0 && on == 0) return terminate ()

			let available = par - on
			
			if (todo > available) todo = available
			
			if (todo < 0) todo = 0
			
			if (todo == 0) return
			
			on += todo
			
			tasks = tasks.concat (ids.splice (0, todo).map (task))

		}, 10)
		
	}    
*/
}