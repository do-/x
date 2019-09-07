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

       	let addr = data.addr
       	
       	if (!addr || !addr.length) throw '#addr#: Не указаны адреса'

        data.addr = JSON.stringify (addr.map (a => {
        	let [username, host, port] = (a + ':22').split (/[\@\:]/)
        	return {username, host, port}
        }))

        data.uuid = this.rq.id

       	this.db.insert ('ssh_commands', data)
       	
       	this.queue.publish ('ssh_commands', 'do_run_ssh_commands', {id: data.uuid})

    },

////////////////////////////////////////////////////////////////////////////////

do_run_ssh_commands: 

    async function () {
    
    	let path = this.conf.ssh.logs + '/' + (new Date ().toJSON ().substr (0, 10).replace (/-/g, '/')) + '/' + this.rq.id

		require ('fs').mkdirSync (path, {recursive: true})
		
    	this.db.fold (

    		[{'ssh_command_items(uuid)': {id_command: this.rq.id}}], 

    		item => this.queue.publish ('ssh_command_items', 'do_run_ssh_command_items', {id: item.uuid, data: {path}})

    	)

    }

}