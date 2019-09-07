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
   
        this.rq.sort = this.rq.sort || [{field: "host", direction: "asc"}]
    
        let filter = this.w2ui_filter ()
        
        return this.db.add_all_cnt ({}, [{vw_ssh_command_items: filter}])

    },
    
////////////////////////////////////////////////////////////////////////////////

do_update_ssh_command_items: 

    async function () {

        let data = this.rq.data

        data.uuid = this.rq.id

		await this.db.update ('ssh_command_items', data)

    },    
    
////////////////////////////////////////////////////////////////////////////////

do_run_ssh_command_items: 

    async function () {
    
		let item = await this.db.get ([{ssh_command_items: {uuid: this.rq.id}}
        	, 'ssh_hosts'
        	, 'ssh_commands'
        ])    

        let Client = require ('ssh2').Client

        let uuid = item.uuid

        let o = {
        	username: 'root', 
        	privateKey: this.conf.ssh.privateKey,
        }

        for (let k of ['host', 'port']) o [k] = item ['ssh_hosts.' + k]

		let key = `${item.id_command} ${o.host}:${o.port}`

		let conn = new Client ()
		
		let q = this.queue
		
		function log (msg, data) {
			darn (`SSH ${key} ${msg}`)
			q.publish ('ssh_command_items', 'do_update_ssh_command_items', {id: item.uuid, data})			
		}
		
		const fs = require ('fs')
		let path = this.rq.data.path
		
		function appender (ext) {
			return function (data) {
				fs.promises.appendFile (path + '/' + o.host + '.' + ext, data)
			}
		}

		conn.on ('ready', function () {

			log ('connected', {ts_conn: new Date ()})
			
			conn.exec ('timeout ' + item ['ssh_commands.ttl'] + 's ' + item ['ssh_commands.cmd'], function (err, stream) {

				if (err) throw err

				stream.on ('data', appender ('out'))
				stream.stderr.on ('data', appender ('err'))

				stream.on ('close', function (code, signal) {
					conn.end ()
					log ('disconnected', {code, signal, ts_to: new Date ()})
				})

			})

		})
		
		conn.on ('error', function(data) {
			conn.end ()
			let error = data.message
			log ('connection failed: ' + error, {ts_to: new Date (), error})
		})
		
		log ('connecting', {ts_from: new Date ()})

		conn.connect (o)		

	},
    
}