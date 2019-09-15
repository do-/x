module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_run_ssh_batch: 

    async function () {
    
    	this.rq.id = this.uuid
    	
    	if (this.rq.cmd == null) throw '-32602 Empty cmd'
    	if (this.rq.addr == null) throw '-32602 Empty addr'
    	if (!Array.isArray (this.rq.addr)) throw '-32602 The addr parameter must be an array'

		return await this.fork ({type: 'ssh_commands', action: 'create'}, {data: {
			cmd  : this.rq.cmd,
			ttl  : 5,
			addr : this.rq.addr,
		}})

    },

}