const Dia = require ('../Ext/Dia/Dia.js')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_ssh_commands: 

    function () {

        return this.db.add_vocabularies ({_fields: this.db.model.tables.ssh_commands.columns}, {
        })

    },
    
////////////////////////////////////////////////////////////////////////////////

select_ssh_commands: 
    
    function () {
   
        this.rq.sort = this.rq.sort || [{field: "ts_created", direction: "desc"}]

        if (this.rq.searchLogic == 'OR') {

            let q = this.rq.search [0].value

            this.rq.search = [
                {field: 'cmd', operator: 'contains', value: q},
            ]

        }
    
        let filter = this.w2ui_filter ()
        
        filter.is_deleted  = 0

        return this.db.add_all_cnt ({}, [{ssh_commands: filter}])

    },

////////////////////////////////////////////////////////////////////////////////
    
get_item_of_ssh_commands: 

    async function () {
        
        let data = await this.db.get ([{ssh_commands: 

            {uuid: this.rq.id},

        }])
        
        data._fields = this.db.model.tables.ssh_commands.columns
        
        return data

    },

////////////////////////////////////////////////////////////////////////////////

do_delete_ssh_commands: 

    async function () {
    
        this.db.update ('ssh_commands', {
            uuid        : this.rq.id, 
            is_deleted  : 1, 
        })

    },

////////////////////////////////////////////////////////////////////////////////

do_create_ssh_commands: 

    async function () {
    
        let data = this.rq.data

       	let id_host = data.id_host; if (!id_host || !id_host.length) throw '#id_host#: Не указаны hostы'

        data.uuid = this.rq.id

       	let result = await this.db.insert ('ssh_commands', data)

       	await this.db.insert ('ssh_command_items', id_host.map (id_host => ({id_host, id_command: data.uuid})))

       	return result

    },

////////////////////////////////////////////////////////////////////////////////

do_run_ssh_commands: 

    async function () {
    
		let items = await this.db.list ([{ssh_command_items: {id_command: this.rq.id}}])    
        
        for (let item of items) 
        
        	this.queue.publish ('ssh_command_items', 'do_run_ssh_command_items', {id: item.uuid})        

    }

}