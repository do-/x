module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_equipment_cfg_items_queue: 

    function () {

        return this.db.add_vocabularies ({

        	_fields: this.db.model.tables.equipment_cfg_items.columns,

        	next_time: this.pools.equip_timer.get (),

        }, {})

    },
    
////////////////////////////////////////////////////////////////////////////////

select_equipment_cfg_items_queue: 

    async function () {

        this.rq.sort = this.rq.sort || [{field: "ts_created", direction: "asc"}]

        let filter = this.w2ui_filter ()

        let data = await this.db.add_all_cnt ({}, [
        	{equipment_cfg_items: filter},
        	'$equipment_cfg_items_queue ON equipment_cfg_items.uuid = equipment_cfg_items_queue.uuid'
        ])

        return data

    },

}