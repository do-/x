module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_post_equipment_cfg: 

    async function () {
    
    	let items = this.rq.items
    
        try {
	       	await this.db.insert ('equipment_cfgs', {
	       		uuid:   this.uuid,
				sap_id: this.id,
				json:   JSON.stringify (items),
	       	})
        }
        catch (x) {
            if (this.db.is_pk_violation (x)) return {}
            throw x
        }
    
    	for (let item of items) {
    	
    		let ext_id = item.ID_FULL
    		delete item.ID_FULL
    		item.ext_id = ext_id
    		
    		item = {X5StoreEquipment: item}

	       	let uuid = await this.db.insert ('equipment_cfg_items', {				
				ext_id,
				id_cfg: this.uuid,
				json:   JSON.stringify (item),
	       	})
darn ({uuid})	       	
			this.fork ({action: 'call', type: 'cmdb_service'}, {

				url: 'cf_url',

				body: item,

				log: {

					table: 'equipment_cfg_items',

					id: uuid,

					fields: {
						ts_start:  'ts_start',
						ts_finish: 'ts_finish',  
						ts_error:  'ts_error', 
						error:     'error',  					
					}

				}

			})

    	}
    
    },

}