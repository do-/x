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
    
    async function () {
   
        this.rq.sort = this.rq.sort || [{field: "ts_created", direction: "desc"}]

        if (this.rq.searchLogic == 'OR') {

            let q = this.rq.search [0].value

            this.rq.search = [
                {field: 'cmd', operator: 'contains', value: q},
            ]
            
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test (q)) 
            	this.rq.search.push ({field: 'uuid', operator: 'is', value: q})

        }

        let filter = this.w2ui_filter ()
        
        filter.is_deleted = 0

        let data = await this.db.add_all_cnt ({}, [{vw_ssh_commands: filter}])
        
        if (data.vw_ssh_commands.length == 0) return data

		let idx = {}; for (let i of data.vw_ssh_commands) {
			i.cnt = 0
			i.s_ok = 0
			i.s_nok = 0
			idx [i.uuid] = i			
		}
		
		let ids = Object.keys (idx)

		let qs = ',?'.repeat (ids.length).substr (1)
		
		await this.db.select_loop (`SELECT id_command, status, COUNT(*) cnt FROM vw_ssh_command_items WHERE id_command IN (${qs}) GROUP BY 1, 2`, ids, i => {
			let r = idx [i.id_command] 
			let cnt = parseInt (i.cnt)
			r ['s_' + i.status] = cnt
			r.cnt += cnt
			if (i.status != 'ok') r.s_nok += cnt
		})
		
        return data

    },

////////////////////////////////////////////////////////////////////////////////
    
get_item_of_ssh_commands: 

    async function () {
        
        let data = await this.db.get ([{vw_ssh_commands: 

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
       	
       	let hosts = new Set ()

        data.addr = JSON.stringify (addr.map (a => {

        	let [_, username, host, p] = /^([\w\.\-]+)\@([\w\.\-]+)(\:\d+)?$/.exec (a) || []

        	if (!_) throw `#addr#:Некорректный адрес: '${a}' (ожидается: user@host[:port])`

        	if (hosts.has (host)) 
        		throw `#addr#:Адрес '${a}': host '${host}' уже был упомянут в данном списке`;
        	else 
	        	hosts.add (host)

        	port = p ? p.substr (1) : 22

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

		let args = (await this.db.list ([{vw_ssh_command_items: {id_command: this.rq.id}}])).map (item => ([
			{type: 'ssh_command_items', action: 'run', id: item.uuid}, 
			{data: {item, path}}
		]))
		
		let par = parseInt (item.par); if (!(par > 0)) throw `#par#:Broken parallelism limit value: ${item.par}`

		let on = 0, task = async (arg) => {			
			try {
				await this.fork0 (arg [0], arg [1])
			}
			finally {
				on --
			}			
		}
		
		let tasks = []
						
		await new Promise (function (ok, fail) {

			let watch = null
			
			function terminate () {
			
				if (watch) clearInterval (watch)
									
				return ok (watch = null)
				
			}
			
			watch = setInterval (function () {
			
				if (!watch) return

				let todo = args.length

				if (todo == 0 && on == 0) return terminate ()

				let available = par - on
				
				if (todo > available) todo = available
				
				if (todo < 0) todo = 0
				
				if (todo == 0) return
				
				on += todo
				
				tasks = tasks.concat (args.splice (0, todo).map (task))

			}, 10)
			
			setTimeout (terminate, 1000 * parseInt (item.timeout))
		
		})
		
		await Promise.all (tasks)
				
		try {
			
			await this.db.do ('UPDATE ssh_command_items SET ts_from = now(), ts_to = now(), error = ? WHERE id_command = ? AND ts_from IS NULL', ['Global timeout expired', item.uuid])
		
			await this.fork ({action: 'notify_completion'})
			
		}
		catch (e) {
			darn (e)
		}

    },

////////////////////////////////////////////////////////////////////////////////

do_notify_completion_ssh_commands: 

    async function () {
    
		let db = this.db
    	let id = this.rq.id
    
		let log = await db.list (
			[{'vw_ssh_command_items(host AS ci_code, status, error AS comments)': {
				id_command: id, 
				'status <>': 'ok'
			}}]
		)
		
		let data = {
			x5cideploymentlog: {
				log: JSON.stringify (log), 
				task_id: id
			}
		}

		let json = JSON.stringify (data)
		
		let ssh_settings = await this.db.get ([{ssh_settings: {id: 1}}])
		
		let o = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': json.length
			}
		}
		
		if (ssh_settings.cb_user) o.auth = ssh_settings.cb_user + ':' + ssh_settings.cb_pass

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

				http.request (ssh_settings.cb_url, o, rp => {

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