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

        this.rq.sort = this.rq.sort || [{field: "ts_start", direction: "asc"}]

        let filter = this.w2ui_filter ()

		filter.id_cfg = this.rq.data.id_cfg

        let data = await this.db.add_all_cnt ({}, [{equipment_cfg_items: filter}])

        return data

    },

}