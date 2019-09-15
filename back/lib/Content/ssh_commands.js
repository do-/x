const Dia = require ('../Ext/Dia/Dia.js')
const http = require ('http')

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

    	if (data.cmd == null) throw '#cmd#:Не указана команда для запуска'

       	let addr = data.addr       	
       	if (addr == null) throw '#addr#:Не указаны адреса'
       	if (!Array.isArray (addr)) throw '#addr#:Некорректный формат списка адресов'
       	if (!addr.length) throw '#addr#:Список адресов пуст'

        data.addr = JSON.stringify (addr.map (a => {
        	let [username, host, port] = (a + ':22').split (/[\@\:]/)
        	return {username, host, port}
        }))

        data.uuid = this.rq.id
    	data.path = (new Date ().toJSON ().substr (0, 10).replace (/-/g, '/')) + '/' + data.uuid

        try {
	       	await this.db.insert ('ssh_commands', data)
        }
        catch (x) {
            if (this.db.is_pk_violation (x)) return {}
            throw x
        }

       	await this.db.commit ()

       	this.fork ({action: 'run'})
       	
       	return {}

    },

////////////////////////////////////////////////////////////////////////////////

do_run_ssh_commands: 

    async function () {

        let item = await this.db.get ([{ssh_commands: {uuid: this.rq.id}}])

    	let path = this.conf.ssh.logs + '/' + item.path

		require ('fs').mkdirSync (path, {recursive: true})

		let data = {data: {path}}

		let tia = (await this.db.list ([{'ssh_command_items(uuid)': {id_command: this.rq.id}}])).map (i => ({
			type: 'ssh_command_items', 
			id: i.uuid, 
			action: 'run',
		}))

		let all = await Promise.all (tia.map (i => this.fork (i, data)))

		this.fork ({action: 'notify_completion'})

    },

////////////////////////////////////////////////////////////////////////////////

do_notify_completion_ssh_commands: 

    async function () {
    
		let db = this.db
    	let id = this.rq.id
    
		let status = await db.fold (
			[{'vw_ssh_command_items(host, status)': {id_command: id}}],
			(i, h) => h [i.host] = i.status,
			{}
		)
		
		let data = {id, status}
				
		let json = JSON.stringify (data)
		
		let o = this.conf.ssh.callback
		o.method = 'POST'
		o.headers = {
			'Content-Type': 'application/json',
			'Content-Length': json.length
		}				

		async function update (data) {
			data.uuid = id
			return db.update ('ssh_commands', data)
		}
		
		db.commit ()
		
		try {

			await new Promise (async function (ok, fail) {

				await update ({
					ts_notif_start  : new Date (),
					ts_notif_finish : null,
					ts_notif_error  : null,
					notif_error     : null,
				})

				http.request (o, rp => {

					let code = rp.statusCode; if (code == 200) return ok ()

					fail (new Error (code + ' ' + rp.statusMessage))

				}).on ('error', fail).end (json)

			})		

		}
		catch (x) {
		
			let notif_error = x.message
			
			await update ({ts_notif_error: new Date (), notif_error})		
			
			throw ('#foo#: ' + notif_error)
		
		}
		
		await update ({ts_notif_finish: new Date ()})

    },

}