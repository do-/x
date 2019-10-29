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
    	
    	let auth = this.http.request.headers.authorization
    	
    	if (!auth) throw 401
    	
    	let [sch, b64] = auth.split (' ')
    	
    	if (sch != 'Basic') throw 401
    	
    	let [user, password] = new Buffer (b64, 'base64').toString ('utf-8').split (':')

        let s = await this.db.select_hash ('SELECT shop_user, shop_salt, shop_pass FROM ssh_settings WHERE id = 1')

		if (user != s.shop_user) throw 401

		let hash = await this.fork ({type: 'users', action: 'encrypt_password'}, {salt: s.shop_salt, password})

		if (s.shop_pass != hash) throw 401

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
    
    	for (let item of items) {
    		
    		let ext_id = item.uniq_ID
    	    		
    		item = {x5storeequipment: item}

	       	let uuid = await this.db.insert ('equipment_cfg_items', {				
				ext_id,
				id_cfg: this.uuid,
				json:   JSON.stringify (item),
	       	})

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