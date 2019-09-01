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
    
////////////////////////////////////////////////////////////////////////////////

do_run_ssh_command_items: 

    async function () {
    
		let item = await this.db.get ([{ssh_command_items: {uuid: this.rq.id}}
        	, 'ssh_hosts'
        	, 'ssh_commands'
        ])    
        
        let db = this.db
        
        let Client = require ('ssh2').Client

        let uuid = item.uuid

        let o = {}; for (let k of ['host', 'port', 'username', 'password']) o [k] = item ['ssh_hosts.' + k]

		let key = `${o.host}:${o.port}`

		let conn = new Client ()

		conn.on ('ready', function () {

			darn (`SSH ${key} connected`)
			db.update ('ssh_command_items', {uuid, ts_conn: new Date ()})

			conn.exec (item ['ssh_commands.cmd'], function (err, stream) {

				if (err) throw err;

				stream.on ('close', function (code, signal) {
					conn.end ()
					darn (`SSH ${key} disconnected`)						
					db.update ('ssh_command_items', {uuid, code, signal, ts_to: new Date ()})
				})
				.on ('data', function(data) {
				  darn ('STDOUT: ' + data);
				})
				.stderr.on ('data', function(data) {
				  darn ('STDERR: ' + data);
				})

			})

		})

		darn (`SSH ${key} connecting...`)
		db.update ('ssh_command_items', {uuid, ts_from: new Date ()})

		conn.connect (o)

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