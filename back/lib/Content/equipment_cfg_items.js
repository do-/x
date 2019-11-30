const Dia = require ('../Ext/Dia/Dia.js')
const Client = require ('ssh2').Client

module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_equipment_cfg_items: 

    function () {

        return this.db.add_vocabularies ({_fields: this.db.model.tables.equipment_cfg_items.columns}, {
        })

    },
    
////////////////////////////////////////////////////////////////////////////////

select_equipment_cfg_items: 

    async function () {

        this.rq.sort = this.rq.sort || [{field: "ts_created", direction: "asc"}]

        let filter = this.w2ui_filter ()

		filter.id_cfg = this.rq.data.id_cfg

        let data = await this.db.add_all_cnt ({}, [
        	{equipment_cfg_items: filter},
        	'equipment_cfg_items_queue ON equipment_cfg_items.uuid = equipment_cfg_items_queue.uuid'
        ])

        return data

    },

////////////////////////////////////////////////////////////////////////////////

do_send_equipment_cfg_items: 

    async function () {
    
    	try {
        	    	
			await this.fork ({action: 'call', type: 'cmdb_service'}, {

				url: 'cf_url',

				body: this.rq.item,

				log: {

					table: 'equipment_cfg_items',

					id: this.rq.id,

					fields: {
						ts_start:  'ts_start',
						ts_finish: 'ts_finish',  
						ts_error:  'ts_error', 
						error:     'error',  					
					}

				}

			})
		
		}
		catch (e) {
			darn (e)
		}
	
	}

}