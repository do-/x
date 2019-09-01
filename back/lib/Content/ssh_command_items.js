const Dia = require ('../Ext/Dia/Dia.js')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_ssh_command_items: 

    function () {

        return this.db.add_vocabularies ({_fields: this.db.model.tables.ssh_command_items.columns}, {
        })

    },
    
////////////////////////////////////////////////////////////////////////////////

select_ssh_command_items: 
    
    function () {
   
        this.rq.sort = this.rq.sort || [{field: "ssh_hosts.host", direction: "asc"}]
    
        let filter = this.w2ui_filter ()
        
        return this.db.add_all_cnt ({}, [{ssh_command_items: filter}
        	, 'ssh_hosts(host)'
        ])

    },
/*
////////////////////////////////////////////////////////////////////////////////
    
get_item_of_ssh_command_items: 

    async function () {
        
        let data = await this.db.get ([{ssh_command_items: 

            {uuid: this.rq.id},

        }])
        
        data._fields = this.db.model.tables.ssh_command_items.columns
        
        return data

    },

////////////////////////////////////////////////////////////////////////////////

do_delete_ssh_command_items: 

    async function () {
    
        this.db.update ('ssh_command_items', {
            uuid        : this.rq.id, 
            is_deleted  : 1, 
        })

    },

*/
}