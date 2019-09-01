const Dia = require ('../Ext/Dia/Dia.js')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_ssh_hosts: 

    function () {

        return this.db.add_vocabularies ({_fields: this.db.model.tables.ssh_hosts.columns}, {
        })

    },
    
////////////////////////////////////////////////////////////////////////////////

select_ssh_hosts: 
    
    function () {
   
        this.rq.sort = this.rq.sort || [{field: "host", direction: "asc"}]

        if (this.rq.searchLogic == 'OR') {

            let q = this.rq.search [0].value

            this.rq.search = [
                {field: 'host', operator: 'contains', value: q},
                {field: 'username', operator: 'contains', value: q},
            ]

        }
    
        let filter = this.w2ui_filter ()
        
        filter.is_deleted  = 0

        return this.db.add_all_cnt ({}, [{ssh_hosts: filter}])

    },

////////////////////////////////////////////////////////////////////////////////
    
get_item_of_ssh_hosts: 

    async function () {
        
        let data = await this.db.get ([{ssh_hosts: 

            {uuid: this.rq.id},

        }])
        
        data._fields = this.db.model.tables.ssh_hosts.columns
        
        return data

    },

////////////////////////////////////////////////////////////////////////////////

do_delete_ssh_hosts: 

    async function () {
    
        this.db.update ('ssh_hosts', {
            uuid        : this.rq.id, 
            is_deleted  : 1, 
        })

    },

////////////////////////////////////////////////////////////////////////////////

do_update_ssh_hosts: 

    async function () {
    
        let data = this.rq.data

        data.uuid = this.rq.id
        
        try {
            await this.db.upsert ('ssh_hosts', data)
        }
        catch (x) {
            throw x.constraint == 'ix_ssh_hosts_host' ? '#host#: Этот host уже зарегистрирован' : x
        }

    },

}