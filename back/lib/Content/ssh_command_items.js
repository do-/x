const Dia = require ('../Ext/Dia/Dia.js')
const Client = require ('ssh2').Client

module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_ssh_command_items: 

    function () {

        return this.db.add_vocabularies ({_fields: this.db.model.tables.ssh_command_items.columns}, {
        })

    },
    
////////////////////////////////////////////////////////////////////////////////

select_ssh_command_items: 
    
    async function () {
   
        this.rq.sort = this.rq.sort || [{field: "ts_from", direction: "asc"}]
    
        let filter = this.w2ui_filter ()

		filter.id_command = this.rq.data.id_command
	
        let data = await this.db.add_all_cnt ({}, [{vw_ssh_command_items: filter}])
        
		const fs = require ('fs')
		
		let root = this.conf.ssh.logs + '/'

        for (let i of data.vw_ssh_command_items) {

        	for (let j of ['out', 'err']) {

        		let path = root + i ['path_' + j]

        		if (fs.existsSync (path)) i [j] = fs.statSync (path).size

        	}

        }        

        return data

    },
    
////////////////////////////////////////////////////////////////////////////////

do_update_ssh_command_items: 

    async function () {

        let data = this.rq.data

        data.uuid = this.rq.id

		return this.db.update ('ssh_command_items', data)

    },    
    
////////////////////////////////////////////////////////////////////////////////

do_run_ssh_command_items: 

    async function () {

		let item = this.rq.data.item

        let uuid = item.uuid

		const fs = require ('fs')

        let o = {privateKey: fs.readFileSync (this.conf.ssh.private_key)}
        for (let k of ['username', 'host', 'port']) o [k] = item [k]

		let key = `${item.id_command} ${item.uuid} ${o.username}@${o.host}:${o.port}`
		
		let subtasks = []
						
		let log = (msg, data) => {
			darn (`SSH ${key} ${msg}`);
			subtasks.push (this.fork ({action: 'update'}, {data}))
		}
		
		let fn = this.rq.data.path + '/' + o.host + '.' 

		let append = (ext) => ((data) => fs.appendFile (fn + ext + '.txt', data, e => {if (e) darn (e)}))

		let conn = new Client ()
				
		conn.on ('ready', function () {

			log ('connected', {ts_conn: new Date ()})
			
			try {
			
				conn.exec ('nohup ' + item.cmd + ' & sleep 0.01s', {pty: true}, function (err, stream) {

					if (err) throw err

					stream.stderr.on ('data', append ('err'))
					stream.on        ('data', append ('out'))
					stream.on        ('close', function (code, signal) {
						log ('closed', {code, signal})
						conn.end ()
					})

				})
			
			}
			catch (err) {
				darn (err)
			}

		})
								
		return new Promise (function (ok, fail) {
		
			let off = false
			
			function done () {
				if (off) return
				let quit = () => ok (off = uuid)
				Promise.all (subtasks).then (quit).catch (quit)
			}

			conn.on ('end', () => {
				log ('disconnected', {ts_to: new Date ()})
				done ()
			})

			function die (error) {
				if (off) return
				log (error, {ts_to: new Date (), error})
				conn.end ()
				done ()
			}
			
			conn.on ('error', function (x) {
				darn (x)
				die (x.message)
			})					

			setTimeout (() => die ('timeout expired'), 1000 * (item.ttl + 1))

			log ('connecting', {ts_from: new Date ()})
			
			try {
				conn.connect (o)		
			}
			catch (x) {
				die (x.message)
			}

		})

	},
    
}