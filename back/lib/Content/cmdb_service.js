const http = require ('http')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_call_cmdb_service: 

    async function () {
    
		let json = JSON.stringify (this.rq.body)
				
		let o = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
//				'Content-Length': json.length
			}
		}
		
		let db = this.db		

		let ssh_settings = await db.get ([{ssh_settings: {id: 1}}])

		let url = ssh_settings [this.rq.url]

		if (ssh_settings.cb_user) o.auth = ssh_settings.cb_user + ':' + ssh_settings.cb_pass
		
		let log = this.rq.log; async function update (data) {
			let d = {uuid: log.id}
			for (let k in data) d [log.fields [k]] = data [k]
			return db.update (log.table, d)
		}
		
		let sniff = (rq, rp, body) => {
			darn (`${this.uuid}: ${JSON.stringify (rq._header)} ${json} -> ${JSON.stringify (rp.headers)} ${body}`)
		}
				
		try {

			await new Promise (async function (ok, fail) {

				await update ({
					ts_start  : new Date (),
					ts_finish : null,
					ts_error  : null,
					error     : null,
				})

				let rq = http.request (url, o, rp => {
				
					let body = ''
					
					rp.setEncoding ('utf8')
					rp.on ('data', s => body += s)
					rp.on ('end', () => sniff (rq, rp, body))

					let code = rp.statusCode; if (code == 200) return ok ()

					fail (new Error (code + ' ' + rp.statusMessage))

				}).on ('error', fail).end (json)

			})		

		}
		catch (x) {
		
			let error = x.message
			
			await update ({ts_error: new Date (), error})		
			
			throw ('#foo#: ' + error)
		
		}
		
		await update ({ts_finish: new Date ()})    
    
    },

}