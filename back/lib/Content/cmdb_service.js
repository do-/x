const http = require ('http')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_log_cmdb_service: 

    async function () {

		let log = this.rq.log
		let data = this.rq.data
		
		let d = {uuid: log.id}
			
		for (let k in data) d [log.fields [k]] = data [k]
			
		return this.db.update (log.table, d)		

    },

////////////////////////////////////////////////////////////////////////////////

do_call_cmdb_service: 

    async function () {

		let log = async (data) => this.fork ({action: 'log'}, {data, log: this.rq.log})

		try {

			await log ({ts_start: new Date (), ts_finish: null, ts_error: null, error: null})

			await this.http.response ({}, JSON.stringify (this.rq.body))

		}
		catch (x) {

			let error = x.message

			await update ({ts_error: new Date (), error})		

			x.message = this.uuid + ': ' + error

			darn (x)

		}

		await log ({ts_finish: new Date ()})

    },

}